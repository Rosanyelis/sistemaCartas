import type { CartLine } from '@/types/cart-line';

/**
 * Modo del carrito derivado únicamente del contenido (opción A del plan).
 * No persistir un campo `cartMode` aparte.
 */
export function getDerivedCartMode(
    items: CartLine[],
): 'products' | 'subscriptions' | null {
    if (items.length === 0) {
        return null;
    }

    return items[0].kind === 'product' ? 'products' : 'subscriptions';
}

/**
 * Si por legado o bug hubiera líneas mixtas, conservar solo el tipo de la primera línea.
 */
export function normalizeCartItemsHomogeneous(items: CartLine[]): CartLine[] {
    if (items.length === 0) {
        return [];
    }

    const keepKind = items[0].kind;

    return items.filter((l) => l.kind === keepKind);
}
