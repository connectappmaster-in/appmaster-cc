import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package, Key, AlertTriangle } from "lucide-react";

const Assets = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asset Management</h1>
            <p className="text-muted-foreground">Manage software licenses, procurement & inventory</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="licenses" className="flex-1 flex flex-col overflow-hidden p-6 pt-0">
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="licenses">Software & Licenses</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="flex-1 overflow-auto mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Microsoft 365 Enterprise
                  </CardTitle>
                  <CardDescription>License Type: Enterprise • 150 seats</CardDescription>
                </div>
                <Badge>Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expiration Date:</span>
                  <span className="font-medium">Dec 31, 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used / Total:</span>
                  <span className="font-medium">142 / 150</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Annual Cost:</span>
                  <span className="font-medium">$18,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Adobe Creative Cloud
                  </CardTitle>
                  <CardDescription>License Type: Team • 25 seats</CardDescription>
                </div>
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Expiring Soon
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expiration Date:</span>
                  <span className="font-medium text-destructive">Jan 15, 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used / Total:</span>
                  <span className="font-medium">25 / 25</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Annual Cost:</span>
                  <span className="font-medium">$15,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="flex-1 overflow-auto mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Dell Latitude 5420 Laptops
                  </CardTitle>
                  <CardDescription>Category: Hardware • Location: Main Office</CardDescription>
                </div>
                <Badge>In Stock</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Units:</span>
                  <span className="font-medium">35</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assigned:</span>
                  <span className="font-medium">28</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available:</span>
                  <span className="font-medium">7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procurement" className="flex-1 overflow-auto mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Network Switch Upgrade</CardTitle>
                  <CardDescription>PO #2025-001 • Requested on Jan 5, 2025</CardDescription>
                </div>
                <Badge variant="secondary">Pending Approval</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vendor:</span>
                  <span className="font-medium">Cisco Systems</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Cost:</span>
                  <span className="font-medium">$45,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Date:</span>
                  <span className="font-medium">Feb 15, 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assets;
