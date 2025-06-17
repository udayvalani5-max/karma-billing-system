
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useState, useEffect } from "react";

interface CompanyData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
}

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

interface QuotePreviewProps {
  quoteData: QuoteData;
  onBack: () => void;
}

const QuotePreview = ({ quoteData, onBack }: QuotePreviewProps) => {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    taxId: "",
  });
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedCompany = localStorage.getItem("companyData");
    if (savedCompany) {
      setCompanyData(JSON.parse(savedCompany));
    }

    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  const generatePDF = async () => {
    // Simple PDF generation using browser print
    const printContent = document.getElementById('quote-preview');
    if (printContent) {
      const newWindow = window.open('', '', 'width=800,height=600');
      newWindow?.document.write(`
        <html>
          <head>
            <title>Quote ${quoteData.quoteNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .company-info { float: left; }
              .quote-info { float: right; text-align: right; }
              .client-info { margin: 20px 0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .totals { float: right; margin-top: 20px; }
              .clear { clear: both; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      newWindow?.document.close();
      newWindow?.print();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft size={20} className="mr-2" />
          Back to Editor
        </Button>
        <Button onClick={generatePDF}>
          <Download size={20} className="mr-2" />
          Download PDF
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8" id="quote-preview">
          {/* Header */}
          <div className="header mb-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="company-info">
                <h1 className="text-2xl font-bold text-blue-600">{companyData.name || "Your Company"}</h1>
                {companyData.address && <p className="text-sm text-gray-600">{companyData.address}</p>}
                {companyData.phone && <p className="text-sm text-gray-600">Phone: {companyData.phone}</p>}
                {companyData.email && <p className="text-sm text-gray-600">Email: {companyData.email}</p>}
                {companyData.website && <p className="text-sm text-gray-600">Website: {companyData.website}</p>}
              </div>
              
              <div className="quote-info text-right">
                <h2 className="text-3xl font-bold text-gray-900">QUOTATION</h2>
                <p className="text-lg font-semibold">#{quoteData.quoteNumber}</p>
                <p className="text-sm text-gray-600">Date: {new Date(quoteData.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Valid Until: {new Date(quoteData.validUntil).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="client-info mb-8">
            <h3 className="text-lg font-semibold mb-2">Quote To:</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold">{quoteData.clientName}</p>
              {quoteData.clientEmail && <p className="text-sm text-gray-600">{quoteData.clientEmail}</p>}
              {quoteData.clientAddress && <p className="text-sm text-gray-600 whitespace-pre-line">{quoteData.clientAddress}</p>}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left">Item</th>
                  <th className="border border-gray-300 p-3 text-center">Quantity</th>
                  <th className="border border-gray-300 p-3 text-right">Unit Price</th>
                  <th className="border border-gray-300 p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {quoteData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-3">{getProductName(item.productId)}</td>
                    <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 p-3 text-right">${item.price.toFixed(2)}</td>
                    <td className="border border-gray-300 p-3 text-right">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="totals mb-8">
            <div className="w-64 ml-auto">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>${quoteData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
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
          {quoteData.notes && (
            <div className="notes">
              <h3 className="text-lg font-semibold mb-2">Notes:</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{quoteData.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="clear mt-8 pt-8 border-t border-gray-300 text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
            {companyData.taxId && <p>Tax ID: {companyData.taxId}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotePreview;
