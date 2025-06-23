
import { Product, QuoteData } from './types';

interface ItemsTableProps {
  quoteData: QuoteData;
  products: Product[];
}

const ItemsTable = ({ quoteData, products }: ItemsTableProps) => {
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  const getProductDescription = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.description : "";
  };

  const getProductHsnSac = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.hsnSac : "7607";
  };

  const getProductIgstRate = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.igstRate : 18;
  };

  return (
    <div className="items-section">
      <table className="items-table w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">SR</th>
            <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Product Description</th>
            <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700">HSN/SAC</th>
            <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700">QTY</th>
            <th className="border border-gray-300 p-3 text-right font-semibold text-gray-700">Rate</th>
            <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700">IGST Rate(%)</th>
            <th className="border border-gray-300 p-3 text-right font-semibold text-gray-700">IGST Amount</th>
            <th className="border border-gray-300 p-3 text-right font-semibold text-gray-700">Total</th>
          </tr>
        </thead>
        <tbody>
          {quoteData.items.map((item, index) => {
            const igstRate = getProductIgstRate(item.productId);
            const productTotal = item.price * item.quantity;
            const igstAmount = (productTotal * igstRate) / 100;
            const totalWithIgst = productTotal + igstAmount;
            
            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3 text-gray-900">{index + 1}</td>
                <td className="border border-gray-300 p-3 text-gray-900">
                  <strong>{getProductName(item.productId)}</strong>
                  {getProductDescription(item.productId) && (
                    <div className="text-sm text-gray-600">{getProductDescription(item.productId)}</div>
                  )}
                </td>
                <td className="border border-gray-300 p-3 text-center text-gray-900">{getProductHsnSac(item.productId)}</td>
                <td className="border border-gray-300 p-3 text-center text-gray-900">{item.quantity} NOS</td>
                <td className="border border-gray-300 p-3 text-right text-gray-900">₹{item.price.toFixed(2)}</td>
                <td className="border border-gray-300 p-3 text-center text-gray-900">{igstRate.toFixed(2)}</td>
                <td className="border border-gray-300 p-3 text-right text-gray-900">₹{igstAmount.toFixed(2)}</td>
                <td className="border border-gray-300 p-3 text-right font-semibold text-gray-900">₹{totalWithIgst.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsTable;
