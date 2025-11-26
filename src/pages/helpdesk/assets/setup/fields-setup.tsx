import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Building2, MapPin, FolderTree, Briefcase, Hash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAssetSetupConfig } from "@/hooks/useAssetSetupConfig";

export default function FieldsSetupPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("tag-format");
  const { sites, locations, categories, departments, tagFormat: existingTagFormat } = useAssetSetupConfig();
  
  const [tagPrefix, setTagPrefix] = useState("");
  const [tagStartNumber, setTagStartNumber] = useState("");

  // Automatically calculate padding length from starting number
  const tagPaddingLength = tagStartNumber.length || 4;

  // Load existing tag format when it's available
  useEffect(() => {
    if (existingTagFormat) {
      setTagPrefix(existingTagFormat.prefix || "AS-");
      setTagStartNumber(existingTagFormat.start_number || "0001");
    }
  }, [existingTagFormat]);

  const saveTagFormat = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: userData } = await supabase
        .from("users")
        .select("organisation_id")
        .eq("auth_user_id", user.id)
        .single();

      if (!userData?.organisation_id) throw new Error("Organization not found");

      // Check if tag format already exists
      const { data: existing } = await supabase
        .from("itam_tag_format")
        .select("id")
        .eq("organisation_id", userData.organisation_id)
        .maybeSingle();

      // Calculate padding length from starting number length
      const calculatedPaddingLength = tagStartNumber.length || 4;

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("itam_tag_format")
          .update({
            prefix: tagPrefix,
            start_number: tagStartNumber,
            padding_length: calculatedPaddingLength,
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("itam_tag_format")
          .insert({
            organisation_id: userData.organisation_id,
            prefix: tagPrefix,
            start_number: tagStartNumber,
            padding_length: calculatedPaddingLength,
            auto_increment: true,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Tag format saved successfully");
      queryClient.invalidateQueries({ queryKey: ["itam-tag-format"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to save tag format: " + error.message);
    },
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold">Fields Setup</h1>
            <p className="text-sm text-muted-foreground">Configure asset management fields</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="sites">Sites</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="tag-format">Tag Format</TabsTrigger>
          </TabsList>

          {/* Company Info */}
          <TabsContent value="company" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company Information
                </CardTitle>
                <CardDescription className="text-xs">
                  Update your company profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" placeholder="Enter company name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-code">Company Code</Label>
                    <Input id="company-code" placeholder="e.g., ACME" />
                  </div>
                </div>
                <Button size="sm">Save Company Info</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sites */}
          <TabsContent value="sites" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Sites
                  </CardTitle>
                  <CardDescription className="text-xs">Manage site locations</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-3 w-3 mr-2" />
                  Add Site
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NAME</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sites.map((site) => (
                      <TableRow key={site.id}>
                        <TableCell className="font-medium">{site.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations */}
          <TabsContent value="locations" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Locations
                  </CardTitle>
                  <CardDescription className="text-xs">Manage locations within sites</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-3 w-3 mr-2" />
                  Add Location
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NAME</TableHead>
                      <TableHead>SITE</TableHead>
                      <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell className="font-medium">{location.name}</TableCell>
                        <TableCell>{(location as any).itam_sites?.name || "—"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories */}
          <TabsContent value="categories" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FolderTree className="h-4 w-4" />
                    Categories
                  </CardTitle>
                  <CardDescription className="text-xs">Manage asset categories</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-3 w-3 mr-2" />
                  Add Category
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NAME</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments */}
          <TabsContent value="departments" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Departments
                  </CardTitle>
                  <CardDescription className="text-xs">Manage departments</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-3 w-3 mr-2" />
                  Add Department
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NAME</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tag Format */}
          <TabsContent value="tag-format" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Asset Tag Format
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure how asset tags are generated
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tag-prefix">Prefix</Label>
                    <Input
                      id="tag-prefix"
                      value={tagPrefix}
                      onChange={(e) => setTagPrefix(e.target.value)}
                      placeholder="e.g., RT-, IT-, AS-"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tag-start">Starting Number</Label>
                    <Input
                      id="tag-start"
                      value={tagStartNumber}
                      onChange={(e) => setTagStartNumber(e.target.value)}
                      placeholder="e.g., 0001, 0100, 5000"
                    />
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium mb-2">Preview:</div>
                  <div className="text-lg font-mono">
                    {tagPrefix}{tagStartNumber}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Padding Length: {tagPaddingLength} digits
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => saveTagFormat.mutate()}
                  disabled={saveTagFormat.isPending}
                >
                  {saveTagFormat.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Tag Format
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
