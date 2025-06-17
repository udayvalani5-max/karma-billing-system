
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
    const printContent = document.getElementById('quote-preview');
    if (printContent) {
      const newWindow = window.open('', '', 'width=800,height=600');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Quote ${quoteData.quoteNumber}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 0; 
                  padding: 20px; 
                  color: #333;
                  line-height: 1.4;
                }
                .quote-container {
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                }
                .header {
                  display: flex;
                  justify-content: space-between;
                  border-bottom: 3px solid #2563eb;
                  padding-bottom: 20px;
                  margin-bottom: 30px;
                }
                .company-info h1 {
                  color: #2563eb;
                  font-size: 28px;
                  font-weight: bold;
                  margin: 0 0 8px 0;
                }
                .company-info p {
                  margin: 2px 0;
                  font-size: 14px;
                  color: #666;
                }
                .quote-info {
                  text-align: right;
                }
                .quote-info h2 {
                  font-size: 36px;
                  font-weight: bold;
                  color: #1f2937;
                  margin: 0 0 8px 0;
                }
                .quote-info p {
                  margin: 2px 0;
                  font-size: 14px;
                  color: #666;
                }
                .quote-number {
                  font-size: 18px;
                  font-weight: 600;
                  color: #1f2937;
                }
                .client-section {
                  margin: 30px 0;
                }
                .client-section h3 {
                  font-size: 18px;
                  font-weight: 600;
                  margin-bottom: 12px;
                  color: #1f2937;
                }
                .client-box {
                  background: #f9fafb;
                  padding: 20px;
                  border-radius: 8px;
                  border: 1px solid #e5e7eb;
                }
                .client-name {
                  font-weight: 600;
                  font-size: 16px;
                  margin-bottom: 4px;
                }
                .client-details {
                  font-size: 14px;
                  color: #666;
                  white-space: pre-line;
                  line-height: 1.4;
                }
                .items-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 30px 0;
                  border: 1px solid #d1d5db;
                }
                .items-table th {
                  background: #f9fafb;
                  padding: 12px;
                  text-align: left;
                  font-weight: 600;
                  border: 1px solid #d1d5db;
                  color: #374151;
                }
                .items-table td {
                  padding: 12px;
                  border: 1px solid #d1d5db;
                  color: #1f2937;
                }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .totals-section {
                  margin: 30px 0;
                  display: flex;
                  justify-content: flex-end;
                }
                .totals-box {
                  width: 300px;
                  border: 1px solid #d1d5db;
                  border-radius: 8px;
                  overflow: hidden;
                }
                .totals-row {
                  display: flex;
                  justify-content: space-between;
                  padding: 12px 16px;
                  border-bottom: 1px solid #e5e7eb;
                }
                .totals-row:last-child {
                  border-bottom: none;
                  background: #f9fafb;
                  font-weight: 600;
                  font-size: 18px;
                }
                .notes-section {
                  margin: 30px 0;
                }
                .notes-section h3 {
                  font-size: 18px;
                  font-weight: 600;
                  margin-bottom: 12px;
                  color: #1f2937;
                }
                .notes-content {
                  font-size: 14px;
                  color: #666;
                  white-space: pre-line;
                  line-height: 1.5;
                }
                .footer {
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid #d1d5db;
                  text-align: center;
                  font-size: 14px;
                  color: #666;
                }
                @media print {
                  body { margin: 0; }
                  .quote-container { max-width: none; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        newWindow.document.close();
        newWindow.print();
      }
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
        <CardContent className="p-0" id="quote-preview">
          <div className="quote-container p-8">
            {/* Header */}
            <div className="header">
              <div className="company-info">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">{companyData.name || "Your Company"}</h1>
                {companyData.address && <p className="text-sm text-gray-600 mb-1">{companyData.address}</p>}
                {companyData.phone && <p className="text-sm text-gray-600 mb-1">Phone: {companyData.phone}</p>}
                {companyData.email && <p className="text-sm text-gray-600 mb-1">Email: {companyData.email}</p>}
                {companyData.website && <p className="text-sm text-gray-600">Website: {companyData.website}</p>}
              </div>
              
              <div className="quote-info text-right">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">QUOTATION</h2>
                <p className="quote-number text-lg font-semibold mb-2">#{quoteData.quoteNumber}</p>
                <p className="text-sm text-gray-600 mb-1">Date: {new Date(quoteData.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Valid Until: {new Date(quoteData.validUntil).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Client Information */}
            <div className="client-section">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Quote To:</h3>
              <div className="client-box bg-gray-50 p-5 rounded-lg border">
                <p className="client-name font-semibold text-gray-900 mb-2">{quoteData.clientName}</p>
                {quoteData.clientEmail && <p className="client-details text-sm text-gray-600 mb-1">{quoteData.clientEmail}</p>}
                {quoteData.clientAddress && <p className="client-details text-sm text-gray-600 whitespace-pre-line">{quoteData.clientAddress}</p>}
              </div>
            </div>

            {/* Items Table */}
            <div className="items-section">
              <table className="items-table w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Item</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700">Quantity</th>
                    <th className="border border-gray-300 p-3 text-right font-semibold text-gray-700">Unit Price</th>
                    <th className="border border-gray-300 p-3 text-right font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quoteData.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 text-gray-900">{getProductName(item.productId)}</td>
                      <td className="border border-gray-300 p-3 text-center text-gray-900">{item.quantity}</td>
                      <td className="border border-gray-300 p-3 text-right text-gray-900">${item.price.toFixed(2)}</td>
                      <td className="border border-gray-300 p-3 text-right font-semibold text-gray-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="totals-section flex justify-end">
              <div className="totals-box w-80 border border-gray-300 rounded-lg overflow-hidden">
                <div className="totals-row flex justify-between p-4 border-b border-gray-200">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="text-gray-900 font-medium">${quoteData.subtotal.toFixed(2)}</span>
                </div>
                <div className="totals-row flex justify-between p-4 border-b border-gray-200">
                  <span className="text-gray-700">Tax (10%):</span>
                  <span className="text-gray-900 font-medium">${quoteData.tax.toFixed(2)}</span>
                </div>
                <div className="totals-row flex justify-between p-4 bg-gray-50 font-bold text-lg">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">${quoteData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {quoteData.notes && (
              <div className="notes-section">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Notes:</h3>
                <div className="notes-content text-sm text-gray-600 whitespace-pre-line leading-relaxed">{quoteData.notes}</div>
              </div>
            )}

            {/* Footer */}
            <div className="footer mt-10 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
              <p className="mb-2 font-medium">Thank you for your business!</p>
              {companyData.taxId && <p>Tax ID: {companyData.taxId}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotePreview;
