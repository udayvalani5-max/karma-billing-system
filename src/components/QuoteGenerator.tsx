
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Eye, FileText } from "lucide-react";
import QuotePreview from "./QuotePreview";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
}

interface QuoteItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

interface QuoteData {
  quoteNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  date: string;
  validUntil: string;
  items: QuoteItem[];
  notes: string;
  subtotal: number;
  tax: number;
  total: number;
}

const QuoteGenerator = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    quoteNumber: `Q-${Date.now()}`,
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    notes: "",
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [quoteData.items]);

  const calculateTotals = () => {
    const subtotal = quoteData.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    setQuoteData(prev => ({ ...prev, subtotal, tax, total }));
  };

  const addItem = () => {
    const newItem: QuoteItem = {
      productId: "",
      quantity: 1,
      price: 0,
      total: 0,
    };
    setQuoteData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...quoteData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].price = product.price;
      }
    }
    
    if (field === 'quantity' || field === 'price') {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }
    
    setQuoteData(prev => ({ ...prev, items: newItems }));
  };

  const removeItem = (index: number) => {
    const newItems = quoteData.items.filter((_, i) => i !== index);
    setQuoteData(prev => ({ ...prev, items: newItems }));
  };

  const saveQuote = () => {
    const quotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    quotes.push({ ...quoteData, id: Date.now().toString() });
    localStorage.setItem("quotes", JSON.stringify(quotes));
    toast({ title: "Quote saved successfully!" });
  };

  if (showPreview) {
    return <QuotePreview quoteData={quoteData} onBack={() => setShowPreview(false)} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Generate Quote</h2>
          <p className="text-gray-600">Create professional quotations for your clients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye size={20} className="mr-2" />
            Preview
          </Button>
          <Button onClick={saveQuote}>
            <FileText size={20} className="mr-2" />
            Save Quote
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quote Details */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quote Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Quote Number</Label>
              <Input
                value={quoteData.quoteNumber}
                onChange={(e) => setQuoteData(prev => ({ ...prev, quoteNumber: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={quoteData.date}
                onChange={(e) => setQuoteData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Valid Until</Label>
              <Input
                type="date"
                value={quoteData.validUntil}
                onChange={(e) => setQuoteData(prev => ({ ...prev, validUntil: e.target.value }))}
              />
            </div>

            <div>
              <Label>Client Name</Label>
              <Input
                value={quoteData.clientName}
                onChange={(e) => setQuoteData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Client name"
              />
            </div>

            <div>
              <Label>Client Email</Label>
              <Input
                type="email"
                value={quoteData.clientEmail}
                onChange={(e) => setQuoteData(prev => ({ ...prev, clientEmail: e.target.value }))}
                placeholder="client@example.com"
              />
            </div>

            <div>
              <Label>Client Address</Label>
              <Textarea
                value={quoteData.clientAddress}
                onChange={(e) => setQuoteData(prev => ({ ...prev, clientAddress: e.target.value }))}
                placeholder="Client address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quote Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Quote Items
              <Button onClick={addItem} size="sm">
                <Plus size={16} className="mr-2" />
                Add Item
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quoteData.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-4">
                      <Label>Product</Label>
                      <Select
                        value={item.productId}
                        onValueChange={(value) => updateItem(index, 'productId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ${product.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="col-span-3">
                      <Label>Total</Label>
                      <Input
                        value={`$${item.total.toFixed(2)}`}
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {quoteData.items.length === 0 && (
                <p className="text-gray-500 text-center py-8">No items added yet</p>
              )}
            </div>

            {/* Totals */}
            <div className="mt-6 border-t pt-4">
              <div className="space-y-2 max-w-sm ml-auto">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${quoteData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>${quoteData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${quoteData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <Label>Notes</Label>
              <Textarea
                value={quoteData.notes}
                onChange={(e) => setQuoteData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes or terms"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuoteGenerator;
