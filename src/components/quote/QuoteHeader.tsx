
import { CompanyData, QuoteData } from './types';

interface QuoteHeaderProps {
  companyData: CompanyData;
  quoteData: QuoteData;
}

const QuoteHeader = ({ companyData, quoteData }: QuoteHeaderProps) => {
  // Helper function to construct full address
  const getFullAddress = (company: CompanyData) => {
    const addressParts = [
      company.streetAddress,
      company.city,
      company.state,
      company.pinCode
    ].filter(Boolean);
    return addressParts.length > 0 ? addressParts.join(', ') : "";
  };

  return (
    <div className="header">
      <div className="company-info">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">{companyData.name || "Your Company"}</h1>
        {getFullAddress(companyData) && <p className="text-sm text-gray-600 mb-1">{getFullAddress(companyData)}</p>}
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
  );
};

export default QuoteHeader;
