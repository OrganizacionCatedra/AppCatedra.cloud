'use client';

import { useState, useMemo, useEffect } from 'react';
import { productCategories } from '@/lib/products';
import type { CustomerInfo, SelectedProduct, Product, ProductCategory } from '@/lib/types';
import Summary from './summary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';


interface ProductSelectorProps {
  customerInfo: CustomerInfo;
  onSubmit: (products: SelectedProduct[], total: number) => void;
  onBack: () => void;
}

export default function ProductSelector({ customerInfo, onSubmit, onBack }: ProductSelectorProps) {
  const [selectedProducts, setSelectedProducts] = useState<Record<string, SelectedProduct>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const initialSelections: Record<string, SelectedProduct> = {};
    productCategories.forEach(category => {
      category.products.forEach(product => {
        if (product.type === 'select' && product.options && product.options.length > 0) {
          const defaultOption = product.options[0];
          initialSelections[product.id] = { 
            id: product.id, 
            name: product.name, 
            price: defaultOption.price, 
            option: defaultOption,
            category: category.id,
          };
        }
      });
    });
    setSelectedProducts(initialSelections);
  }, []);

  const handleSwitchChange = (product: Product, category: ProductCategory, checked: boolean) => {
    const newSelected = { ...selectedProducts };
    if (checked) {
      newSelected[product.id] = { id: product.id, name: product.name, price: product.price, category: category.id };
    } else {
      delete newSelected[product.id];
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectChange = (product: Product, category: ProductCategory, optionId: string) => {
    const option = product.options?.find(o => o.id === optionId);
    if (option) {
      const newSelected = { ...selectedProducts };
      newSelected[product.id] = { id: product.id, name: product.name, price: option.price, option, category: category.id };
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
  
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') {
      return productCategories.flatMap(category => 
        category.products.map(product => ({ ...product, category }))
      );
    }
    return productCategories
      .find(c => c.id === activeCategory)?.products
      .map(product => ({ ...product, category: productCategories.find(c => c.id === activeCategory)! })) ?? [];
  }, [activeCategory]);
  
  const getCategoryById = (id: string) => productCategories.find(c => c.id === id);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-primary" />
              <div>
                <CardTitle>Catálogo de Productos</CardTitle>
                <CardDescription>Selecciona los módulos que necesitas. Los precios se suman a tu plan base.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-1.5 rounded-full bg-black/30 flex items-center gap-2 mb-6">
              <Button
                size="sm"
                onClick={() => setActiveCategory('all')}
                className={cn(
                  "rounded-full flex-1 justify-center text-foreground font-medium transition-all duration-300",
                  activeCategory === 'all' ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md' : 'bg-transparent hover:bg-white/10'
                )}
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Todos
              </Button>
              {productCategories.map(category => (
                <Button
                  key={category.id}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "rounded-full flex-1 justify-center text-foreground font-medium transition-all duration-300",
                    activeCategory === category.id ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md' : 'bg-transparent hover:bg-white/10'
                  )}
                >
                  <category.icon className="mr-2 h-4 w-4" />
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product, index) => {
                const categoryInfo = getCategoryById(product.category.id);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="p-4 rounded-xl border border-primary/20 bg-black/30 h-full flex flex-col justify-between">
                      <div>
                        {categoryInfo && (
                           <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-primary/20 text-primary mb-3">
                              <categoryInfo.icon className="w-4 h-4"/>
                              {categoryInfo.name}
                           </div>
                        )}
                        <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-4 h-10">{product.description}</p>
                      </div>

                      <div className="flex items-center justify-between gap-4 mt-4">
                        {product.type === 'switch' && (
                           <>
                            <span className="font-mono text-lg text-accent">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
                            </span>
                            <Switch
                                id={product.id}
                                checked={!!selectedProducts[product.id]}
                                onCheckedChange={(checked) => handleSwitchChange(product, product.category, checked)}
                            />
                           </>
                        )}
                        {product.type === 'select' && product.options && (
                          <div className='w-full'>
                            <Select
                                onValueChange={(optionId) => handleSelectChange(product, product.category, optionId)}
                                value={selectedProducts[product.id]?.option?.id || product.options[0].id}
                            >
                                <SelectTrigger className="w-full bg-background border-white/20">
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
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:sticky top-20">
        <Summary
          customerInfo={customerInfo}
          selectedProducts={selectedProductArray}
          totalCost={totalCost}
        >
          <div className="flex flex-col gap-4 mt-6 w-full">
             <Button onClick={handleSubmit} size="lg" disabled={totalCost === 0} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
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
