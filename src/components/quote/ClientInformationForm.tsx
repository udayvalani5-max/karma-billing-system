
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { QuoteData, ClientData } from './types';
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
  const [clients, setClients] = useState<ClientData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredClients, setFilteredClients] = useState<ClientData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("clients");
    if (saved) {
      setClients(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (quoteData.clientName.length > 0) {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(quoteData.clientName.toLowerCase()) ||
        client.email.toLowerCase().includes(quoteData.clientName.toLowerCase())
      );
      setFilteredClients(filtered);
      setShowSuggestions(filtered.length > 0 && quoteData.clientName.length > 1);
    } else {
      setShowSuggestions(false);
    }
  }, [quoteData.clientName, clients]);

  const selectClient = (client: ClientData) => {
    onQuoteUpdate('clientName', client.name);
    onQuoteUpdate('clientEmail', client.email);
    onAddressUpdate('street', client.streetAddress);
    onAddressUpdate('city', client.city);
    onAddressUpdate('state', client.state);
    onAddressUpdate('zipCode', client.pinCode);
    setShowSuggestions(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Label>Client Name</Label>
          <Input
            value={quoteData.clientName}
            onChange={(e) => onQuoteUpdate('clientName', e.target.value)}
            placeholder="Start typing client name..."
            onFocus={() => setShowSuggestions(filteredClients.length > 0)}
          />
          
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => selectClient(client)}
                >
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    {client.email && (
                      <p className="text-sm text-gray-600">{client.email}</p>
                    )}
                    {client.city && (
                      <p className="text-xs text-gray-500">{client.city}, {client.state}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
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
