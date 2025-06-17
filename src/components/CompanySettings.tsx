
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
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Company Settings</h2>
        <p className="text-gray-600 text-sm lg:text-base">Configure your company information for quotations</p>
      </div>

      <Card className="max-w-full lg:max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl">Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm lg:text-base">Company Name *</Label>
              <Input
                id="name"
                value={companyData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your Company Name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm lg:text-base">Email *</Label>
              <Input
                id="email"
                type="email"
                value={companyData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="company@example.com"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-sm lg:text-base">Address</Label>
            <Textarea
              id="address"
              value={companyData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Complete business address"
              rows={3}
              className="mt-1 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-sm lg:text-base">Phone</Label>
              <Input
                id="phone"
                value={companyData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="website" className="text-sm lg:text-base">Website</Label>
              <Input
                id="website"
                value={companyData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="www.yourcompany.com"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="taxId" className="text-sm lg:text-base">Tax ID / Registration Number</Label>
            <Input
              id="taxId"
              value={companyData.taxId}
              onChange={(e) => handleChange("taxId", e.target.value)}
              placeholder="Tax identification number"
              className="mt-1"
            />
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSave} 
              className="w-full lg:w-auto px-6 py-2"
            >
              Save Company Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySettings;
