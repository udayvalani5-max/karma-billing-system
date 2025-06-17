
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { QuoteData, QuoteItem, Product } from './types';

interface QuoteItemsFormProps {
  quoteData: QuoteData;
  products: Product[];
  onQuoteUpdate: (field: keyof QuoteData, value: any) => void;
  onAddItem: () => void;
  onUpdateItem: (index: number, field: keyof QuoteItem, value: any) => void;
  onRemoveItem: (index: number) => void;
}

const QuoteItemsForm = ({ 
  quoteData, 
  products, 
  onQuoteUpdate,
  onAddItem, 
  onUpdateItem, 
  onRemoveItem 
}: QuoteItemsFormProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Quote Items
          <Button onClick={onAddItem} size="sm">
            <Plus size={16} className="mr-2" />
            Add Item
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quoteData.items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-4">
                  <Label>Product</Label>
                  <Select
                    value={item.productId}
                    onValueChange={(value) => onUpdateItem(index, 'productId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ${product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => onUpdateItem(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="col-span-3">
                  <Label>Total</Label>
                  <Input
                    value={`$${item.total.toFixed(2)}`}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                
                <div className="col-span-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveItem(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {quoteData.items.length === 0 && (
            <p className="text-gray-500 text-center py-8">No items added yet</p>
          )}
        </div>

        {/* Totals */}
        <div className="mt-6 border-t pt-4">
          <div className="space-y-2 max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${quoteData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span>${quoteData.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${quoteData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <Label>Notes</Label>
          <Textarea
            value={quoteData.notes}
            onChange={(e) => onQuoteUpdate('notes', e.target.value)}
            placeholder="Additional notes or terms"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteItemsForm;
