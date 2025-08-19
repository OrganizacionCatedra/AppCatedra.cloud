import type { z } from 'zod';
import type { customerInfoSchema } from './schemas';

export interface ProductOption {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ComponentType<{ className?: string }>;
  options?: ProductOption[];
  type: 'switch' | 'select';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  option?: ProductOption;
}

export type CustomerInfo = z.infer<typeof customerInfoSchema>;
