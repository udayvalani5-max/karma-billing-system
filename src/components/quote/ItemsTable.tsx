
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

  return (
    <div className="items-section">
      <table className="items-table w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Item</th>
            <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700">Quantity</th>
            <th className="border border-gray-300 p-3 text-right font-semibold text-gray-700">Unit Price</th>
            <th className="border border-gray-300 p-3 text-right font-semibold text-gray-700">Total</th>
          </tr>
        </thead>
        <tbody>
          {quoteData.items.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-3 text-gray-900">{getProductName(item.productId)}</td>
              <td className="border border-gray-300 p-3 text-center text-gray-900">{item.quantity}</td>
              <td className="border border-gray-300 p-3 text-right text-gray-900">${item.price.toFixed(2)}</td>
              <td className="border border-gray-300 p-3 text-right font-semibold text-gray-900">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsTable;
