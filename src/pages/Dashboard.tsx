import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Briefcase, 
  Package, 
  Ticket, 
  Building2,
  FileText,
  TrendingUp,
  Clock,
  Lock,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  route: string;
  color: string;
}

const tools: Tool[] = [
  {
    id: 'crm',
    name: 'CRM',
    description: 'Manage leads, customers, and opportunities',
    icon: Users,
    route: '/crm',
    color: 'text-blue-500',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Track stock and manage warehouses',
    icon: Package,
    route: '/inventory',
    color: 'text-green-500',
  },
  {
    id: 'tickets',
    name: 'Tickets',
    description: 'Handle support tickets and issues',
    icon: Ticket,
    route: '/tickets',
    color: 'text-orange-500',
  },
  {
    id: 'assets',
    name: 'Assets',
    description: 'Manage company assets and depreciation',
    icon: Building2,
    route: '/assets',
    color: 'text-purple-500',
  },
  {
    id: 'invoicing',
    name: 'Invoicing',
    description: 'Create and manage invoices',
    icon: FileText,
    route: '/invoicing',
    color: 'text-pink-500',
  },
  {
    id: 'recruitment',
    name: 'Recruitment',
    description: 'Manage hiring and candidates',
    icon: Briefcase,
    route: '/recruitment',
    color: 'text-indigo-500',
  },
];

const Dashboard = () => {
  const { user, profile, organisation, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isToolActive = (toolId: string) => {
    return organisation?.active_tools?.includes(toolId) ?? false;
  };

  const canActivateTool = async () => {
    if (!organisation) return false;
    
    const { data, error } = await supabase.rpc('can_activate_tool', {
      org_id: organisation.id
    });
    
    return data && !error;
  };

  const handleToolClick = async (tool: Tool) => {
    if (!isToolActive(tool.id)) {
      // Check if can activate
      const canActivate = await canActivateTool();
      
      if (!canActivate) {
        toast({
          title: "Upgrade Required",
          description: "You've reached your tool limit. Upgrade your plan to activate more tools.",
          variant: "destructive",
        });
        navigate('/admin?view=subscriptions');
        return;
      }

      // Activate tool
      const { error } = await supabase
        .from('organisations')
        .update({
          active_tools: [...(organisation?.active_tools || []), tool.id]
        })
        .eq('id', organisation?.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to activate tool",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Tool Activated",
        description: `${tool.name} has been activated successfully`,
      });

      // Refresh page to update context
      window.location.reload();
      return;
    }

    navigate(tool.route);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile || !organisation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{organisation.name}</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {profile.name || profile.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="capitalize">
                {organisation.plan} Plan
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                Admin
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Metrics */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Tools
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {organisation.active_tools?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {organisation.plan === 'free' ? '/ 1 allowed' : 'Unlimited'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                User Role
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground capitalize">
                {profile.role}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active status
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Login
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                Today
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Performance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                100%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                System uptime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tool Grid */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Tools</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const active = isToolActive(tool.id);

              return (
                <Card
                  key={tool.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    active ? 'border-primary' : 'opacity-75'
                  }`}
                  onClick={() => handleToolClick(tool)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-accent ${tool.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          {active ? (
                            <Badge variant="default" className="mt-1">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="mt-1">
                              <Lock className="h-3 w-3 mr-1" />
                              Activate
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
