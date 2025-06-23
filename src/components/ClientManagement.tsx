
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { ClientData } from "./quote/types";

const ClientManagement = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    pinCode: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("clients");
    if (saved) {
      setClients(JSON.parse(saved));
    }
  }, []);

  const saveClients = (newClients: ClientData[]) => {
    setClients(newClients);
    localStorage.setItem("clients", JSON.stringify(newClients));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const client: ClientData = {
      id: isEditing || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pinCode,
      createdAt: new Date().toISOString(),
    };

    if (isEditing) {
      const updated = clients.map(c => c.id === isEditing ? client : c);
      saveClients(updated);
      toast({ title: "Client updated successfully!" });
    } else {
      saveClients([...clients, client]);
      toast({ title: "Client added successfully!" });
    }

    setFormData({ name: "", email: "", streetAddress: "", city: "", state: "", pinCode: "" });
    setIsEditing(null);
  };

  const handleEdit = (client: ClientData) => {
    setFormData({
      name: client.name,
      email: client.email,
      streetAddress: client.streetAddress,
      city: client.city,
      state: client.state,
      pinCode: client.pinCode,
    });
    setIsEditing(client.id);
  };

  const handleDelete = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    saveClients(updated);
    toast({ title: "Client deleted successfully!" });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Client Management</h2>
        <p className="text-gray-600">Manage your client database for quick access</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add/Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={20} />
              {isEditing ? "Edit Client" : "Add New Client"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="client@example.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Address Details</h4>
                <div>
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    id="streetAddress"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, streetAddress: e.target.value }))}
                    placeholder="Street address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pinCode">Pin Code</Label>
                    <Input
                      id="pinCode"
                      value={formData.pinCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, pinCode: e.target.value }))}
                      placeholder="Pin Code"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {isEditing ? "Update Client" : "Add Client"}
                </Button>
                {isEditing && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(null);
                      setFormData({ name: "", email: "", streetAddress: "", city: "", state: "", pinCode: "" });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Client Database ({clients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {clients.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No clients added yet</p>
              ) : (
                clients.map((client) => (
                  <div key={client.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{client.name}</h4>
                        {client.email && (
                          <p className="text-sm text-blue-600 mt-1">{client.email}</p>
                        )}
                        <div className="mt-2 text-sm text-gray-600">
                          {client.streetAddress && <p>{client.streetAddress}</p>}
                          {(client.city || client.state || client.pinCode) && (
                            <p>{[client.city, client.state, client.pinCode].filter(Boolean).join(', ')}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(client)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(client.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientManagement;
