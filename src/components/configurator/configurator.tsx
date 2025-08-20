'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomerForm from './customer-form';
import ProductSelector from './product-selector';
import Confirmation from './confirmation';
import type { CustomerInfo, SelectedProduct } from '@/lib/types';
import PathSelector from './path-selector';
import PlanSelector from './plan-selector';
import { plans } from '@/lib/plans';
import { productCategories } from '@/lib/products';
import { Rocket } from 'lucide-react';
import AnimatedTitle from './animated-title';

type Step = 'customer' | 'path-selection' | 'products' | 'plans' | 'confirmation';

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
    if (path === 'pre-made') {
      setStep('plans');
    }
  }

  const handleProductsSubmit = (products: SelectedProduct[], total: number) => {
    setSelectedProducts(products);
    setTotalCost(total);
    setStep('confirmation');
  };

  const handlePlanSelect = (planId: string) => {
    const selectedPlan = plans.find(p => p.id === planId);
    if (!selectedPlan) return;

    const productsInPlan: SelectedProduct[] = [];
    
    productCategories.forEach(category => {
      category.products.forEach(product => {
        if (selectedPlan.productIds.includes(product.id)) {
          // Para productos tipo 'select', usamos la opción por defecto o la especificada
          if (product.type === 'select' && product.options) {
             const option = product.options[0]; // O una lógica más compleja si el plan especifica la opción
             productsInPlan.push({
               id: product.id,
               name: product.name,
               price: option.price,
               option,
               category: category.id,
               icon: product.icon,
             });
          } else { // para productos tipo 'switch'
            productsInPlan.push({
              id: product.id,
              name: product.name,
              price: product.price,
              category: category.id,
              icon: product.icon,
            });
          }
        }
      });
    });

    const planTotalCost = selectedPlan.price;

    setSelectedProducts(productsInPlan);
    setTotalCost(planTotalCost);
    setStep('confirmation');
  };
  
  const handleBackToProducts = () => {
    setStep('products');
  }

  const handleBackToPlans = () => {
    setStep('plans');
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

  const getBackActionForConfirmation = () => {
    const lastProduct = selectedProducts[selectedProducts.length - 1];
    if (lastProduct) {
        const plan = plans.find(p => p.productIds.includes(lastProduct.id));
        if (plan && selectedProducts.length > 1) { 
            return handleBackToPlans;
        }
    }
    return handleBackToProducts;
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-3 bg-primary/10 rounded-full mb-4 border border-primary/20 shadow-lg shadow-primary/20">
              <Rocket className="w-10 h-10 text-primary" />
          </div>
        </motion.div>
        
        <AnimatedTitle />

        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="mt-6 text-lg text-muted-foreground sm:text-xl"
        >
          Tu solución de inteligencia artificial, diseñada por ti en minutos.
        </motion.p>
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

          {step === 'plans' && customerInfo && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PlanSelector
                onPlanSelect={handlePlanSelect}
                onBack={handleBackToPathSelection}
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
                  onBack={getBackActionForConfirmation()}
                />
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
