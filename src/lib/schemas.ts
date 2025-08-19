import { z } from 'zod';

export const customerInfoSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, ingrese un email válido.' }),
  phone: z.string().min(7, { message: 'Por favor, ingrese un número de teléfono válido.' }),
  company: z.string().min(2, { message: 'El nombre de la empresa debe tener al menos 2 caracteres.' }),
  country: z.string().min(2, { message: 'Por favor, ingrese un país.' }),
});
