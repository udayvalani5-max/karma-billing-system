
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
              <title>Quotation ${quoteData.quoteNumber}</title>
              <style>
                :root {
                  --primary: #102695;
                  --secondary: #ecf0f1;
                  --accent: #102695;
                  --text: #222222;
                  --light-gray: #f7f9fa;
                  --border: #bdc3c7;
                }
                
                body {
                  font-family: 'Roboto', 'Helvetica Neue', sans-serif;
                  color: var(--text);
                  line-height: 1.6;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
                }
                
                .container {
                  max-width: 800px;
                  margin: 20px auto;
                  padding: 40px;
                  background-color: white;
                  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                  border-radius: 8px;
                }
                
                .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 40px;
                  flex-wrap: wrap;
                }
                
                .logo-section {
                  display: flex;
                  align-items: center;
                  width: 100%;
                }
                
                .logo {
                  width: 120px;
                  margin-right: 20px;
                }
                
                .logo img {
                  width: 100%;
                  height: auto;
                }
                
                .company-details {
                  flex-grow: 1;
                }
                
                .company-name {
                  font-size: 24px;
                  font-weight: 700;
                  color: var(--primary);
                  margin-bottom: 5px;
                }
                
                .company-info {
                  font-size: 13px;
                  color: var(--text);
                  line-height: 1.4;
                }
                
                .quotation-details {
                  min-width: 250px;
                  text-align: right;
                  padding: 15px;
                  background-color: var(--light-gray);
                  border-radius: 6px;
                  margin-left: 20px;
                }
                
                .quotation-title {
                  text-transform: uppercase;
                  font-size: 22px;
                  font-weight: 700;
                  letter-spacing: 2px;
                  color: var(--primary);
                  margin-bottom: 10px;
                }
                
                .quotation-number, .quotation-date, .quotation-validity {
                  font-size: 13px;
                  margin: 5px 0;
                }
                
                .client-section {
                  margin-bottom: 40px;
                }
                
                .client-details {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 30px;
                }
                
                .quote-to, .ship-to {
                  width: 48%;
                }
                
                .section-title {
                  font-weight: 500;
                  color: var(--accent);
                  margin-bottom: 10px;
                  text-transform: uppercase;
                  font-size: 12px;
                  letter-spacing: 1px;
                }
                
                .client-content {
                  font-size: 13px;
                  background-color: var(--light-gray);
                  padding: 15px;
                  border-radius: 6px;
                  line-height: 1.6;
                }
                
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 40px;
                }
                
                thead {
                  background-color: var(--primary);
                  color: white;
                }
                
                th {
                  text-align: left;
                  padding: 12px 15px;
                  font-size: 12px;
                  font-weight: 500;
                  letter-spacing: 0.5px;
                  text-transform: uppercase;
                }
                
                td {
                  padding: 12px 15px;
                  border-bottom: 1px solid var(--border);
                  font-size: 13px;
                }
                
                tr:last-child td {
                  border-bottom: none;
                }
                
                tr:nth-child(even) {
                  background-color: var(--light-gray);
                }
                
                .terms-and-totals {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 30px;
                }
                
                .terms-section {
                  width: 45%;
                }
                
                .totals-section {
                  width: 50%;
                }
                
                .amount-table {
                  width: 100%;
                  border-collapse: collapse;
                }
                
                .amount-table th, .amount-table td {
                  padding: 10px;
                  text-align: left;
                  border: 1px solid var(--border);
                }
                
                .amount-table th {
                  background-color: #f8d27a;
                  color: var(--text);
                  font-weight: 600;
                  width: 60%;
                }
                
                .amount-table td {
                  text-align: right;
                  background-color: #fff;
                }
                
                .amount-table .total-row th, .amount-table .total-row td {
                  font-weight: 700;
                  background-color: #f8d27a;
                }
                
                .terms-title {
                  font-weight: 600;
                  color: var(--text);
                  margin-bottom: 15px;
                  font-size: 14px;
                  text-transform: uppercase;
                }
                
                .terms-list {
                  padding-left: 20px;
                  margin: 0;
                  font-size: 13px;
                }
                
                .terms-list li {
                  margin-bottom: 8px;
                }
                
                .bank-details-horizontal {
                  margin-top: 30px;
                  margin-bottom: 30px;
                }
                
                .bank-title {
                  font-weight: 600;
                  color: var(--text);
                  margin-bottom: 15px;
                  font-size: 14px;
                  text-transform: uppercase;
                }
                
                .bank-table {
                  width: 100%;
                  border-collapse: collapse;
                }
                
                .bank-table th, .bank-table td {
                  padding: 8px;
                  text-align: center;
                  border: 1px solid #ddd;
                  font-size: 13px;
                }
                
                .bank-table th {
                  background-color: #f8d27a;
                  color: var(--text);
                  font-weight: 600;
                }
                
                .footer {
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid var(--border);
                  display: flex;
                  justify-content: flex-end;
                }
                
                .signature {
                  margin-top: 60px;
                  border-top: 1px solid var(--text);
                  padding-top: 10px;
                  width: 200px;
                  text-align: center;
                  font-size: 13px;
                }
                
                @media print {
                  body { margin: 0; }
                  .container { max-width: none; }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo-section">
                    <div class="logo">
                      <img src="/lovable-uploads/28281ec9-ba9b-4a7d-b2a3-8156d8ad8087.png" alt="Krishna Furnishing Logo">
                    </div>
                    <div class="company-details">
                      <div class="company-name">${companyData.name || "KRISHNA FURNISHING"}</div>
                      <div class="company-info">
                        ${companyData.address || "PLOT-141, SURAT, GUJARAT - 395001"}<br>
                        ${companyData.email || "KRISHANAFURNISHING403@GMAIL.COM"}<br>
                        ${companyData.phone || "+91 99045-39869"} | GSTIN: ${companyData.taxId || "24BAHPK7431H1ZS"}
                      </div>
                    </div>
                    <div class="quotation-details">
                      <div class="quotation-title">Quotation</div>
                      <div class="quotation-number"><strong>Ref:</strong> ${quoteData.quoteNumber}</div>
                      <div class="quotation-date"><strong>Date:</strong> ${new Date(quoteData.date).toLocaleDateString()}</div>
                      <div class="quotation-validity"><strong>Valid Until:</strong> ${new Date(quoteData.validUntil).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                
                <div class="client-section">
                  <div class="client-details">
                    <div class="quote-to">
                      <div class="section-title"><strong>Quotation For</strong></div>
                      <div class="client-content">
                        <strong>${quoteData.clientName || "CLIENT NAME"}</strong><br>
                        ${quoteData.clientEmail || ""}<br>
                        ${quoteData.clientAddress || ""}
                      </div>
                    </div>
                    <div class="ship-to">
                      <div class="section-title">Ship To</div>
                      <div class="client-content">
                        <strong>${quoteData.clientName || "CLIENT NAME"}</strong><br>
                        ${quoteData.clientEmail || ""}<br>
                        ${quoteData.clientAddress || ""}
                      </div>
                    </div>
                  </div>
                </div>
                
                <table>
                  <thead>
                    <tr>
                      <th>SR</th>
                      <th style="width: 40%;">PRODUCT DESCRIPTION</th>
                      <th>HSN/SAC</th>
                      <th>QTY</th>
                      <th>RATE</th>
                      <th>IGST Rate(%)</th>
                      <th>IGST Amount</th>
                      <th>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${quoteData.items.map((item, index) => {
                      const product = products.find(p => p.id === item.productId);
                      const igstRate = 18;
                      const igstAmount = (item.price * item.quantity * igstRate) / 100;
                      return `
                        <tr>
                          <td>${index + 1}</td>
                          <td>
                            <strong>${product?.name || "PRODUCT"}</strong><br>
                            ${product?.description || ""}
                          </td>
                          <td>7607</td>
                          <td>${item.quantity} NOS</td>
                          <td>₹${item.price.toFixed(2)}</td>
                          <td>18.00</td>
                          <td>₹${igstAmount.toFixed(2)}</td>
                          <td>₹${item.total.toFixed(2)}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
                
                <div class="terms-and-totals">
                  <div class="terms-section">
                    <div class="terms-title">TERM AND CONDITION:-</div>
                    <ol class="terms-list">
                      <li>PERIOD WITHIN 2 TO 4 WEEKS AFTER RECEIPT OF P.O.</li>
                      <li>PAYMENT WITHIN 7 DAYS AFTER WORK</li>
                      ${quoteData.notes ? `<li>${quoteData.notes}</li>` : ''}
                    </ol>
                  </div>
                  
                  <div class="totals-section">
                    <table class="amount-table">
                      <tr>
                        <th>Taxable Amount</th>
                        <td>₹${quoteData.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <th>Transportation charge</th>
                        <td>₹0.00</td>
                      </tr>
                      <tr>
                        <th>Add- CGST</th>
                        <td>₹${(quoteData.tax / 2).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <th>Add- SGST</th>
                        <td>₹${(quoteData.tax / 2).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <th>Tax Amount: GST</th>
                        <td>₹${quoteData.tax.toFixed(2)}</td>
                      </tr>
                      <tr class="total-row">
                        <th>Total Amount</th>
                        <td>₹${quoteData.total.toFixed(2)}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                
                <div class="bank-details-horizontal">
                  <div class="bank-title">BANK DETAIL</div>
                  <table class="bank-table">
                    <thead>
                      <tr>
                        <th>Account Holder Name</th>
                        <th>Account No.</th>
                        <th>IFSC No.</th>
                        <th>Bank Name</th>
                        <th>Bank Branch Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>KRISHNAFURNISHING</td>
                        <td>01230110420756</td>
                        <td>VARA0289012</td>
                        <td>The Varachha Co.op.Bank</td>
                        <td>Yogi chock</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div class="footer">
                  <div class="signature">
                    FOR, ${companyData.name || "KRISHNA FURNISHING"}
                  </div>
                </div>
              </div>
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
