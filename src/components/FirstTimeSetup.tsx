
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Building } from "lucide-react";

interface CompanyData {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
}

interface FirstTimeSetupProps {
  onComplete: () => void;
}

const FirstTimeSetup = ({ onComplete }: FirstTimeSetupProps) => {
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
    email: "",
    website: "",
    taxId: "",
  });

  const handleSave = () => {
    if (!companyData.name || !companyData.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in at least the company name and email.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("companyData", JSON.stringify(companyData));
    localStorage.setItem("isFirstTimeSetupComplete", "true");
    
    toast({
      title: "Company settings saved!",
      description: "Your company information has been set up successfully.",
    });
    
    onComplete();
  };

  const handleChange = (field: keyof CompanyData, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Karma Billing System!</h1>
          <p className="text-gray-600">Let's set up your company information to get started</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Company Setup
            </CardTitle>
            <p className="text-sm text-gray-600">
              This information will be used in all your quotations
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={companyData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your Company Name"
                  required
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
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Address Details</h3>
              <div>
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  value={companyData.streetAddress}
                  onChange={(e) => handleChange("streetAddress", e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={companyData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={companyData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="pinCode">Pin Code</Label>
                  <Input
                    id="pinCode"
                    value={companyData.pinCode}
                    onChange={(e) => handleChange("pinCode", e.target.value)}
                    placeholder="Pin Code"
                  />
                </div>
              </div>
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

            <div className="pt-4">
              <Button 
                onClick={handleSave} 
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
              >
                Complete Setup & Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FirstTimeSetup;
