import type { LucideProps } from 'lucide-react';
import { Plus, ShoppingCart } from 'lucide-react';

/** Carrito outline con + dentro del cesto (menú cliente — Órdenes). */
export function ShoppingCartPlusIcon({
    className,
    strokeWidth = 1.75,
}: LucideProps) {
    return (
        <span
            className={`relative inline-flex size-[1em] shrink-0 items-center justify-center text-current ${className ?? ''}`}
            aria-hidden
        >
            <ShoppingCart className="size-full" strokeWidth={strokeWidth} />
            <Plus
                className="absolute top-[54%] left-1/2 size-[38%] -translate-x-1/2 -translate-y-1/2"
                strokeWidth={strokeWidth}
            />
        </span>
    );
}
