
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileText, Eye, Trash2, Calendar, DollarSign, Edit } from "lucide-react";
import { QuoteData } from "./quote/types";
import QuotePreview from "./QuotePreview";

const QuoteHistory = () => {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);

  useEffect(() => {
    const savedQuotes = localStorage.getItem("quotes");
    if (savedQuotes) {
      const quotesData = JSON.parse(savedQuotes);
      setQuotes(quotesData.sort((a: QuoteData, b: QuoteData) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    }
  }, []);

  const handleDelete = (quoteNumber: string) => {
    const updated = quotes.filter(quote => quote.quoteNumber !== quoteNumber);
    setQuotes(updated);
    localStorage.setItem("quotes", JSON.stringify(updated));
    toast({ title: "Quote deleted successfully!" });
  };

  const handlePreview = (quote: QuoteData) => {
    setSelectedQuote(quote);
    setShowPreview(true);
  };

  const handleEdit = (quote: QuoteData) => {
    // Store the quote to edit in localStorage for the QuoteGenerator to pick up
    localStorage.setItem("editingQuote", JSON.stringify(quote));
    // Navigate to quote generator (you'll need to implement navigation)
    window.location.href = "/";
  };

  const getTotalAmount = () => {
    return quotes.reduce((sum, quote) => sum + quote.total, 0);
  };

  if (showPreview && selectedQuote) {
    return <QuotePreview quoteData={selectedQuote} onBack={() => setShowPreview(false)} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Quote History</h2>
        <p className="text-gray-600">View and manage all your created quotations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
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
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-green-600">
                  {quotes.filter(q => 
                    new Date(q.date).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotes List */}
      <Card>
        <CardHeader>
          <CardTitle>All Quotations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No quotations created yet</p>
            ) : (
              quotes.map((quote) => (
                <div key={quote.quoteNumber} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">#{quote.quoteNumber}</h4>
                        <Badge className="bg-blue-500 text-white">
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Client:</strong> {quote.clientName}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Date:</strong> {new Date(quote.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Valid Until:</strong> {new Date(quote.validUntil).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        Total: ₹{quote.total.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(quote)}
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(quote)}
                      >
                        <Eye size={16} className="mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(quote.quoteNumber)}
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
  );
};

export default QuoteHistory;
