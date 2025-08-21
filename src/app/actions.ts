'use server';

import type { CustomerInfo, SelectedProduct } from '@/lib/types';

interface OrderPayload {
  customerInfo: CustomerInfo;
  selectedProducts: SelectedProduct[];
  totalCost: number;
}

export async function processOrder(payload: OrderPayload) {
  console.log('Processing order...', payload);
  
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 1. Payment Integration Simulation
  const paymentSuccessful = Math.random() > 0.1; // 90% success rate
  
  if (!paymentSuccessful) {
    console.error('Simulated payment failure.');
    return { success: false, error: 'La simulación del pago ha fallado. Por favor, intente de nuevo.' };
  }

  // 2. n8n Webhook Notification
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  
  if (webhookUrl) {
    try {
      const webhookPayload = {
        order_id: `ORD-${Date.now()}`,
        customer_name: payload.customerInfo.name,
        customer_email: payload.customerInfo.email,
        company: payload.customerInfo.company,
        phone: payload.customerInfo.phone,
        country: payload.customerInfo.country,
        total_amount: payload.totalCost,
        products: payload.selectedProducts.map(p => ({
            name: p.name,
            option: p.option?.label,
            price: p.price,
        })),
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }
      console.log('Webhook sent successfully to n8n.');

    } catch (error) {
      console.error('Error sending webhook to n8n:', error);
      // You could decide to still return success to the user and handle the webhook failure separately
      // For now, we'll let it pass but log the error.
    }
  } else {
    console.warn('N8N_WEBHOOK_URL is not set. Skipping webhook notification.');
  }
  
  // 3. Simulating other processes
  // In a real scenario, the invoice URL would come from the n8n response or a subsequent step
  const invoiceUrl = `https://example.com/invoices/INV-${Date.now()}.pdf`;
  console.log(`Generated invoice: ${invoiceUrl}`);
  console.log('Order persisted to database.');
  
  return { success: true, invoiceUrl };
}
