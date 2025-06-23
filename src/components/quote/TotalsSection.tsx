
import { QuoteData, Product } from './types';

interface TotalsSectionProps {
  quoteData: QuoteData;
  products?: Product[];
}

const TotalsSection = ({ quoteData, products = [] }: TotalsSectionProps) => {
  const getProductIgstRate = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.igstRate : 18;
  };

  // Calculate amounts based on user specifications
  const calculateAmounts = () => {
    // Taxable Amount = sum of (rate * qty) for each product
    const taxableAmount = quoteData.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Transportation charge (fixed at 0 as per template)
    const transportationCharge = 0;

    // Calculate IGST for each product using individual IGST rates and sum them
    const totalIgstAmount = quoteData.items.reduce((sum, item) => {
      const productTotal = item.price * item.quantity;
      const igstRate = getProductIgstRate(item.productId);
      const igstAmount = (productTotal * igstRate) / 100;
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

  return (
    <div className="totals-section flex justify-end">
      <div className="totals-box w-80 border border-gray-300 rounded-lg overflow-hidden">
        <div className="totals-row flex justify-between p-4 border-b border-gray-200">
          <span className="text-gray-700">Taxable Amount:</span>
          <span className="text-gray-900 font-medium">₹{amounts.taxableAmount.toFixed(2)}</span>
        </div>
        <div className="totals-row flex justify-between p-4 border-b border-gray-200">
          <span className="text-gray-700">Transportation charge:</span>
          <span className="text-gray-900 font-medium">₹{amounts.transportationCharge.toFixed(2)}</span>
        </div>
        <div className="totals-row flex justify-between p-4 border-b border-gray-200">
          <span className="text-gray-700">Add- CGST:</span>
          <span className="text-gray-900 font-medium">₹{amounts.cgst.toFixed(2)}</span>
        </div>
        <div className="totals-row flex justify-between p-4 border-b border-gray-200">
          <span className="text-gray-700">Add- SGST:</span>
          <span className="text-gray-900 font-medium">₹{amounts.sgst.toFixed(2)}</span>
        </div>
        <div className="totals-row flex justify-between p-4 border-b border-gray-200">
          <span className="text-gray-700">Tax Amount: GST:</span>
          <span className="text-gray-900 font-medium">₹{amounts.taxAmountGst.toFixed(2)}</span>
        </div>
        <div className="totals-row flex justify-between p-4 bg-gray-50 font-bold text-lg">
          <span className="text-gray-900">Total Amount:</span>
          <span className="text-gray-900">₹{amounts.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default TotalsSection;
