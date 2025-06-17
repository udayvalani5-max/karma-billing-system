
import { QuoteData } from './types';

interface NotesSectionProps {
  quoteData: QuoteData;
}

const NotesSection = ({ quoteData }: NotesSectionProps) => {
  if (!quoteData.notes) return null;

  return (
    <div className="notes-section">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Notes:</h3>
      <div className="notes-content text-sm text-gray-600 whitespace-pre-line leading-relaxed">{quoteData.notes}</div>
    </div>
  );
};

export default NotesSection;
