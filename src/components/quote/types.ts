
export interface CompanyData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
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
