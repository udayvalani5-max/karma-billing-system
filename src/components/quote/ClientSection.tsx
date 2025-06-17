
import { QuoteData } from './types';

interface ClientSectionProps {
  quoteData: QuoteData;
}

const ClientSection = ({ quoteData }: ClientSectionProps) => {
  return (
    <div className="client-section">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Quote To:</h3>
      <div className="client-box bg-gray-50 p-5 rounded-lg border">
        <p className="client-name font-semibold text-gray-900 mb-2">{quoteData.clientName}</p>
        {quoteData.clientEmail && <p className="client-details text-sm text-gray-600 mb-1">{quoteData.clientEmail}</p>}
        {quoteData.clientAddress && <p className="client-details text-sm text-gray-600 whitespace-pre-line">{quoteData.clientAddress}</p>}
      </div>
    </div>
  );
};

export default ClientSection;
