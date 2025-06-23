
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { CompanyData, Product, QuoteData } from "./quote/types";

interface QuotePreviewProps {
  quoteData: QuoteData;
  onBack: () => void;
}

const QuotePreview = ({ quoteData, onBack }: QuotePreviewProps) => {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    pinCode: "",
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

  // Helper function to construct full address
  const getFullAddress = (company: CompanyData) => {
    const addressParts = [
      company.streetAddress,
      company.city,
      company.state,
      company.pinCode
    ].filter(Boolean);
    return addressParts.length > 0 ? addressParts.join(', ') : "PLOT-141, SURAT, GUJARAT - 395001";
  };

  // Calculate amounts based on user specifications
  const calculateAmounts = () => {
    // Taxable Amount = sum of (rate * qty) for each product
    const taxableAmount = quoteData.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Transportation charge (fixed at 0 as per template)
    const transportationCharge = 0;

    // Calculate IGST for each product (18% of product total) and sum them
    const totalIgstAmount = quoteData.items.reduce((sum, item) => {
      const productTotal = item.price * item.quantity;
      const igstAmount = (productTotal * 18) / 100;
      return sum + igstAmount;
    }, 0);

    // Tax Amount GST = total IGST amount
    const taxAmountGst = totalIgstAmount;

    // CGST and SGST are each half of Tax Amount GST
    const cgst = taxAmountGst / 2;
    const sgst = taxAmountGst / 2;

    // Total Amount = Taxable Amount + Transportation charge + Tax Amount GST
    const totalAmount = taxableAmount + transportationCharge + taxAmountGst;

    return {
      taxableAmount,
      transportationCharge,
      totalIgstAmount,
      taxAmountGst,
      cgst,
      sgst,
      totalAmount
    };
  };

  const amounts = calculateAmounts();

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
                body {
                  font-family: 'Roboto', 'Helvetica Neue', sans-serif;
                  color: #222222;
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
                  align-items: flex-start;
                  width: 100%;
                  gap: 20px;
                }
                
                .logo {
                  width: 80px;
                  height: 80px;
                  flex-shrink: 0;
                }
                
                .logo img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }
                
                .company-details {
                  flex-grow: 1;
                  min-height: 80px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                }
                
                .company-name {
                  font-size: 24px;
                  font-weight: 700;
                  color: #102695;
                  margin-bottom: 5px;
                }
                
                .company-info {
                  font-size: 13px;
                  color: #222222;
                  line-height: 1.4;
                }
                
                .quotation-details {
                  min-width: 250px;
                  text-align: right;
                  padding: 15px;
                  background-color: #f7f9fa;
                  border-radius: 6px;
                }
                
                .quotation-title {
                  text-transform: uppercase;
                  font-size: 22px;
                  font-weight: 700;
                  letter-spacing: 2px;
                  color: #102695;
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
                  color: #102695;
                  margin-bottom: 10px;
                  text-transform: uppercase;
                  font-size: 12px;
                  letter-spacing: 1px;
                }
                
                .client-content {
                  font-size: 13px;
                  background-color: #f7f9fa;
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
                  background-color: #102695;
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
                  border-bottom: 1px solid #bdc3c7;
                  font-size: 13px;
                }
                
                tr:last-child td {
                  border-bottom: none;
                }
                
                tr:nth-child(even) {
                  background-color: #f7f9fa;
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
                  border: 1px solid #bdc3c7;
                }
                
                .amount-table th {
                  background-color: #f8d27a;
                  color: #222222;
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
                  color: #222222;
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
                  color: #222222;
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
                  color: #222222;
                  font-weight: 600;
                }
                
                .footer {
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid #bdc3c7;
                  display: flex;
                  justify-content: flex-end;
                }
                
                .signature {
                  margin-top: 60px;
                  border-top: 1px solid #222222;
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
          <div className="container max-w-4xl mx-auto p-10 bg-white shadow-lg rounded-lg font-sans text-gray-800 leading-relaxed">
            {/* Header */}
            <div className="flex justify-between items-center mb-10 flex-wrap">
              <div className="flex items-start w-full gap-5">
                <div className="w-20 h-20 flex-shrink-0">
                  <img 
                    src="/lovable-uploads/28281ec9-ba9b-4a7d-b2a3-8156d8ad8087.png" 
                    alt="Krishna Furnishing Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-grow min-h-20 flex flex-col justify-center">
                  <div className="text-2xl font-bold text-blue-700 mb-1">
                    {companyData.name || "KRISHNA FURNISHING"}
                  </div>
                  <div className="text-sm text-gray-800 leading-tight">
                    {getFullAddress(companyData)}<br />
                    {companyData.email || "KRISHANAFURNISHING403@GMAIL.COM"}<br />
                    {companyData.phone || "+91 99045-39869"} | GSTIN: {companyData.taxId || "24BAHPK7431H1ZS"}
                  </div>
                </div>
                <div className="min-w-64 text-right p-4 bg-gray-50 rounded">
                  <div className="uppercase text-xl font-bold tracking-wider text-blue-700 mb-2">
                    Quotation
                  </div>
                  <div className="text-sm space-y-1">
                    <div><strong>Ref:</strong> {quoteData.quoteNumber}</div>
                    <div><strong>Date:</strong> {new Date(quoteData.date).toLocaleDateString()}</div>
                    <div><strong>Valid Until:</strong> {new Date(quoteData.validUntil).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Client Section */}
            <div className="mb-10">
              <div className="flex justify-between mb-8">
                <div className="w-1/2 pr-4">
                  <div className="font-medium text-blue-700 mb-2 uppercase text-sm tracking-wide">
                    <strong>Quotation For</strong>
                  </div>
                  <div className="text-sm bg-gray-50 p-4 rounded leading-relaxed">
                    <strong>{quoteData.clientName || "CLIENT NAME"}</strong><br />
                    {quoteData.clientEmail || ""}<br />
                    {quoteData.clientAddress || ""}
                  </div>
                </div>
                <div className="w-1/2 pl-4">
                  <div className="font-medium text-blue-700 mb-2 uppercase text-sm tracking-wide">
                    Ship To
                  </div>
                  <div className="text-sm bg-gray-50 p-4 rounded leading-relaxed">
                    <strong>{quoteData.clientName || "CLIENT NAME"}</strong><br />
                    {quoteData.clientEmail || ""}<br />
                    {quoteData.clientAddress || ""}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Products Table */}
            <table className="w-full border-collapse mb-10">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="text-left p-3 text-xs font-medium tracking-wider uppercase">SR</th>
                  <th className="text-left p-3 text-xs font-medium tracking-wider uppercase w-2/5">PRODUCT DESCRIPTION</th>
                  <th className="text-left p-3 text-xs font-medium tracking-wider uppercase">HSN/SAC</th>
                  <th className="text-left p-3 text-xs font-medium tracking-wider uppercase">QTY</th>
                  <th className="text-left p-3 text-xs font-medium tracking-wider uppercase">RATE</th>
                  <th className="text-left p-3 text-xs font-medium tracking-wider uppercase">IGST Rate(%)</th>
                  <th className="text-left p-3 text-xs font-medium tracking-wider uppercase">IGST Amount</th>
                  <th className="text-left p-3 text-xs font-medium tracking-wider uppercase">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {quoteData.items.map((item, index) => {
                  const product = products.find(p => p.id === item.productId);
                  const igstRate = 18;
                  const productTotal = item.price * item.quantity;
                  const igstAmount = (productTotal * igstRate) / 100;
                  const totalWithIgst = productTotal + igstAmount;
                  return (
                    <tr key={index} className={index % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 border-b border-gray-300 text-sm">{index + 1}</td>
                      <td className="p-3 border-b border-gray-300 text-sm">
                        <strong>{product?.name || "PRODUCT"}</strong><br />
                        {product?.description || ""}
                      </td>
                      <td className="p-3 border-b border-gray-300 text-sm">7607</td>
                      <td className="p-3 border-b border-gray-300 text-sm">{item.quantity} NOS</td>
                      <td className="p-3 border-b border-gray-300 text-sm">₹{item.price.toFixed(2)}</td>
                      <td className="p-3 border-b border-gray-300 text-sm">18.00</td>
                      <td className="p-3 border-b border-gray-300 text-sm">₹{igstAmount.toFixed(2)}</td>
                      <td className="p-3 border-b border-gray-300 text-sm">₹{totalWithIgst.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Terms and Totals */}
            <div className="flex justify-between mb-8">
              <div className="w-2/5">
                <div className="font-semibold text-gray-800 mb-4 text-sm uppercase">
                  TERM AND CONDITION:-
                </div>
                <ol className="pl-5 m-0 text-sm space-y-2">
                  <li>PERIOD WITHIN 2 TO 4 WEEKS AFTER RECEIPT OF P.O.</li>
                  <li>PAYMENT WITHIN 7 DAYS AFTER WORK</li>
                  {quoteData.notes && <li>{quoteData.notes}</li>}
                </ol>
              </div>
              
              <div className="w-1/2">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <th className="p-2 text-left border border-gray-300 bg-yellow-200 text-gray-800 font-semibold w-3/5">
                        Taxable Amount
                      </th>
                      <td className="p-2 text-right border border-gray-300 bg-white">
                        ₹{amounts.taxableAmount.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <th className="p-2 text-left border border-gray-300 bg-yellow-200 text-gray-800 font-semibold">
                        Transportation charge
                      </th>
                      <td className="p-2 text-right border border-gray-300 bg-white">
                        ₹{amounts.transportationCharge.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <th className="p-2 text-left border border-gray-300 bg-yellow-200 text-gray-800 font-semibold">
                        Add- CGST
                      </th>
                      <td className="p-2 text-right border border-gray-300 bg-white">
                        ₹{amounts.cgst.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <th className="p-2 text-left border border-gray-300 bg-yellow-200 text-gray-800 font-semibold">
                        Add- SGST
                      </th>
                      <td className="p-2 text-right border border-gray-300 bg-white">
                        ₹{amounts.sgst.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <th className="p-2 text-left border border-gray-300 bg-yellow-200 text-gray-800 font-semibold">
                        Tax Amount: GST
                      </th>
                      <td className="p-2 text-right border border-gray-300 bg-white">
                        ₹{amounts.taxAmountGst.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="total-row">
                      <th className="p-2 text-left border border-gray-300 font-bold bg-yellow-200 text-gray-800">
                        Total Amount
                      </th>
                      <td className="p-2 text-right border border-gray-300 font-bold bg-yellow-200">
                        ₹{amounts.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Bank Details */}
            <div className="mt-8 mb-8">
              <div className="font-semibold text-gray-800 mb-4 text-sm uppercase">
                BANK DETAIL
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-center border border-gray-300 text-sm bg-yellow-200 text-gray-800 font-semibold">
                      Account Holder Name
                    </th>
                    <th className="p-2 text-center border border-gray-300 text-sm bg-yellow-200 text-gray-800 font-semibold">
                      Account No.
                    </th>
                    <th className="p-2 text-center border border-gray-300 text-sm bg-yellow-200 text-gray-800 font-semibold">
                      IFSC No.
                    </th>
                    <th className="p-2 text-center border border-gray-300 text-sm bg-yellow-200 text-gray-800 font-semibold">
                      Bank Name
                    </th>
                    <th className="p-2 text-center border border-gray-300 text-sm bg-yellow-200 text-gray-800 font-semibold">
                      Bank Branch Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 text-center border border-gray-300 text-sm">KRISHNAFURNISHING</td>
                    <td className="p-2 text-center border border-gray-300 text-sm">01230110420756</td>
                    <td className="p-2 text-center border border-gray-300 text-sm">VARA0289012</td>
                    <td className="p-2 text-center border border-gray-300 text-sm">The Varachha Co.op.Bank</td>
                    <td className="p-2 text-center border border-gray-300 text-sm">Yogi chock</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Footer */}
            <div className="mt-10 pt-5 border-t border-gray-300 flex justify-end">
              <div className="mt-16 border-t border-gray-800 pt-2 w-48 text-center text-sm">
                FOR, {companyData.name || "KRISHNA FURNISHING"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotePreview;
