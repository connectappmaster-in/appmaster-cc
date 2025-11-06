import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, AlertCircle, CheckCircle, Clock } from "lucide-react";

const Tickets = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Incident Management</h1>
            <p className="text-muted-foreground">Track and manage IT incidents</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="open" className="flex-1 flex flex-col overflow-hidden p-6 pt-0">
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="flex-1 overflow-auto mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Network Connectivity Issue
                  </CardTitle>
                  <CardDescription>Ticket #1001 • Created 2 hours ago</CardDescription>
                </div>
                <Badge variant="destructive">High Priority</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Multiple users reporting intermittent network connectivity in Building A
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Software License Expiration
                  </CardTitle>
                  <CardDescription>Ticket #1002 • Created 5 hours ago</CardDescription>
                </div>
                <Badge variant="secondary">Medium Priority</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Adobe Creative Suite licenses expiring in 7 days
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress" className="flex-1 overflow-auto mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Printer Maintenance
                  </CardTitle>
                  <CardDescription>Ticket #1003 • In progress for 1 day</CardDescription>
                </div>
                <Badge>In Progress</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Scheduled maintenance for all office printers
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="flex-1 overflow-auto mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Password Reset Request
                  </CardTitle>
                  <CardDescription>Ticket #1004 • Resolved 3 days ago</CardDescription>
                </div>
                <Badge variant="outline">Resolved</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                User password reset completed successfully
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tickets;
