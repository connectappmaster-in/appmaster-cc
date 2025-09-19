import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Shield, AlertTriangle } from "lucide-react";
import { Policy } from "./PolicyCard";

interface StatsOverviewProps {
  policies: Policy[];
}

export const StatsOverview = ({ policies }: StatsOverviewProps) => {
  const totalPremiums = policies.reduce((sum, policy) => sum + policy.premium, 0);
  const totalCoverage = policies.reduce((sum, policy) => sum + policy.coverage, 0);
  const expiringPolicies = policies.filter(policy => policy.status === 'expiring').length;
  const activePolicies = policies.filter(policy => policy.status === 'active').length;

  const stats = [
    {
      title: "Total Annual Premiums",
      value: `$${totalPremiums.toLocaleString()}`,
      icon: DollarSign,
      description: "Across all policies",
      trend: "+2.5% from last year",
      color: "text-primary"
    },
    {
      title: "Total Coverage",
      value: `$${(totalCoverage / 1000000).toFixed(1)}M`,
      icon: Shield,
      description: "Protection value",
      trend: "Active coverage",
      color: "text-accent"
    },
    {
      title: "Active Policies",
      value: activePolicies.toString(),
      icon: TrendingUp,
      description: "Currently active",
      trend: `${policies.length} total policies`,
      color: "text-success"
    },
    {
      title: "Renewal Alerts",
      value: expiringPolicies.toString(),
      icon: AlertTriangle,
      description: "Expiring soon",
      trend: "Requires attention",
      color: "text-warning"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-muted-foreground mt-1 opacity-75">{stat.trend}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};