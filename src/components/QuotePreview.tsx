
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useState, useEffect } from "react";
import QuoteHeader from "./quote/QuoteHeader";
import ClientSection from "./quote/ClientSection";
import ItemsTable from "./quote/ItemsTable";
import TotalsSection from "./quote/TotalsSection";
import NotesSection from "./quote/NotesSection";
import QuoteFooter from "./quote/QuoteFooter";
import { CompanyData, Product, QuoteData } from "./quote/types";

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
            <QuoteHeader companyData={companyData} quoteData={quoteData} />
            <ClientSection quoteData={quoteData} />
            <ItemsTable quoteData={quoteData} products={products} />
            <TotalsSection quoteData={quoteData} />
            <NotesSection quoteData={quoteData} />
            <QuoteFooter companyData={companyData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotePreview;
