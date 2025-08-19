
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  productIds: string[];
  isPopular?: boolean;
}

export const plans: Plan[] = [
  {
    id: 'plan-basico',
    name: 'Básico',
    description: 'Ideal para startups y pequeños proyectos que necesitan una presencia inicial.',
    price: 550,
    features: [
      'Bot de Atención al Cliente',
      'Hosting Básico',
      'Soporte Básico (Email)',
    ],
    productIds: ['bot-atencion-cliente', 'hosting', 'support-plan'],
  },
  {
    id: 'plan-profesional',
    name: 'Profesional',
    description: 'La solución perfecta para empresas en crecimiento que buscan automatizar procesos clave.',
    price: 1600,
    isPopular: true,
    features: [
      'Bot de Atención al Cliente',
      'Bot de Ventas',
      'Hosting Profesional',
      'Dashboard de Analítica',
      'Soporte Avanzado (Email y Chat)',
    ],
    productIds: ['bot-atencion-cliente', 'bot-ventas', 'hosting', 'analytics-dashboard', 'support-plan'],
  },
  {
    id: 'plan-empresarial',
    name: 'Empresarial',
    description: 'Potencia máxima para corporaciones que requieren integración y soporte de primer nivel.',
    price: 4500,
    features: [
      'Todo lo del plan Profesional',
      'Integración Gemini Pro',
      'Integración con GitHub',
      'Integración con Shopify',
      'Soporte Premium (24/7 Dedicado)',
    ],
    productIds: ['bot-atencion-cliente', 'bot-ventas', 'hosting', 'gemini-pro', 'integration-github', 'integration-shopify', 'analytics-dashboard', 'support-plan'],
  },
];
