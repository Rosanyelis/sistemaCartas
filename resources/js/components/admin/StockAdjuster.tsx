import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface StockAdjusterProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    productoId: number;
    currentStock: number;
    productoNombre: string;
}

export function StockAdjuster({
    isOpen,
    onOpenChange,
    productoId,
    currentStock,
    productoNombre,
}: StockAdjusterProps) {
    const [stock, setStock] = useState<number>(currentStock);
    const [isProcessing, setIsProcessing] = useState(false);

    // Sync state when opened
    React.useEffect(() => {
        if (isOpen) {
            setStock(currentStock);
        }
    }, [isOpen, currentStock]);

    const handleIncrement = () => setStock(s => s + 1);
    const handleDecrement = () => setStock(s => Math.max(0, s - 1));

    const handleSave = () => {
        setIsProcessing(true);
        router.patch(`/admin/productos/${productoId}/stock`, {
            stock: stock,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
            },
            onFinish: () => {
                setIsProcessing(false);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#1B3D6D]">
                        Ajustar Stock
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Ajusta el stock actual para: <span className="font-semibold text-gray-800">{productoNombre}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6">
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full text-xl"
                            onClick={handleDecrement}
                            disabled={stock <= 0 || isProcessing}
                        >
                            -
                        </Button>
                        <input
                            type="number"
                            className="w-24 text-center text-3xl font-bold border-none focus:ring-0"
                            value={stock}
                            onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                            min="0"
                            disabled={isProcessing}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full text-xl"
                            onClick={handleIncrement}
                            disabled={isProcessing}
                        >
                            +
                        </Button>
                    </div>
                </div>

                <DialogFooter className="mt-2 flex gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isProcessing}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        className="bg-[#1B3D6D] hover:bg-[#1B3D6D]/90 text-white"
                        onClick={handleSave}
                        disabled={isProcessing || stock === currentStock}
                    >
                        {isProcessing ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
