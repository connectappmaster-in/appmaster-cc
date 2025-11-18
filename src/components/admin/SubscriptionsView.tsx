import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

const SubscriptionsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground mt-2">
            Manage organization subscription plans
          </p>
        </div>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No active subscriptions. Subscription management coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsView;
