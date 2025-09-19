import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Policy } from "./PolicyCard";

interface AddPolicyDialogProps {
  onAddPolicy: (policy: Omit<Policy, 'id'>) => void;
}

export const AddPolicyDialog = ({ onAddPolicy }: AddPolicyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    provider: '',
    policyNumber: '',
    premium: '',
    coverage: '',
    deductible: '',
    renewalDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const renewalDate = new Date(formData.renewalDate);
    const today = new Date();
    const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: 'active' | 'expired' | 'expiring' = 'active';
    if (daysUntilRenewal < 0) {
      status = 'expired';
    } else if (daysUntilRenewal <= 30) {
      status = 'expiring';
    }

    onAddPolicy({
      type: formData.type,
      provider: formData.provider,
      policyNumber: formData.policyNumber,
      premium: parseFloat(formData.premium),
      coverage: parseFloat(formData.coverage),
      deductible: parseFloat(formData.deductible),
      renewalDate: formData.renewalDate,
      status,
    });

    setFormData({
      type: '',
      provider: '',
      policyNumber: '',
      premium: '',
      coverage: '',
      deductible: '',
      renewalDate: '',
    });
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Add New Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Insurance Policy</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Policy Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Auto">Auto</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Life">Life</SelectItem>
                  <SelectItem value="Renters">Renters</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provider">Insurance Provider</Label>
              <Input
                id="provider"
                value={formData.provider}
                onChange={(e) => handleInputChange('provider', e.target.value)}
                placeholder="e.g., State Farm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="policyNumber">Policy Number</Label>
            <Input
              id="policyNumber"
              value={formData.policyNumber}
              onChange={(e) => handleInputChange('policyNumber', e.target.value)}
              placeholder="Enter policy number"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="premium">Annual Premium ($)</Label>
              <Input
                id="premium"
                type="number"
                value={formData.premium}
                onChange={(e) => handleInputChange('premium', e.target.value)}
                placeholder="1200"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverage">Coverage ($)</Label>
              <Input
                id="coverage"
                type="number"
                value={formData.coverage}
                onChange={(e) => handleInputChange('coverage', e.target.value)}
                placeholder="100000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deductible">Deductible ($)</Label>
              <Input
                id="deductible"
                type="number"
                value={formData.deductible}
                onChange={(e) => handleInputChange('deductible', e.target.value)}
                placeholder="500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="renewalDate">Renewal Date</Label>
            <Input
              id="renewalDate"
              type="date"
              value={formData.renewalDate}
              onChange={(e) => handleInputChange('renewalDate', e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Policy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};