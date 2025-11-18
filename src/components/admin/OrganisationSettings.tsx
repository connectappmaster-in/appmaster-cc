import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Building2, CreditCard, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const OrganisationSettings = () => {
  const { organisation, refreshAuth } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  useEffect(() => {
    if (organisation) {
      setName(organisation.name || '');
      setAddress((organisation as any).address || '');
      setBillingEmail((organisation as any).billing_email || '');
      setGstNumber((organisation as any).gst_number || '');
      setTimezone((organisation as any).timezone || 'Asia/Kolkata');
      loadSubscription();
    }
  }, [organisation]);

  const loadSubscription = async () => {
    if (!organisation) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('organisation_id', organisation.id)
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organisation) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('organisations')
        .update({
          name,
          address,
          billing_email: billingEmail,
          gst_number: gstNumber,
          timezone,
        })
        .eq('id', organisation.id);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        organisation_id: organisation.id,
        action_type: 'org_settings_updated',
        entity_type: 'organisation',
        entity_id: organisation.id,
        metadata: { name, address, billingEmail, gstNumber, timezone },
      });

      toast({
        title: 'Settings Updated',
        description: 'Your organization settings have been saved successfully',
      });

      await refreshAuth();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Organization Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your organization's profile and preferences
        </p>
      </div>

      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>Your current plan and usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-2xl font-bold capitalize">{subscription.plan_name}</p>
              </div>
              <Badge variant="default" className="text-lg px-4 py-2 capitalize">
                {subscription.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Max Users</p>
                <p className="text-lg font-semibold">
                  {subscription.limits?.max_users === -1
                    ? 'Unlimited'
                    : subscription.limits?.max_users || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Max Tools</p>
                <p className="text-lg font-semibold">
                  {subscription.limits?.max_tools === -1
                    ? 'Unlimited'
                    : subscription.limits?.max_tools || 0}
                </p>
              </div>
            </div>

            {subscription.renewal_date && (
              <div>
                <p className="text-sm text-muted-foreground">Renewal Date</p>
                <p className="text-lg font-semibold">
                  {new Date(subscription.renewal_date).toLocaleDateString()}
                </p>
              </div>
            )}

            <Button variant="outline" className="w-full">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Profile
          </CardTitle>
          <CardDescription>Update your organization's basic information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter organization name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing-email">Billing Email</Label>
              <Input
                id="billing-email"
                type="email"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                placeholder="billing@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your organization address"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gst">GST Number</Label>
              <Input
                id="gst"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="Enter GST number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                  <SelectItem value="Asia/Singapore">Asia/Singapore (SGT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preferences
          </CardTitle>
          <CardDescription>Configure system preferences and defaults</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Additional preferences will be available in future updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganisationSettings;
