
import { QuoteData } from './types';

interface TotalsSectionProps {
  quoteData: QuoteData;
}

const TotalsSection = ({ quoteData }: TotalsSectionProps) => {
  return (
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
  );
};

export default TotalsSection;
