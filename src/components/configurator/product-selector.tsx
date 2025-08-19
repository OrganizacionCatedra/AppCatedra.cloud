'use client';

import { useState, useMemo, useEffect } from 'react';
import { productCategories } from '@/lib/products';
import type { CustomerInfo, SelectedProduct, Product, ProductOption } from '@/lib/types';
import Summary from './summary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductSelectorProps {
  customerInfo: CustomerInfo;
  onSubmit: (products: SelectedProduct[], total: number) => void;
  onBack: () => void;
}

export default function ProductSelector({ customerInfo, onSubmit, onBack }: ProductSelectorProps) {
  const [selectedProducts, setSelectedProducts] = useState<Record<string, SelectedProduct>>({});

  useEffect(() => {
    // Pre-select default options for 'select' type products
    const initialSelections: Record<string, SelectedProduct> = {};
    productCategories.forEach(category => {
      category.products.forEach(product => {
        if (product.type === 'select' && product.options && product.options.length > 0) {
          const defaultOption = product.options[0];
          initialSelections[product.id] = { 
            id: product.id, 
            name: product.name, 
            price: defaultOption.price, 
            option: defaultOption 
          };
        }
      });
    });
    setSelectedProducts(initialSelections);
  }, []);

  const handleSwitchChange = (product: Product, checked: boolean) => {
    const newSelected = { ...selectedProducts };
    if (checked) {
      newSelected[product.id] = { id: product.id, name: product.name, price: product.price };
    } else {
      delete newSelected[product.id];
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectChange = (product: Product, optionId: string) => {
    const option = product.options?.find(o => o.id === optionId);
    if (option) {
      const newSelected = { ...selectedProducts };
      newSelected[product.id] = { id: product.id, name: product.name, price: option.price, option };
      setSelectedProducts(newSelected);
    }
  };

  const totalCost = useMemo(() => {
    return Object.values(selectedProducts).reduce((total, product) => total + product.price, 0);
  }, [selectedProducts]);

  const handleSubmit = () => {
    onSubmit(Object.values(selectedProducts), totalCost);
  };
  
  const selectedProductArray = useMemo(() => Object.values(selectedProducts), [selectedProducts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-8">
        {productCategories.map((category, catIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
          >
            <Card className="overflow-hidden backdrop-blur-sm bg-card/80">
              <CardHeader className="bg-primary/5">
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                {category.products.map(product => (
                  <div key={product.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border border-primary/10 hover:border-primary/50 transition-colors bg-background/50">
                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                      <product.icon className="w-8 h-8 text-primary mt-1 shrink-0" />
                      <div>
                        <Label htmlFor={product.id} className="text-lg font-medium cursor-pointer">{product.name}</Label>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 justify-end">
                      {product.type === 'switch' && (
                         <Switch
                            id={product.id}
                            checked={!!selectedProducts[product.id]}
                            onCheckedChange={(checked) => handleSwitchChange(product, checked)}
                          />
                      )}
                       {product.type === 'select' && product.options && (
                         <Select
                           onValueChange={(optionId) => handleSelectChange(product, optionId)}
                           value={selectedProducts[product.id]?.option?.id}
                         >
                           <SelectTrigger className="w-full sm:w-[200px] bg-background">
                             <SelectValue placeholder="Seleccione una opción" />
                           </SelectTrigger>
                           <SelectContent>
                             {product.options.map(option => (
                               <SelectItem key={option.id} value={option.id}>
                                 {option.label} ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(option.price)})
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="lg:sticky top-20">
        <Summary
          customerInfo={customerInfo}
          selectedProducts={selectedProductArray}
          totalCost={totalCost}
        >
          <div className="flex flex-col gap-4 mt-6 w-full">
             <Button onClick={handleSubmit} size="lg" disabled={totalCost === 0} className="bg-accent text-accent-foreground hover:bg-accent/90">
               <ShoppingCart className="mr-2 h-5 w-5" />
               Proceder a Confirmación
             </Button>
             <Button onClick={onBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
             </Button>
          </div>
        </Summary>
      </div>
    </div>
  );
}
