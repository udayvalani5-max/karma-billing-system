
import { CompanyData } from './types';

interface QuoteFooterProps {
  companyData: CompanyData;
}

const QuoteFooter = ({ companyData }: QuoteFooterProps) => {
  return (
    <div className="footer mt-10 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
      <p className="mb-2 font-medium">Thank you for your business!</p>
      {companyData.taxId && <p>Tax ID: {companyData.taxId}</p>}
    </div>
  );
};

export default QuoteFooter;
