'use server';
/**
 * @fileOverview Un agente de IA para procesar interacciones de voz.
 *
 * - voiceAssistantFlow - El flow principal que maneja la transcripción, la respuesta de IA y la síntesis de voz.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { askAssistant } from './assistant-flow';
import type { ChatMessage } from '@/lib/types';
import { googleAI } from '@genkit-ai/googleai';
import wav from 'wav';
import { VoiceInputSchema } from '@/lib/schemas';
import type { VoiceInput } from '@/lib/types';


const toWav = async (
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      const bufs: any[] = [];
      writer.on('error', reject);
      writer.on('data', (d) => bufs.push(d));
      writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
  
      writer.write(pcmData);
      writer.end();
    });
  }

export const voiceAssistantFlow = ai.defineFlow(
  {
    name: 'voiceAssistantFlow',
    inputSchema: VoiceInputSchema,
    outputSchema: z.object({
      text: z.object({
        userInput: z.string(),
        modelResponse: z.string(),
      }),
      audio: z.string().optional(),
    }),
  },
  async ({ audioDataUri, history }) => {
    
    // 1. Transcribir el audio a texto
    const { text: transcribedText } = await ai.generate({
        model: googleAI.model('gemini-2.0-flash'),
        prompt: [{
            text: "Transcribe el siguiente audio:"
        },{
            media: { url: audioDataUri }
        }]
    });

    if (!transcribedText) {
        throw new Error('La transcripción de audio falló.');
    }
    
    // 2. Obtener respuesta del asistente de IA
    const userMessage: ChatMessage = { role: 'user', content: transcribedText };
    const fullHistory = [...history, userMessage];
    const assistantResponseText = await askAssistant(fullHistory);

    // 3. Convertir la respuesta a voz (Text-to-Speech)
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: assistantResponseText,
      });
  
      if (!media) {
        throw new Error('La conversión de texto a voz falló.');
      }
      
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      const wavBase64 = await toWav(audioBuffer);
      const audioResponseDataUri = 'data:audio/wav;base64,' + wavBase64;


    // 4. Devolver todo
    return {
      text: {
        userInput: transcribedText,
        modelResponse: assistantResponseText,
      },
      audio: audioResponseDataUri,
    };
  }
);

// Función exportada que la API llamará
export async function processVoice(input: VoiceInput) {
  return await voiceAssistantFlow(input);
}