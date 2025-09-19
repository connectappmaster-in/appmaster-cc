import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PolicyCard, Policy } from "@/components/PolicyCard";
import { AddPolicyDialog } from "@/components/AddPolicyDialog";
import { StatsOverview } from "@/components/StatsOverview";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sample data - in a real app this would come from a database
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: "1",
      type: "Auto",
      provider: "State Farm",
      policyNumber: "SF-AUTO-001",
      premium: 1200,
      coverage: 100000,
      deductible: 500,
      renewalDate: "2024-12-15",
      status: "expiring"
    },
    {
      id: "2",
      type: "Home",
      provider: "Allstate",
      policyNumber: "AS-HOME-002",
      premium: 2400,
      coverage: 350000,
      deductible: 1000,
      renewalDate: "2025-03-20",
      status: "active"
    },
    {
      id: "3",
      type: "Health",
      provider: "Blue Cross",
      policyNumber: "BC-HEALTH-003",
      premium: 4800,
      coverage: 50000,
      deductible: 2500,
      renewalDate: "2024-01-10",
      status: "expired"
    }
  ]);

  const handleAddPolicy = (newPolicy: Omit<Policy, 'id'>) => {
    const id = (policies.length + 1).toString();
    setPolicies([...policies, { ...newPolicy, id }]);
    toast({
      title: "Policy Added",
      description: `${newPolicy.type} insurance policy has been added successfully.`,
    });
  };

  const handleEditPolicy = (policy: Policy) => {
    toast({
      title: "Edit Policy",
      description: "Policy editing feature coming soon!",
    });
  };

  const handleViewPolicy = (policy: Policy) => {
    toast({
      title: "Policy Details",
      description: `Viewing details for ${policy.type} policy #${policy.policyNumber}`,
    });
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || policy.type.toLowerCase() === filterType.toLowerCase();
    const matchesStatus = filterStatus === "all" || policy.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Insurance Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your insurance policies in one place
            </p>
          </div>
          <AddPolicyDialog onAddPolicy={handleAddPolicy} />
        </div>

        {/* Stats Overview */}
        <StatsOverview policies={policies} />

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search policies, providers, or policy numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="life">Life</SelectItem>
                <SelectItem value="renters">Renters</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Policies Grid */}
        {filteredPolicies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No policies found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterType !== "all" || filterStatus !== "all" 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first insurance policy"}
            </p>
            {(!searchTerm && filterType === "all" && filterStatus === "all") && (
              <AddPolicyDialog onAddPolicy={handleAddPolicy} />
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPolicies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                onEdit={handleEditPolicy}
                onView={handleViewPolicy}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;