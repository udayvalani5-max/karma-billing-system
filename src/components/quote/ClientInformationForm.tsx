
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuoteData } from './types';
import { validateAddress, AddressData } from '../../utils/addressValidator';

interface ClientInformationFormProps {
  quoteData: QuoteData;
  addressData: AddressData;
  onQuoteUpdate: (field: keyof QuoteData, value: any) => void;
  onAddressUpdate: (field: keyof AddressData, value: string) => void;
}

const ClientInformationForm = ({ 
  quoteData, 
  addressData, 
  onQuoteUpdate, 
  onAddressUpdate 
}: ClientInformationFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Client Name</Label>
          <Input
            value={quoteData.clientName}
            onChange={(e) => onQuoteUpdate('clientName', e.target.value)}
            placeholder="Client name"
          />
        </div>

        <div>
          <Label>Client Email</Label>
          <Input
            type="email"
            value={quoteData.clientEmail}
            onChange={(e) => onQuoteUpdate('clientEmail', e.target.value)}
            placeholder="client@example.com"
          />
        </div>

        <div className="space-y-4">
          <Label>Client Address</Label>
          <div className="space-y-2">
            <Input
              value={addressData.street}
              onChange={(e) => onAddressUpdate("street", e.target.value)}
              placeholder="Street Address"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={addressData.city}
                onChange={(e) => onAddressUpdate("city", e.target.value)}
                placeholder="City"
              />
              <Input
                value={addressData.state}
                onChange={(e) => onAddressUpdate("state", e.target.value)}
                placeholder="State"
              />
            </div>
            <Input
              value={addressData.zipCode}
              onChange={(e) => onAddressUpdate("zipCode", e.target.value)}
              placeholder="ZIP Code"
            />
          </div>
          {!validateAddress(addressData) && (addressData.street || addressData.city || addressData.state || addressData.zipCode) && (
            <p className="text-sm text-red-600">Please enter a valid address format</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInformationForm;
