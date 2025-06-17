
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface CompanyData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
}

const CompanySettings = () => {
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    taxId: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("companyData");
    if (saved) {
      setCompanyData(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("companyData", JSON.stringify(companyData));
    toast({
      title: "Company settings saved!",
      description: "Your company information has been updated successfully.",
    });
  };

  const handleChange = (field: keyof CompanyData, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Company Settings</h2>
        <p className="text-gray-600">Configure your company information for quotations</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={companyData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={companyData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="company@example.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={companyData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Complete business address"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={companyData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={companyData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="www.yourcompany.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="taxId">Tax ID / Registration Number</Label>
            <Input
              id="taxId"
              value={companyData.taxId}
              onChange={(e) => handleChange("taxId", e.target.value)}
              placeholder="Tax identification number"
            />
          </div>

          <Button onClick={handleSave} className="w-full md:w-auto">
            Save Company Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySettings;
