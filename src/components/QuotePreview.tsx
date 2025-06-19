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
          <div className="container" style={{
            maxWidth: '800px',
            margin: '20px auto',
            padding: '40px',
            backgroundColor: 'white',
            boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
            borderRadius: '8px',
            fontFamily: 'Roboto, Helvetica Neue, sans-serif',
            color: '#222222',
            lineHeight: '1.6'
          }}>
            <div className="header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '40px',
              flexWrap: 'wrap'
            }}>
              <div className="logo-section" style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%'
              }}>
                <div className="logo" style={{
                  width: '120px',
                  marginRight: '20px'
                }}>
                  <img src="/lovable-uploads/28281ec9-ba9b-4a7d-b2a3-8156d8ad8087.png" alt="Krishna Furnishing Logo" style={{
                    width: '100%',
                    height: 'auto'
                  }} />
                </div>
                <div className="company-details" style={{
                  flexGrow: 1
                }}>
                  <div className="company-name" style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#102695',
                    marginBottom: '5px'
                  }}>{companyData.name || "KRISHNA FURNISHING"}</div>
                  <div className="company-info" style={{
                    fontSize: '13px',
                    color: '#222222',
                    lineHeight: '1.4'
                  }}>
                    {companyData.address || "PLOT-141, SURAT, GUJARAT - 395001"}<br />
                    {companyData.email || "KRISHANAFURNISHING403@GMAIL.COM"}<br />
                    {companyData.phone || "+91 99045-39869"} | GSTIN: {companyData.taxId || "24BAHPK7431H1ZS"}
                  </div>
                </div>
                <div className="quotation-details" style={{
                  minWidth: '250px',
                  textAlign: 'right',
                  padding: '15px',
                  backgroundColor: '#f7f9fa',
                  borderRadius: '6px',
                  marginLeft: '20px'
                }}>
                  <div className="quotation-title" style={{
                    textTransform: 'uppercase',
                    fontSize: '22px',
                    fontWeight: '700',
                    letterSpacing: '2px',
                    color: '#102695',
                    marginBottom: '10px'
                  }}>Quotation</div>
                  <div className="quotation-number" style={{
                    fontSize: '13px',
                    margin: '5px 0'
                  }}><strong>Ref:</strong> {quoteData.quoteNumber}</div>
                  <div className="quotation-date" style={{
                    fontSize: '13px',
                    margin: '5px 0'
                  }}><strong>Date:</strong> {new Date(quoteData.date).toLocaleDateString()}</div>
                  <div className="quotation-validity" style={{
                    fontSize: '13px',
                    margin: '5px 0'
                  }}><strong>Valid Until:</strong> {new Date(quoteData.validUntil).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            
            <div className="client-section" style={{
              marginBottom: '40px'
            }}>
              <div className="client-details" style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '30px'
              }}>
                <div className="quote-to" style={{
                  width: '48%'
                }}>
                  <div className="section-title" style={{
                    fontWeight: '500',
                    color: '#102695',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '1px'
                  }}><strong>Quotation For</strong></div>
                  <div className="client-content" style={{
                    fontSize: '13px',
                    backgroundColor: '#f7f9fa',
                    padding: '15px',
                    borderRadius: '6px',
                    lineHeight: '1.6'
                  }}>
                    <strong>{quoteData.clientName || "CLIENT NAME"}</strong><br />
                    {quoteData.clientEmail || ""}<br />
                    {quoteData.clientAddress || ""}
                  </div>
                </div>
                <div className="ship-to" style={{
                  width: '48%'
                }}>
                  <div className="section-title" style={{
                    fontWeight: '500',
                    color: '#102695',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '1px'
                  }}>Ship To</div>
                  <div className="client-content" style={{
                    fontSize: '13px',
                    backgroundColor: '#f7f9fa',
                    padding: '15px',
                    borderRadius: '6px',
                    lineHeight: '1.6'
                  }}>
                    <strong>{quoteData.clientName || "CLIENT NAME"}</strong><br />
                    {quoteData.clientEmail || ""}<br />
                    {quoteData.clientAddress || ""}
                  </div>
                </div>
              </div>
            </div>
            
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '40px'
            }}>
              <thead style={{
                backgroundColor: '#102695',
                color: 'white'
              }}>
                <tr>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 15px',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>SR</th>
                  <th style={{
                    width: '40%',
                    textAlign: 'left',
                    padding: '12px 15px',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>PRODUCT DESCRIPTION</th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 15px',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>HSN/SAC</th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 15px',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>QTY</th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 15px',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>RATE</th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 15px',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>IGST Rate(%)</th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 15px',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>IGST Amount</th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 15px',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>TOTAL</th>
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
                    <tr key={index} style={{
                      backgroundColor: index % 2 === 1 ? '#f7f9fa' : 'white'
                    }}>
                      <td style={{
                        padding: '12px 15px',
                        borderBottom: '1px solid #bdc3c7',
                        fontSize: '13px'
                      }}>{index + 1}</td>
                      <td style={{
                        padding: '12px 15px',
                        borderBottom: '1px solid #bdc3c7',
                        fontSize: '13px'
                      }}>
                        <strong>{product?.name || "PRODUCT"}</strong><br />
                        {product?.description || ""}
                      </td>
                      <td style={{
                        padding: '12px 15px',
                        borderBottom: '1px solid #bdc3c7',
                        fontSize: '13px'
                      }}>7607</td>
                      <td style={{
                        padding: '12px 15px',
                        borderBottom: '1px solid #bdc3c7',
                        fontSize: '13px'
                      }}>{item.quantity} NOS</td>
                      <td style={{
                        padding: '12px 15px',
                        borderBottom: '1px solid #bdc3c7',
                        fontSize: '13px'
                      }}>₹{item.price.toFixed(2)}</td>
                      <td style={{
                        padding: '12px 15px',
                        borderBottom: '1px solid #bdc3c7',
                        fontSize: '13px'
                      }}>18.00</td>
                      <td style={{
                        padding: '12px 15px',
                        borderBottom: '1px solid #bdc3c7',
                        fontSize: '13px'
                      }}>₹{igstAmount.toFixed(2)}</td>
                      <td style={{
                        padding: '12px 15px',
                        borderBottom: '1px solid #bdc3c7',
                        fontSize: '13px'
                      }}>₹{totalWithIgst.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            <div className="terms-and-totals" style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '30px'
            }}>
              <div className="terms-section" style={{
                width: '45%'
              }}>
                <div className="terms-title" style={{
                  fontWeight: '600',
                  color: '#222222',
                  marginBottom: '15px',
                  fontSize: '14px',
                  textTransform: 'uppercase'
                }}>TERM AND CONDITION:-</div>
                <ol className="terms-list" style={{
                  paddingLeft: '20px',
                  margin: 0,
                  fontSize: '13px'
                }}>
                  <li style={{
                    marginBottom: '8px'
                  }}>PERIOD WITHIN 2 TO 4 WEEKS AFTER RECEIPT OF P.O.</li>
                  <li style={{
                    marginBottom: '8px'
                  }}>PAYMENT WITHIN 7 DAYS AFTER WORK</li>
                  {quoteData.notes && <li style={{
                    marginBottom: '8px'
                  }}>{quoteData.notes}</li>}
                </ol>
              </div>
              
              <div className="totals-section" style={{
                width: '50%'
              }}>
                <table className="amount-table" style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <tbody>
                    <tr>
                      <th style={{
                        padding: '10px',
                        textAlign: 'left',
                        border: '1px solid #bdc3c7',
                        backgroundColor: '#f8d27a',
                        color: '#222222',
                        fontWeight: '600',
                        width: '60%'
                      }}>Taxable Amount</th>
                      <td style={{
                        padding: '10px',
                        textAlign: 'right',
                        border: '1px solid #bdc3c7',
                        backgroundColor: '#fff'
                      }}>₹{amounts.taxableAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th style={{
                        padding: '10px',
                        textAlign: 'left',
                        border: '1px solid #bdc3c7',
                        backgroundColor: '#f8d27a',
                        color: '#222222',
                        fontWeight: '600'
                      }}>Transportation charge</th>
                      <td style={{
                        padding: '10px',
                        textAlign: 'right',
                        border: '1px solid #bdc3c7',
                        backgroundColor: '#fff'
                      }}>₹{amounts.transportationCharge.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th style={{
                        padding: '10px',
                        textAlign: 'left',
                        border: '1px solid #bdc3c7',
                        backgroundColor: '#f8d27a',
                        color: '#222222',
                        fontWeight: '600'
                      }}>Add- CGST</th>
                      <td style={{
                        padding: '10px',
                        textAlign: 'right',
                        border: '1px solid #bdc3c7',
                        backgroundColor: '#fff'
                      }}>₹{amounts.cgst.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th style={{
                        padding: '10px',
                        textAlign: 'left',
                        border: '1px solid #bdc3c7',
                        backgroundColor: '#f8d27a',
                        color: '#222222',
                        fontWeight: '600'
                      }}>Add- SGST</th>
                      <td style={{
                        padding: '10px',
                        textAlign: 'right',
                        border: '1px solid #bdc3c7',
                        backgroundColor: '#fff'
                      }}>₹{amounts.sgst.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th style={{
                        padding: '10px',
                        textAlign: 'left',
                        border: '1px solid #bdc3c7',
                        backgroundColor: '#f8d27a',
                        color: '#222222',
                        fontWeight: '600'
                      }}>Tax Amount: GST</th>
                      <td style={{
                        padding: '10px',
                        textAlign: 'right',
                        border: '1px solid #bdc3c7',
                        backgroundColor: '#fff'
                      }}>₹{amounts.taxAmountGst.toFixed(2)}</td>
                    </tr>
                    <tr className="total-row">
                      <th style={{
                        padding: '10px',
                        textAlign: 'left',
                        border: '1px solid #bdc3c7',
                        fontWeight: '700',
                        backgroundColor: '#f8d27a',
                        color: '#222222'
                      }}>Total Amount</th>
                      <td style={{
                        padding: '10px',
                        textAlign: 'right',
                        border: '1px solid #bdc3c7',
                        fontWeight: '700',
                        backgroundColor: '#f8d27a'
                      }}>₹{amounts.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bank-details-horizontal" style={{
              marginTop: '30px',
              marginBottom: '30px'
            }}>
              <div className="bank-title" style={{
                fontWeight: '600',
                color: '#222222',
                marginBottom: '15px',
                fontSize: '14px',
                textTransform: 'uppercase'
              }}>BANK DETAIL</div>
              <table className="bank-table" style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr>
                    <th style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      fontSize: '13px',
                      backgroundColor: '#f8d27a',
                      color: '#222222',
                      fontWeight: '600'
                    }}>Account Holder Name</th>
                    <th style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      fontSize: '13px',
                      backgroundColor: '#f8d27a',
                      color: '#222222',
                      fontWeight: '600'
                    }}>Account No.</th>
                    <th style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      fontSize: '13px',
                      backgroundColor: '#f8d27a',
                      color: '#222222',
                      fontWeight: '600'
                    }}>IFSC No.</th>
                    <th style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      fontSize: '13px',
                      backgroundColor: '#f8d27a',
                      color: '#222222',
                      fontWeight: '600'
                    }}>Bank Name</th>
                    <th style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      fontSize: '13px',
                      backgroundColor: '#f8d27a',
                      color: '#222222',
                      fontWeight: '600'
                    }}>Bank Branch Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      fontSize: '13px'
                    }}>KRISHNAFURNISHING</td>
                    <td style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      fontSize: '13px'
                    }}>01230110420756</td>
                    <td style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      fontSize: '13px'
                    }}>VARA0289012</td>
                    <td style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      fontSize: '13px'
                    }}>The Varachha Co.op.Bank</td>
                    <td style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      fontSize: '13px'
                    }}>Yogi chock</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="footer" style={{
              marginTop: '40px',
              paddingTop: '20px',
              borderTop: '1px solid #bdc3c7',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <div className="signature" style={{
                marginTop: '60px',
                borderTop: '1px solid #222222',
                paddingTop: '10px',
                width: '200px',
                textAlign: 'center',
                fontSize: '13px'
              }}>
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
