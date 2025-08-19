import type { z } from 'zod';
import type { customerInfoSchema } from './schemas';
import type { LucideProps, Icon as LucideIcon } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface ProductOption {
  id: string;
  label: string;
  price: number;
}

// Making icon optional as not all products might have a specific one
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  icon?: LucideIcon;
  options?: ProductOption[];
  type: 'switch' | 'select';
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  products: Product[];
}

export interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  option?: ProductOption;
  category: string;
  icon?: LucideIcon;
}

export type CustomerInfo = z.infer<typeof customerInfoSchema>;
