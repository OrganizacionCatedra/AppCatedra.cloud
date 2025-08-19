'use client';

import { ArrowLeft, ArrowRight, CalendarPlus, PackageSearch, Wand2 } from "lucide-react";
import type { CustomerInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface PathSelectorProps {
    customerInfo: CustomerInfo;
    onPathSelect: (path: 'pre-made' | 'custom' | 'call') => void;
    onBack: () => void;
}

const pathOptions = [
    {
        id: 'pre-made',
        icon: PackageSearch,
        title: 'Ver Planes',
        description: 'Explora nuestros paquetes pre-diseñados y encuentra la solución perfecta para empezar.',
    },
    {
        id: 'custom',
        icon: Wand2,
        title: 'Diseña tu Plan',
        description: 'Selecciona módulos específicos y crea una solución completamente a tu medida.',
    },
    {
        id: 'call',
        icon: CalendarPlus,
        title: 'Agenda una Cita',
        description: 'Habla con nuestro equipo para personalizar tu experiencia y resolver tus dudas.',
    }
] as const;

export default function PathSelector({ customerInfo, onPathSelect, onBack }: PathSelectorProps) {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">¡Hola, {customerInfo.name.split(' ')[0]}!</h2>
                <p className="text-muted-foreground mt-2 text-lg">¿Cómo te gustaría continuar?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pathOptions.map((option, index) => (
                    <motion.div
                        key={option.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full"
                    >
                        <Card 
                          className="h-full flex flex-col hover:border-primary/80 hover:shadow-primary/20 transition-all duration-300 cursor-pointer group"
                          onClick={() => onPathSelect(option.id)}
                        >
                            <CardHeader className="items-center text-center">
                                <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                                    <option.icon className="w-10 h-10 text-primary" />
                                </div>
                                <CardTitle>{option.title}</CardTitle>
                                <CardDescription>{option.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto flex justify-center">
                               <div className="flex items-center text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-300">
                                   Elegir esta opción <ArrowRight className="w-4 h-4 ml-2" />
                               </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Button onClick={onBack} variant="ghost">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver y editar mis datos
                </Button>
            </div>
        </div>
    );
}
