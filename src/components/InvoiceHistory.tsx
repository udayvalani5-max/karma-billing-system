
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileText, Eye, Trash2, Calendar, DollarSign } from "lucide-react";
import { InvoiceData } from "./quote/types";

const InvoiceHistory = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  useEffect(() => {
    // Load quotes and convert them to invoices for backward compatibility
    const savedQuotes = localStorage.getItem("quotes");
    const savedInvoices = localStorage.getItem("invoices");
    
    let allInvoices: InvoiceData[] = [];
    
    if (savedInvoices) {
      allInvoices = JSON.parse(savedInvoices);
    }
    
    // Convert old quotes to invoices if they haven't been converted yet
    if (savedQuotes && !savedInvoices) {
      const quotes = JSON.parse(savedQuotes);
      const convertedInvoices = quotes.map((quote: any) => ({
        ...quote,
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      allInvoices = convertedInvoices;
      localStorage.setItem("invoices", JSON.stringify(allInvoices));
    }
    
    setInvoices(allInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const handleDelete = (id: string) => {
    const updated = invoices.filter(inv => inv.id !== id);
    setInvoices(updated);
    localStorage.setItem("invoices", JSON.stringify(updated));
    toast({ title: "Invoice deleted successfully!" });
  };

  const updateInvoiceStatus = (id: string, status: InvoiceData['status']) => {
    const updated = invoices.map(inv => 
      inv.id === id 
        ? { ...inv, status, updatedAt: new Date().toISOString() }
        : inv
    );
    setInvoices(updated);
    localStorage.setItem("invoices", JSON.stringify(updated));
    toast({ title: `Invoice status updated to ${status}!` });
  };

  const getStatusColor = (status: InvoiceData['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'sent': return 'bg-blue-500';
      case 'paid': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTotalAmount = () => {
    return invoices.reduce((sum, inv) => sum + inv.total, 0);
  };

  const getPaidAmount = () => {
    return invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Invoice History</h2>
        <p className="text-gray-600">Track all your generated invoices and their status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{getTotalAmount().toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{getPaidAmount().toFixed(2)}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No invoices created yet</p>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">#{invoice.quoteNumber}</h4>
                        <Badge className={`${getStatusColor(invoice.status)} text-white`}>
                          {invoice.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Client:</strong> {invoice.clientName}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        Total: ₹{invoice.total.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(invoice.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      
                      <div className="flex gap-1">
                        {invoice.status !== 'sent' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateInvoiceStatus(invoice.id, 'sent')}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            Mark Sent
                          </Button>
                        )}
                        {invoice.status !== 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                            className="text-xs px-2 py-1 h-auto bg-green-50 hover:bg-green-100"
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceHistory;
