'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomerForm from './customer-form';
import ProductSelector from './product-selector';
import Confirmation from './confirmation';
import type { CustomerInfo, SelectedProduct } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

type Step = 'customer' | 'products' | 'confirmation';

export default function Configurator({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [step, setStep] = useState<Step>('customer');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  const handleCustomerSubmit = (data: CustomerInfo) => {
    setCustomerInfo(data);
    setStep('products');
  };

  const handleProductsSubmit = (products: SelectedProduct[], total: number) => {
    setSelectedProducts(products);
    setTotalCost(total);
    setStep('confirmation');
  };
  
  const handleBackToProducts = () => {
    setStep('products');
  }

  const handleRestart = () => {
    setCustomerInfo(null);
    setSelectedProducts([]);
    setTotalCost(0);
    setStep('customer');
  };

  const progressValue = step === 'customer' ? 10 : step === 'products' ? 50 : 100;

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          Configurador de Soluciones de IA
        </h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-5 sm:text-xl">
          Construya su solución a medida en tres sencillos pasos.
        </p>
      </header>

      {step !== 'confirmation' && (
        <div className="w-full max-w-2xl mx-auto">
          <Progress value={progressValue} className="h-2" />
          <ol className="grid grid-cols-3 mt-2 text-sm font-medium text-center text-muted-foreground">
              <li className={`flex justify-start ${step === 'customer' ? 'text-foreground font-semibold' : ''}`}>
                <span>1. Información</span>
              </li>
              <li className={`flex justify-center ${step === 'products' ? 'text-foreground font-semibold' : ''}`}>
                <span>2. Productos</span>
              </li>
              <li className={`flex justify-end`}>
                <span>3. Confirmación</span>
              </li>
          </ol>
        </div>
      )}

      <div className="relative mt-8">
        <AnimatePresence mode="wait">
          {step === 'customer' && (
            <motion.div
              key="customer"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <CustomerForm onSubmit={handleCustomerSubmit} searchParams={searchParams} />
            </motion.div>
          )}

          {step === 'products' && customerInfo && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <ProductSelector
                customerInfo={customerInfo}
                onSubmit={handleProductsSubmit}
                onBack={() => setStep('customer')}
              />
            </motion.div>
          )}

          {step === 'confirmation' && customerInfo && (
             <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Confirmation 
                  customerInfo={customerInfo}
                  selectedProducts={selectedProducts}
                  totalCost={totalCost}
                  onRestart={handleRestart}
                  onBack={handleBackToProducts}
                />
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
