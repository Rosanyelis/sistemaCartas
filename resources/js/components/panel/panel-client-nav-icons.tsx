import type { LucideProps } from 'lucide-react';
import { Plus, ShoppingCart } from 'lucide-react';

/** Carrito con signo + en el interior (menú cliente — Órdenes). */
export function ShoppingCartPlusIcon({
    className,
    strokeWidth = 1.75,
}: LucideProps) {
    return (
        <span
            className={`relative inline-flex size-[1em] shrink-0 items-center justify-center ${className ?? ''}`}
            aria-hidden
        >
            <ShoppingCart className="size-full" strokeWidth={strokeWidth} />
            <Plus
                className="absolute bottom-[10%] left-1/2 size-[46%] -translate-x-1/2"
                strokeWidth={2.5}
            />
        </span>
    );
}
