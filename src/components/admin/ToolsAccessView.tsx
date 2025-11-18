import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

const ToolsAccessView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tools Access</h1>
        <p className="text-muted-foreground mt-2">
          Control which tools users can access
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Available Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No tools configured. Tools access management coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolsAccessView;
