'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomerForm from './customer-form';
import ProductSelector from './product-selector';
import Confirmation from './confirmation';
import type { CustomerInfo, SelectedProduct } from '@/lib/types';
import PathSelector from './path-selector';

type Step = 'customer' | 'path-selection' | 'products' | 'confirmation';

export default function Configurator({
  searchParams,
}: {
  searchParams?: { [key:string]: string | string[] | undefined };
}) {
  const [step, setStep] = useState<Step>('customer');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  const handleCustomerSubmit = (data: CustomerInfo) => {
    setCustomerInfo(data);
    setStep('path-selection');
  };
  
  const handlePathSelect = (path: 'pre-made' | 'custom') => {
    if (path === 'custom') {
      setStep('products');
    }
    // TODO: Implementar la ruta 'pre-made'
  }

  const handleProductsSubmit = (products: SelectedProduct[], total: number) => {
    setSelectedProducts(products);
    setTotalCost(total);
    setStep('confirmation');
  };
  
  const handleBackToProducts = () => {
    setStep('products');
  }
  
  const handleBackToPathSelection = () => {
    setStep('path-selection');
  }

  const handleRestart = () => {
    setCustomerInfo(null);
    setSelectedProducts([]);
    setTotalCost(0);
    setStep('customer');
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
          Configura tu Solución a Medida
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          Personaliza tu plan de IA ideal en minutos.
        </p>
      </header>
      
      <div className="relative mt-4">
        <AnimatePresence mode="wait">
          {step === 'customer' && (
            <motion.div
              key="customer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CustomerForm onSubmit={handleCustomerSubmit} searchParams={searchParams} />
            </motion.div>
          )}
          
          {step === 'path-selection' && customerInfo && (
            <motion.div
              key="path-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PathSelector 
                customerInfo={customerInfo}
                onPathSelect={handlePathSelect}
                onBack={() => setStep('customer')}
              />
            </motion.div>
          )}

          {step === 'products' && customerInfo && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductSelector
                customerInfo={customerInfo}
                onSubmit={handleProductsSubmit}
                onBack={handleBackToPathSelection}
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
