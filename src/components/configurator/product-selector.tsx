'use client';

import { useState, useMemo, useEffect } from 'react';
import { productCategories } from '@/lib/products';
import type { CustomerInfo, SelectedProduct, Product, ProductCategory } from '@/lib/types';
import Summary from './summary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, LayoutGrid, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ProductSelectorProps {
  customerInfo: CustomerInfo;
  onSubmit: (products: SelectedProduct[], total: number) => void;
  onBack: () => void;
}

export default function ProductSelector({ customerInfo, onSubmit, onBack }: ProductSelectorProps) {
  const [selectedProducts, setSelectedProducts] = useState<Record<string, SelectedProduct>>({});
  const [activeCategory, setActiveCategory] = useState<string>(productCategories[0].id);

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
            icon: product.icon,
          };
        }
      });
    });
    setSelectedProducts(initialSelections);
  }, []);

  const handleSwitchChange = (product: Product, category: ProductCategory, checked: boolean) => {
    const newSelected = { ...selectedProducts };
    if (checked) {
      newSelected[product.id] = { id: product.id, name: product.name, price: product.price, category: category.id, icon: product.icon };
    } else {
      delete newSelected[product.id];
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectChange = (product: Product, category: ProductCategory, optionId: string) => {
    const option = product.options?.find(o => o.id === optionId);
    if (option) {
      const newSelected = { ...selectedProducts };
      newSelected[product.id] = { id: product.id, name: product.name, price: option.price, option, category: category.id, icon: product.icon };
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
    return productCategories.find(c => c.id === activeCategory)?.products ?? [];
  }, [activeCategory]);
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2">
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Wand2 className="w-8 h-8 text-primary" />
                    <div>
                    <CardTitle>Diseña tu Plan a Medida</CardTitle>
                    <CardDescription>Selecciona los módulos que necesitas. Los precios se suman a tu plan base.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-6">
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex space-x-2 pb-4">
                        {productCategories.map(category => (
                            <Button
                                key={category.id}
                                variant={activeCategory === category.id ? "default" : "outline"}
                                onClick={() => setActiveCategory(category.id)}
                                className="shrink-0"
                            >
                                <category.icon className="mr-2 h-4 w-4" />
                                {category.name}
                            </Button>
                        ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map((product, index) => {
                        const categoryInfo = productCategories.find(c => c.id === activeCategory);
                        return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <div className="p-4 rounded-xl border border-white/10 bg-white/30 dark:bg-black/30 h-full flex flex-col">
                            <div className="flex-grow">
                                {categoryInfo && (
                                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-primary/20 text-primary mb-3">
                                    <categoryInfo.icon className="w-4 h-4" />
                                    {categoryInfo.name}
                                </div>
                                )}
                                <h3 className="text-lg font-headline font-semibold text-foreground">{product.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1 mb-4 h-10">{product.description}</p>
                            </div>

                            <div className="flex items-center justify-between gap-4 mt-auto pt-4">
                                {product.type === 'switch' && (
                                <>
                                    <span className="font-mono text-lg text-accent">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
                                    </span>
                                    <Switch
                                    id={product.id}
                                    checked={!!selectedProducts[product.id]}
                                    onCheckedChange={(checked) => handleSwitchChange(product, categoryInfo!, checked)}
                                    />
                                </>
                                )}
                                {product.type === 'select' && product.options && (
                                <div className='w-full'>
                                    <Select
                                    onValueChange={(optionId) => handleSelectChange(product, categoryInfo!, optionId)}
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
      <div className="lg:col-span-1 lg:sticky top-20">
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
