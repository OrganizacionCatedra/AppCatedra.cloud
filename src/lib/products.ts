import { Bot, Server, BrainCircuit, Rocket, Link, BarChart, Wrench, GitBranch, ShoppingCart } from 'lucide-react';
import type { ProductCategory } from './types';

export const productCategories: ProductCategory[] = [
  {
    id: 'bots',
    name: 'Bots',
    description: 'Automatice tareas y mejore la interacción con nuestros bots inteligentes.',
    icon: Bot,
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
    name: 'Infraestructura',
    description: 'Soluciones de hosting optimizadas para el rendimiento de sus aplicaciones de IA.',
    icon: Server,
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
    name: 'Modelos IA',
    description: 'Integre la potencia de los modelos de IA más avanzados en sus productos.',
    icon: BrainCircuit,
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
  {
    id: 'integrations',
    name: 'Integraciones',
    description: 'Conecte sus herramientas favoritas.',
    icon: Link,
    products: [
      {
        id: 'integration-github',
        name: 'Integración con GitHub',
        description: 'Automatice flujos de trabajo de desarrollo y despliegue continuo.',
        price: 350,
        icon: GitBranch,
        type: 'switch',
      },
      {
        id: 'integration-shopify',
        name: 'Integración con Shopify',
        description: 'Sincronice productos, pedidos y clientes para su bot de ventas.',
        price: 400,
        icon: ShoppingCart,
        type: 'switch',
      },
    ]
  },
  {
    id: 'analytics',
    name: 'Analítica',
    description: 'Visualice y entienda sus datos.',
    icon: BarChart,
    products: [
       {
        id: 'analytics-dashboard',
        name: 'Dashboard de Analítica',
        description: 'Panel de control en tiempo real para monitorizar el rendimiento de sus bots.',
        price: 600,
        icon: BarChart,
        type: 'switch',
      }
    ]
  },
  {
    id: 'support',
    name: 'Soporte',
    description: 'Planes de soporte técnico.',
    icon: Wrench,
    products: [
       {
        id: 'support-plan',
        name: 'Plan de Soporte',
        description: 'Acceso prioritario a nuestro equipo de expertos para resolver cualquier incidencia.',
        price: 300,
        icon: Wrench,
        type: 'select',
        options: [
            { id: 'soporte-basico', label: 'Básico (Email)', price: 300 },
            { id: 'soporte-avanzado', label: 'Avanzado (Email y Chat)', price: 600 },
            { id: 'soporte-premium', label: 'Premium (24/7 Dedicado)', price: 1500 },
        ]
      }
    ]
  }
];
