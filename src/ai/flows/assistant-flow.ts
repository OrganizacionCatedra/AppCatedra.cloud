'use server';
/**
 * @fileOverview Un agente de IA para asistir a los usuarios en el configurador de soluciones.
 *
 * - assistantFlow - El flow principal que responde a las preguntas del usuario.
 * - AssistantInput - El tipo de entrada para el flow.
 * - ChatMessage - El tipo para un único mensaje en la conversación.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { productCategories } from '@/lib/products';
import { plans } from '@/lib/plans';

// Esquema para un único mensaje
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Esquema para la entrada del flow
export const AssistantInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('El historial de la conversación actual.'),
  context: z.object({
    products: z.any().describe('Un objeto JSON con todos los productos disponibles, sus opciones y precios.'),
    plans: z.any().describe('Un objeto JSON con todos los planes pre-diseñados.'),
  }),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;


const prompt = ai.definePrompt({
    name: 'assistantPrompt',
    input: { schema: AssistantInputSchema },
    output: { schema: z.string() },
    prompt: `Eres "IA Solutions Assistant", un experto amigable y servicial para la aplicación "IA Solutions Configurator". Tu objetivo es ayudar a los usuarios a entender los productos, planes y opciones para que puedan construir la solución de IA que necesitan.

    **Tu Contexto:**
    - Productos Disponibles: {{{json context.products}}}
    - Planes Pre-diseñados: {{{json context.plans}}}

    **Tus Tareas:**
    1.  **Responde Preguntas:** Contesta dudas sobre qué hace cada producto, cuáles son sus precios, qué incluyen los planes, etc.
    2.  **Guía al Usuario:** Si un usuario no sabe por dónde empezar, puedes sugerirle el "Plan Profesional" como un buen punto de partida o preguntarle sobre sus necesidades para recomendarle productos.
    3.  **Sé Conciso:** Da respuestas claras y al grano. Evita párrafos largos. Usa listas si es necesario.
    4.  **Mantén el Contexto:** Utiliza el historial de la conversación para entender la pregunta actual.

    **Historial de la Conversación:**
    {{#each history}}
      **{{role}}**: {{content}}
    {{/each}}

    **Pregunta actual del usuario:**
    {{history.at(-1).content}}

    Responde directamente a la última pregunta del usuario.`,
});


export const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

// Función exportada que el frontend llamará
export async function askAssistant(history: ChatMessage[]): Promise<string> {
  const input: AssistantInput = {
    history,
    context: {
      products: productCategories,
      plans,
    },
  };
  return await assistantFlow(input);
}
