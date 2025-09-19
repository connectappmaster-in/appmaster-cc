import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Policy {
  id: string;
  type: string;
  provider: string;
  policyNumber: string;
  premium: number;
  coverage: number;
  deductible: number;
  renewalDate: string;
  status: 'active' | 'expired' | 'expiring';
}

interface PolicyCardProps {
  policy: Policy;
  onEdit: (policy: Policy) => void;
  onView: (policy: Policy) => void;
}

const getPolicyIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'auto':
      return '🚗';
    case 'home':
      return '🏠';
    case 'health':
      return '🏥';
    case 'life':
      return '❤️';
    default:
      return '📄';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-success text-success-foreground';
    case 'expired':
      return 'bg-destructive text-destructive-foreground';
    case 'expiring':
      return 'bg-warning text-warning-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const PolicyCard = ({ policy, onEdit, onView }: PolicyCardProps) => {
  const isExpiring = policy.status === 'expiring';
  
  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] cursor-pointer",
      "bg-gradient-to-br from-card to-card/50 border-border/50",
      isExpiring && "ring-2 ring-warning/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getPolicyIcon(policy.type)}</div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {policy.type} Insurance
              </CardTitle>
              <p className="text-sm text-muted-foreground">{policy.provider}</p>
            </div>
          </div>
          <Badge className={getStatusColor(policy.status)} variant="secondary">
            {policy.status === 'expiring' ? 'Expiring Soon' : policy.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <div>
              <p className="text-muted-foreground">Premium</p>
              <p className="font-medium">${policy.premium.toLocaleString()}/year</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent" />
            <div>
              <p className="text-muted-foreground">Coverage</p>
              <p className="font-medium">${policy.coverage.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="text-muted-foreground">Renewal</p>
              <p className="font-medium">{new Date(policy.renewalDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <div>
              <p className="text-muted-foreground">Deductible</p>
              <p className="font-medium">${policy.deductible.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(policy)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onEdit(policy)}
            className="flex-1"
          >
            Edit Policy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};