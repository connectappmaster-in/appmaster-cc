import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

const OrganisationSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Organization Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your organization's profile and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Information
          </CardTitle>
          <CardDescription>
            Update your organization's basic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input id="org-name" placeholder="Enter organization name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-email">Contact Email</Label>
            <Input id="org-email" type="email" placeholder="contact@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-address">Address</Label>
            <Input id="org-address" placeholder="Enter address" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Configure system preferences and defaults
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Preference management coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganisationSettings;
