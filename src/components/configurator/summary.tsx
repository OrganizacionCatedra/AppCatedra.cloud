import type { CustomerInfo, SelectedProduct } from '@/lib/types';
import { productCategories } from '@/lib/products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SummaryProps {
  customerInfo: CustomerInfo;
  selectedProducts: SelectedProduct[];
  totalCost: number;
  children?: React.ReactNode;
}

export default function Summary({ customerInfo, selectedProducts, totalCost, children }: SummaryProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const getCategoryById = (id: string) => productCategories.find(c => c.id === id);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
                <CardDescription>Para: {customerInfo.name} ({customerInfo.company})</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                  {selectedProducts.length > 0 ? (
                      <div className="space-y-4">
                          {selectedProducts.map(product => {
                              const category = getCategoryById(product.category);
                              return (
                                <div key={product.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                      {category && <category.icon className="w-4 h-4 text-muted-foreground" />}
                                      <div>
                                          <p className="font-medium">{product.name}</p>
                                          {product.option && (
                                              <p className="text-xs text-muted-foreground">{product.option.label}</p>
                                          )}
                                      </div>
                                    </div>
                                    <p className="font-mono">{formatCurrency(product.price)}</p>
                                </div>
                              )
                          })}
                      </div>
                  ) : (
                      <div className="text-center text-muted-foreground flex items-center justify-center h-full">
                          <p>Seleccione productos para ver el resumen aquí.</p>
                      </div>
                  )}
                </ScrollArea>
                <Separator className="my-4" />
                <div className="flex justify-between items-center text-lg font-bold">
                    <p>Total</p>
                    <p className="font-mono text-primary">{formatCurrency(totalCost)}</p>
                </div>
            </CardContent>
            {children && <CardFooter className="flex-col !items-stretch">{children}</CardFooter>}
        </Card>
    );
}
