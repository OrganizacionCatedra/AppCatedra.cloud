// src/app/api/voice-assistant/route.ts
import { processVoice } from '@/ai/flows/voice-assistant-flow';
import { VoiceInputSchema } from '@/lib/schemas';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    const rawInput = await req.json();
    
    // Validar la entrada con Zod
    const validatedInput = VoiceInputSchema.parse(rawInput);
    
    const result = await processVoice(validatedInput);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error en la ruta /api/voice-assistant:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Entrada inválida.', details: error.errors },
        { status: 400 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido en el servidor.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
