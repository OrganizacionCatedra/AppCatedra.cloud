// src/ai/tools/document-tools.ts
'use server';
/**
 * @fileOverview Herramientas para interactuar con fuentes de documentos externos como Google Drive.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { google } from 'googleapis';

// Helper function to get the authentication client
const getAuth = () => {
  // La librería de googleapis encontrará automáticamente las credenciales
  // si la variable de entorno GOOGLE_APPLICATION_CREDENTIALS está configurada.
  // No necesitamos leer el archivo manualmente.
  return new google.auth.GoogleAuth({
    scopes: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/documents.readonly',
        'https://www.googleapis.com/auth/spreadsheets.readonly'
    ],
  });
};

const extractDocIdFromUrl = (url: string) => {
    const match = url.match(/\/d\/(.*?)\//);
    return match ? match[1] : null;
}

export const fetchDocumentContent = ai.defineTool(
  {
    name: 'fetchDocumentContent',
    description: 'Busca y devuelve el contenido de un documento específico de Google Docs o Google Sheets a partir de su URL. Útil para obtener información detallada sobre productos, planes o políticas de la empresa.',
    inputSchema: z.object({
        url: z.string().url().describe('La URL completa del Google Doc o Google Sheet a leer.'),
    }),
    outputSchema: z.string().describe('El contenido del documento como texto plano.'),
  },
  async ({ url }) => {
    try {
        const auth = getAuth();
        const docId = extractDocIdFromUrl(url);

        if (!docId) {
            throw new Error('No se pudo extraer el ID del documento de la URL.');
        }

        // Determinar si es un Google Doc o un Google Sheet
        if (url.includes('/document/d/')) {
            // Es un Google Doc
            const docs = google.docs({ version: 'v1', auth });
            const response = await docs.documents.get({
                documentId: docId,
            });
            const content = response.data.body?.content;
            return content?.map(element => {
                if (element.paragraph) {
                    return element.paragraph.elements?.map(elem => elem.textRun?.content).join('');
                }
                return '';
            }).join('\n') ?? 'El documento está vacío o no se pudo leer el contenido.';
        } else if (url.includes('/spreadsheets/d/')) {
            // Es un Google Sheet
            const sheets = google.sheets({ version: 'v4', auth });
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: docId,
                range: 'A1:Z1000', // Leer un rango amplio, ajústalo si es necesario
            });
            const rows = response.data.values;
            if (rows && rows.length) {
                return rows.map(row => row.join('\t')).join('\n');
            }
            return 'La hoja de cálculo está vacía o no se pudo leer el contenido.';
        } else {
            return 'La URL no parece ser de un Google Doc o Google Sheet válido.';
        }

    } catch (error) {
        console.error('Error al acceder a la API de Google:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido.';
        return `Ocurrió un error al intentar leer el documento: ${errorMessage}. Asegúrate de haber compartido el documento con el email del service account.`;
    }
  }
);
