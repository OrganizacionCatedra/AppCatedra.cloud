'use server';
import type { z } from 'zod';
import type { customerInfoSchema, VoiceInputSchema } from './schemas';
import type { AssistantInputSchema, chatMessageSchema } from './schemas';

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
  icon?: string;
  options?: ProductOption[];
  type: 'switch' | 'select';
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  products: Product[];
}

export interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  option?: ProductOption;
  category: string;
  icon?: string;
}

export type CustomerInfo = z.infer<typeof customerInfoSchema>;

// This remains the fundamental type for displaying messages
export type ChatMessage = z.infer<typeof chatMessageSchema>;


export type AssistantInput = z.infer<typeof AssistantInputSchema>;

export type VoiceInput = z.infer<typeof VoiceInputSchema>;
