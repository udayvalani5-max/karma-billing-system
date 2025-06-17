
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuoteData } from './types';

interface QuoteDetailsFormProps {
  quoteData: QuoteData;
  onUpdate: (field: keyof QuoteData, value: any) => void;
}

const QuoteDetailsForm = ({ quoteData, onUpdate }: QuoteDetailsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Quote Number</Label>
          <Input
            value={quoteData.quoteNumber}
            onChange={(e) => onUpdate('quoteNumber', e.target.value)}
          />
        </div>
        
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={quoteData.date}
            onChange={(e) => onUpdate('date', e.target.value)}
          />
        </div>
        
        <div>
          <Label>Valid Until</Label>
          <Input
            type="date"
            value={quoteData.validUntil}
            onChange={(e) => onUpdate('validUntil', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteDetailsForm;
