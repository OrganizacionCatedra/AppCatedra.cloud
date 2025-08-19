'use client';

import { useState } from 'react';
import type { CustomerInfo, SelectedProduct } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { processOrder } from '@/app/actions';
import Summary from './summary';

interface ConfirmationProps {
  customerInfo: CustomerInfo;
  selectedProducts: SelectedProduct[];
  totalCost: number;
  onRestart: () => void;
  onBack: () => void;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export default function Confirmation({ customerInfo, selectedProducts, totalCost, onRestart, onBack }: ConfirmationProps) {
    const [status, setStatus] = useState<PaymentStatus>('idle');
    const { toast } = useToast();

    const handlePayment = async () => {
        setStatus('processing');
        try {
            const result = await processOrder({
                customerInfo,
                selectedProducts,
                totalCost,
            });

            if (result.success) {
                setStatus('success');
            } else {
                throw new Error(result.error || 'Ocurrió un error desconocido.');
            }
        } catch (error) {
            setStatus('error');
            const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago.';
            toast({
                title: "Error en el Pedido",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    if (status === 'success') {
        return (
            <Card className="max-w-2xl mx-auto text-center py-8 border-green-500/20 shadow-lg shadow-green-500/5">
                <CardHeader>
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <CardTitle className="mt-4 text-2xl">¡Gracias por su pedido!</CardTitle>
                    <CardDescription>
                        Hemos enviado una confirmación y la factura a {customerInfo.email}. Pronto nos pondremos en contacto.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={onRestart}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Crear una nueva configuración
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader>
                    <CardTitle>Confirmar Pedido</CardTitle>
                    <CardDescription>
                        Revise su selección final. Al hacer clic en "Pagar Ahora", se procesará el cargo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <Summary
                     customerInfo={customerInfo}
                     selectedProducts={selectedProducts}
                     totalCost={totalCost}
                   />

                    {status === 'error' && (
                        <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5"/>
                            <p>Hubo un problema al procesar su pedido. Por favor, intente de nuevo.</p>
                        </div>
                    )}
                   
                   <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4 mt-6">
                       <Button onClick={onBack} variant="outline" disabled={status === 'processing'}>
                           <ArrowLeft className="mr-2 h-4 w-4" />
                           Modificar Pedido
                       </Button>
                       <Button onClick={handlePayment} size="lg" disabled={status === 'processing'} className="bg-accent text-accent-foreground hover:bg-accent/90">
                           {status === 'processing' ? (
                               <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                           ) : null}
                           {status === 'processing' ? 'Procesando...' : 'Pagar Ahora'}
                       </Button>
                   </div>
                </CardContent>
            </Card>
        </div>
    );
}
