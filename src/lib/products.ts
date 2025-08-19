import { Bot, Server, BrainCircuit, Rocket } from 'lucide-react';
import type { Category } from './types';

export const productCategories: Category[] = [
  {
    id: 'bots',
    name: 'Bots Personalizados',
    description: 'Automatice tareas y mejore la interacción con nuestros bots inteligentes.',
    products: [
      {
        id: 'bot-atencion-cliente',
        name: 'Bot de Atención al Cliente',
        description: 'Responde preguntas frecuentes 24/7 y escala casos complejos a agentes humanos.',
        price: 500,
        icon: Bot,
        type: 'switch',
      },
      {
        id: 'bot-ventas',
        name: 'Bot de Ventas',
        description: 'Califica leads, agenda demostraciones y cierra ventas de forma automática.',
        price: 750,
        icon: Rocket,
        type: 'switch',
      },
    ],
  },
  {
    id: 'infraestructura',
    name: 'Infraestructura y Hosting',
    description: 'Soluciones de hosting optimizadas para el rendimiento de sus aplicaciones de IA.',
    products: [
      {
        id: 'hosting',
        name: 'Hosting Dedicado',
        description: 'Seleccione el plan de hosting que mejor se adapte a sus necesidades.',
        price: 100, // This price is for the default option
        icon: Server,
        type: 'select',
        options: [
          { id: 'hosting-basico', label: 'Básico', price: 100 },
          { id: 'hosting-profesional', label: 'Profesional', price: 250 },
          { id: 'hosting-empresarial', label: 'Empresarial', price: 500 },
        ],
      },
    ],
  },
  {
    id: 'ia-models',
    name: 'Modelos de IA',
    description: 'Integre la potencia de los modelos de IA más avanzados en sus productos.',
    products: [
      {
        id: 'gemini-pro',
        name: 'Integración Gemini Pro',
        description: 'Acceso a la API de Gemini Pro para capacidades de razonamiento y generación de contenido.',
        price: 1200,
        icon: BrainCircuit,
        type: 'switch',
      },
    ],
  },
];
