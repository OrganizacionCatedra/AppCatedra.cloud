// src/app/api/ask-assistant/route.ts
import { askAssistant } from '@/ai/flows/assistant-flow';
import type { ChatMessage } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { history } = (await req.json()) as { history: ChatMessage[] };

    if (!history || !Array.isArray(history)) {
      return NextResponse.json(
        { error: 'El historial (history) es requerido y debe ser un array.' },
        { status: 400 }
      );
    }
    
    const assistantResponse = await askAssistant(history);

    return NextResponse.json({ response: assistantResponse });
  } catch (error) {
    console.error('Error en la ruta /api/ask-assistant:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido en el servidor.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
