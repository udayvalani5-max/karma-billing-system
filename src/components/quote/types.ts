
export interface CompanyData {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  hsnSac: string;
  price: number;
  unit: string;
  igstRate: number;
}

export interface QuoteItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

export interface QuoteData {
  quoteNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  date: string;
  validUntil: string;
  items: QuoteItem[];
  notes: string;
  subtotal: number;
  tax: number;
  total: number;
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  pinCode: string;
  createdAt: string;
}

export interface InvoiceData extends QuoteData {
  id: string;
  status: 'draft' | 'sent' | 'paid';
  createdAt: string;
  updatedAt: string;
}
