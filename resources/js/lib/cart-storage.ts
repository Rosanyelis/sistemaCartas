import { normalizeCartItemsHomogeneous } from '@/lib/cart-mode';
import { HISTORIA_SUSCRIPCION_SUBTITLE, type CartLine } from '@/types/cart-line';

const STORAGE_KEY = 'sistemaCartas:cart_v2';
const RESUME_KEY = 'sistemaCartas:cart_resume_v1';
const CART_VERSION = 2 as const;

type CartPayloadV2 = {
    v: typeof CART_VERSION;
    items: CartLine[];
    savedAt: string;
};

function isProductLike(row: Record<string, unknown>): row is Record<string, unknown> & {
    slug: string;
    name: string;
    subtitle: string;
    price: number;
    image: string;
    quantity: number;
    badge: string;
} {
    return (
        typeof row.slug === 'string' &&
        typeof row.name === 'string' &&
        typeof row.subtitle === 'string' &&
        typeof row.price === 'number' &&
        typeof row.image === 'string' &&
        typeof row.quantity === 'number' &&
        typeof row.badge === 'string'
    );
}

function normalizeCartLine(row: unknown): CartLine | null {
    if (!row || typeof row !== 'object') {
        return null;
    }
    const r = row as Record<string, unknown>;
    const kind = r.kind;

    if (kind === 'historia_suscripcion') {
        if (!isProductLike(r)) {
            return null;
        }
        if (typeof r.duracion_meses !== 'number') {
            return null;
        }

        return {
            kind: 'historia_suscripcion',
            slug: r.slug,
            name: r.name,
            subtitle: HISTORIA_SUSCRIPCION_SUBTITLE,
            price: r.price,
            image: r.image,
            quantity: 1,
            badge: r.badge,
            duracion_meses: Math.max(1, Math.min(120, Math.floor(r.duracion_meses))),
        };
    }

    if (kind === 'product' || kind === undefined) {
        if (!isProductLike(r)) {
            return null;
        }

        return {
            kind: 'product',
            slug: r.slug,
            name: r.name,
            subtitle: r.subtitle,
            price: r.price,
            image: r.image,
            quantity: r.quantity,
            badge: r.badge,
        };
    }

    return null;
}

function isCartLineArray(value: unknown): value is CartLine[] {
    if (!Array.isArray(value)) {
        return false;
    }
    for (const row of value) {
        if (normalizeCartLine(row) === null) {
            return false;
        }
    }

    return true;
}

export function loadCartFromStorage(): CartLine[] | null {
    if (typeof window === 'undefined' || !window.sessionStorage) {
        return null;
    }
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return null;
    }
    try {
        const data = JSON.parse(raw) as unknown;
        if (
            !data ||
            typeof data !== 'object' ||
            (data as CartPayloadV2).v !== CART_VERSION
        ) {
            return null;
        }
        const items = (data as CartPayloadV2).items;
        if (!isCartLineArray(items)) {
            return null;
        }

        return normalizeCartItemsHomogeneous(items);
    } catch {
        return null;
    }
}

let saveDebounce: ReturnType<typeof setTimeout> | null = null;
const SAVE_DEBOUNCE_MS = 300;

export function saveCartToStorage(items: CartLine[]): void {
    if (typeof window === 'undefined' || !window.sessionStorage) {
        return;
    }
    if (saveDebounce !== null) {
        clearTimeout(saveDebounce);
    }
    saveDebounce = setTimeout(() => {
        saveDebounce = null;
        if (items.length === 0) {
            window.sessionStorage.removeItem(STORAGE_KEY);
        } else {
            const payload: CartPayloadV2 = {
                v: CART_VERSION,
                items,
                savedAt: new Date().toISOString(),
            };
            window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        }
    }, SAVE_DEBOUNCE_MS);
}

export function flushSaveCartToStorage(items: CartLine[]): void {
    if (typeof window === 'undefined' || !window.sessionStorage) {
        return;
    }
    if (saveDebounce !== null) {
        clearTimeout(saveDebounce);
        saveDebounce = null;
    }
    if (items.length === 0) {
        window.sessionStorage.removeItem(STORAGE_KEY);
    } else {
        const payload: CartPayloadV2 = {
            v: CART_VERSION,
            items,
            savedAt: new Date().toISOString(),
        };
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
}

export function clearCartStorage(): void {
    if (typeof window === 'undefined' || !window.sessionStorage) {
        return;
    }
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(RESUME_KEY);
}

/**
 * Tras volver de login, abrir cajón en checkout. La URL (openCart) es la principal;
 * esto queda por si se reutiliza en otro flujo.
 */
export function setResumeCheckoutIntent(openCheckout: boolean): void {
    if (typeof window === 'undefined' || !window.sessionStorage) {
        return;
    }
    if (!openCheckout) {
        window.sessionStorage.removeItem(RESUME_KEY);

        return;
    }
    window.sessionStorage.setItem(
        RESUME_KEY,
        JSON.stringify({ resumeCheckout: true, at: new Date().toISOString() }),
    );
}

export { STORAGE_KEY, RESUME_KEY, CART_VERSION };
