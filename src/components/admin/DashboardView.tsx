import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, Activity, TrendingUp } from 'lucide-react';

const DashboardView = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '0',
      icon: Users,
      description: 'Active users',
    },
    {
      title: 'Active Subscriptions',
      value: '0',
      icon: CreditCard,
      description: 'Current period',
    },
    {
      title: 'System Activity',
      value: '0',
      icon: Activity,
      description: 'Actions today',
    },
    {
      title: 'Revenue',
      value: '$0',
      icon: TrendingUp,
      description: 'This month',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your organization's key metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No recent activity to display
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;
