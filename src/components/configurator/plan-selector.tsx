
'use client';

import { plans } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, ArrowLeft, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';


interface PlanSelectorProps {
    onPlanSelect: (planId: string) => void;
    onBack: () => void;
}

export default function PlanSelector({ onPlanSelect, onBack }: PlanSelectorProps) {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Nuestros Planes Recomendados</h2>
                <p className="text-muted-foreground mt-2 text-lg">Soluciones diseñadas para el éxito, listas para empezar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full"
                    >
                        <Card className={cn(
                            "h-full flex flex-col transition-all duration-300 relative overflow-hidden",
                             plan.isPopular ? "border-primary/80 shadow-lg shadow-primary/20" : "hover:border-primary/50"
                        )}>
                            {plan.isPopular && (
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1.5 text-sm font-semibold rounded-bl-xl flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    Más Popular
                                </div>
                            )}

                            <CardHeader className="text-center pt-10">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription className="h-10">{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-between">
                                <div className='text-center mb-8'>
                                    <span className="text-4xl font-bold">${plan.price}</span>
                                    <span className="text-muted-foreground">/mes</span>
                                </div>
                                <ul className="space-y-3 text-sm">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={() => onPlanSelect(plan.id)}
                                    size="lg"
                                    className={cn(
                                        "w-full",
                                        plan.isPopular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-accent text-accent-foreground hover:bg-accent/90"
                                    )}
                                >
                                    Seleccionar Plan
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

             <div className="mt-12 text-center">
                <Button onClick={onBack} variant="ghost">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
            </div>
        </div>
    );
}
