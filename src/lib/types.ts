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

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  products: Product[];
}

export interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  option?: ProductOption;
  category: string;
}

export type CustomerInfo = z.infer<typeof customerInfoSchema>;
