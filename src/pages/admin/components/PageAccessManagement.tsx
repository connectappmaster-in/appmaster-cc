import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, RefreshCw, Lock, Unlock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Page {
  id: string;
  name: string;
  route: string;
  description: string | null;
}

interface PageAccess {
  id: string;
  page_id: string;
  role_name: string;
  has_access: boolean;
}

const ROLES = ['employee', 'tech_lead', 'management', 'admin'];
const ROLE_LABELS = {
  employee: 'Employee',
  tech_lead: 'Tech Lead',
  management: 'Management',
  admin: 'Admin'
};

export default function PageAccessManagement() {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [pageAccess, setPageAccess] = useState<PageAccess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .order('name');

      if (pagesError) throw pagesError;

      // Load page access
      const { data: accessData, error: accessError } = await supabase
        .from('page_access')
        .select('*');

      if (accessError) throw accessError;

      setPages(pagesData || []);
      setPageAccess(accessData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAccessForPageRole = (pageId: string, role: string): boolean => {
    const access = pageAccess.find(
      a => a.page_id === pageId && a.role_name === role
    );
    return access?.has_access || false;
  };

  const handleToggleAccess = async (pageId: string, role: string, currentAccess: boolean) => {
    try {
      // Check if record exists
      const existing = pageAccess.find(
        a => a.page_id === pageId && a.role_name === role
      );

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('page_access')
          .update({ has_access: !currentAccess })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('page_access')
          .insert({
            page_id: pageId,
            role_name: role,
            has_access: !currentAccess
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Access ${!currentAccess ? 'granted' : 'revoked'} successfully`
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleGrantAllAccess = async (pageId: string) => {
    try {
      for (const role of ROLES) {
        const existing = pageAccess.find(
          a => a.page_id === pageId && a.role_name === role
        );

        if (existing) {
          await supabase
            .from('page_access')
            .update({ has_access: true })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('page_access')
            .insert({
              page_id: pageId,
              role_name: role,
              has_access: true
            });
        }
      }

      toast({
        title: "Success",
        description: "All roles granted access"
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleRevokeAllAccess = async (pageId: string) => {
    try {
      for (const role of ROLES) {
        const existing = pageAccess.find(
          a => a.page_id === pageId && a.role_name === role
        );

        if (existing) {
          await supabase
            .from('page_access')
            .update({ has_access: false })
            .eq('id', existing.id);
        }
      }

      toast({
        title: "Success",
        description: "All roles access revoked"
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Page Access Control
          </h2>
          <p className="text-muted-foreground">Manage role-based access to application pages</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Access Matrix</CardTitle>
          <CardDescription>
            Toggle switches to grant or revoke page access for each role
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            <div className="px-6 pb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Page</TableHead>
                    <TableHead>Route</TableHead>
                    {ROLES.map(role => (
                      <TableHead key={role} className="text-center">
                        {ROLE_LABELS[role as keyof typeof ROLE_LABELS]}
                      </TableHead>
                    ))}
                    <TableHead className="text-right">Quick Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={ROLES.length + 3} className="text-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Loading pages...
                      </TableCell>
                    </TableRow>
                  ) : pages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={ROLES.length + 3} className="text-center py-8">
                        No pages found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pages.map(page => (
                      <TableRow key={page.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{page.name}</p>
                            {page.description && (
                              <p className="text-xs text-muted-foreground">{page.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{page.route}</code>
                        </TableCell>
                        {ROLES.map(role => {
                          const hasAccess = getAccessForPageRole(page.id, role);
                          return (
                            <TableCell key={role} className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Switch
                                  checked={hasAccess}
                                  onCheckedChange={() => handleToggleAccess(page.id, role, hasAccess)}
                                />
                                {hasAccess ? (
                                  <Badge variant="default" className="w-16">
                                    Granted
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="w-16">
                                    Denied
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGrantAllAccess(page.id)}
                            >
                              <Unlock className="mr-2 h-3 w-3" />
                              Grant All
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeAllAccess(page.id)}
                            >
                              <Lock className="mr-2 h-3 w-3" />
                              Revoke All
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Access Control Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>Admin:</strong> Full system access - manages users, settings, and configurations</p>
          <p>• <strong>Management:</strong> Access to management reports, analytics, and oversight functions</p>
          <p>• <strong>Tech Lead:</strong> Access to technical features, team management, and approvals</p>
          <p>• <strong>Employee:</strong> Basic access to core application features</p>
        </CardContent>
      </Card>
    </div>
  );
}
