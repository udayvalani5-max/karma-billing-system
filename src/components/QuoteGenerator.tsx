
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, FileText } from "lucide-react";
import QuotePreview from "./QuotePreview";
import QuoteDetailsForm from "./quote/QuoteDetailsForm";
import ClientInformationForm from "./quote/ClientInformationForm";
import QuoteItemsForm from "./quote/QuoteItemsForm";
import { validateAddress, formatAddress, AddressData } from "../utils/addressValidator";
import { Product, QuoteData, QuoteItem } from "./quote/types";

const QuoteGenerator = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addressData, setAddressData] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
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

    // Check if we're editing an existing quote
    const editingQuote = localStorage.getItem("editingQuote");
    if (editingQuote) {
      const quote = JSON.parse(editingQuote);
      setQuoteData(quote);
      setIsEditing(true);
      
      // Parse address from clientAddress string
      const addressParts = quote.clientAddress.split(', ');
      if (addressParts.length >= 4) {
        setAddressData({
          street: addressParts[0] || "",
          city: addressParts[1] || "",
          state: addressParts[2] || "",
          zipCode: addressParts[3] || "",
        });
      }
      
      // Clear the editing flag
      localStorage.removeItem("editingQuote");
    }
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [quoteData.items]);

  useEffect(() => {
    // Update clientAddress when addressData changes
    const formattedAddress = formatAddress(addressData);
    setQuoteData(prev => ({ ...prev, clientAddress: formattedAddress }));
  }, [addressData]);

  const getProductIgstRate = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.igstRate : 18;
  };

  const calculateTotals = () => {
    const subtotal = quoteData.items.reduce((sum, item) => sum + item.total, 0);
    
    const tax = quoteData.items.reduce((sum, item) => {
      const igstRate = getProductIgstRate(item.productId);
      const itemTax = (item.total * igstRate) / 100;
      return sum + itemTax;
    }, 0);
    
    const total = subtotal + tax;
    
    setQuoteData(prev => ({ ...prev, subtotal, tax, total }));
  };

  const handleQuoteUpdate = (field: keyof QuoteData, value: any) => {
    setQuoteData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof AddressData, value: string) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
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
    if (!validateAddress(addressData)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid address with street, city, state, and zip code.",
        variant: "destructive",
      });
      return;
    }

    const quotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    
    if (isEditing) {
      // Update existing quote
      const index = quotes.findIndex((q: QuoteData) => q.quoteNumber === quoteData.quoteNumber);
      if (index !== -1) {
        quotes[index] = quoteData;
      }
      toast({ title: "Quote updated successfully!" });
    } else {
      // Add new quote
      quotes.push({ ...quoteData, id: Date.now().toString() });
      toast({ title: "Quote saved successfully!" });
    }
    
    localStorage.setItem("quotes", JSON.stringify(quotes));
    
    // Reset form for new quote
    if (isEditing) {
      setIsEditing(false);
      setQuoteData({
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
      setAddressData({
        street: "",
        city: "",
        state: "",
        zipCode: "",
      });
    }
  };

  const handlePreview = () => {
    if (!validateAddress(addressData)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid address before previewing.",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  useEffect(() => {
    calculateTotals();
  }, [quoteData.items]);

  useEffect(() => {
    const formattedAddress = formatAddress(addressData);
    setQuoteData(prev => ({ ...prev, clientAddress: formattedAddress }));
  }, [addressData]);

  if (showPreview) {
    return <QuotePreview quoteData={quoteData} onBack={() => setShowPreview(false)} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Quote' : 'Generate Quote'}
          </h2>
          <p className="text-gray-600">
            {isEditing ? 'Update your quotation' : 'Create professional quotations for your clients'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye size={20} className="mr-2" />
            Preview
          </Button>
          <Button onClick={saveQuote}>
            <FileText size={20} className="mr-2" />
            {isEditing ? 'Update Quote' : 'Save Quote'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <QuoteDetailsForm 
            quoteData={quoteData}
            onUpdate={handleQuoteUpdate}
          />
          <ClientInformationForm 
            quoteData={quoteData}
            addressData={addressData}
            onQuoteUpdate={handleQuoteUpdate}
            onAddressUpdate={handleAddressChange}
          />
        </div>

        <QuoteItemsForm 
          quoteData={quoteData}
          products={products}
          onQuoteUpdate={handleQuoteUpdate}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
        />
      </div>
    </div>
  );
};

export default QuoteGenerator;
