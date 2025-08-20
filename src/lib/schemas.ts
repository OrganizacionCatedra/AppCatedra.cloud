import { z } from 'zod';

export const customerInfoSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, ingrese un email válido.' }),
  phone: z.string().min(7, { message: 'Por favor, ingrese un número de teléfono válido.' }),
  company: z.string().min(2, { message: 'El nombre de la empresa debe tener al menos 2 caracteres.' }),
  country: z.string().min(2, { message: 'Por favor, ingrese un país.' }),
  consent: z.boolean().refine(value => value === true, {
    message: 'Debe aceptar los términos y condiciones.',
  }),
});

// Esquema para un único mensaje
export const chatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});


// Esquema para un mensaje de chat de voz
export const voiceChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
  audio: z.string().optional(),
});


// Esquema para la entrada del flow del asistente
export const AssistantInputSchema = z.object({
  history: z.array(chatMessageSchema).describe('El historial de la conversación actual.'),
  context: z.object({
    products: z.any().describe('Un objeto JSON con todos los productos disponibles, sus opciones y precios.'),
    plans: z.any().describe('Un objeto JSON con todos los planes pre-diseñados.'),
  }),
});
