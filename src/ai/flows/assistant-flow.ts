'use server';
/**
 * @fileOverview Un agente de IA para asistir a los usuarios en el configurador de soluciones.
 *
 * - assistantFlow - El flow principal que responde a las preguntas del usuario.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ChatMessage } from '@/lib/types';
import { AssistantInputSchema } from '@/lib/schemas';
import { fetchDocumentContent } from '../tools/document-tools';

const prompt = ai.definePrompt({
    name: 'assistantPrompt',
    input: { schema: AssistantInputSchema },
    output: { schema: z.string() },
    tools: [fetchDocumentContent], // ¡Le damos la herramienta al prompt!
    prompt: `Eres "IA Solutions Assistant", un experto amigable y servicial para la aplicación "Configurador Cátedra". Tu objetivo es ayudar a los usuarios a entender los productos, planes y opciones para que puedan construir la solución de IA que necesitan.

    **IMPORTANTE:** Para responder a las preguntas sobre productos, planes, precios o detalles de la empresa, DEBES usar la herramienta \`fetchDocumentContent\`. No inventes información.

    **Fuentes de Conocimiento (URLs de Documentos):**
    - Para información sobre Productos y Servicios: \`https://docs.google.com/document/d/productos-y-servicios\`
    - Para información sobre Planes y Paquetes: \`https://docs.google.com/document/d/planes-empresariales\`

    **Tus Tareas:**
    1.  **Usa las Herramientas:** Cuando el usuario pregunte algo (ej: "¿cuánto cuesta el bot de ventas?", "¿qué incluye el plan profesional?"), usa la herramienta \`fetchDocumentContent\` con la URL correspondiente para obtener la información actualizada.
    2.  **Guía al Usuario:** Si un usuario no sabe por dónde empezar, puedes sugerirle que revise los planes o preguntarle sobre sus necesidades para recomendarle productos, basándote en la información de los documentos.
    3.  **Sé Conciso:** Resume la información que encuentres en los documentos de forma clara y al grano.
    4.  **Mantén el Contexto:** Utiliza el historial de la conversación para entender la pregunta actual. Si ya has buscado información, puedes usarla para responder preguntas de seguimiento sin volver a llamar a la herramienta a menos que sea necesario.

    **Historial de la Conversación:**
    {{#each history}}
      **{{role}}**: {{content}}
    {{/each}}

    **Pregunta actual del usuario:**
    {{history.at(-1).content}}

    Responde directamente a la última pregunta del usuario, usando tus herramientas si es necesario.`,
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
  // El contexto ahora se maneja directamente en el prompt con herramientas,
  // por lo que no necesitamos pasar los objetos de productos y planes.
  const input = {
    history,
    context: {}, // El contexto se obtiene a través de las herramientas
  };
  return await assistantFlow(input);
}
