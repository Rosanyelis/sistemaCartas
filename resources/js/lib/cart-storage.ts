import type { CartLine } from '@/types/cart-line';

const STORAGE_KEY = 'sistemaCartas:cart_v1';
const RESUME_KEY = 'sistemaCartas:cart_resume_v1';
const CART_VERSION = 1 as const;

type CartPayloadV1 = {
    v: typeof CART_VERSION;
    items: CartLine[];
    savedAt: string;
};

function isCartLineArray(value: unknown): value is CartLine[] {
    if (!Array.isArray(value)) {
        return false;
    }
    for (const row of value) {
        if (
            !row ||
            typeof row !== 'object' ||
            typeof (row as CartLine).slug !== 'string' ||
            typeof (row as CartLine).name !== 'string' ||
            typeof (row as CartLine).subtitle !== 'string' ||
            typeof (row as CartLine).price !== 'number' ||
            typeof (row as CartLine).image !== 'string' ||
            typeof (row as CartLine).quantity !== 'number' ||
            typeof (row as CartLine).badge !== 'string'
        ) {
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
            (data as CartPayloadV1).v !== CART_VERSION
        ) {
            return null;
        }
        const items = (data as CartPayloadV1).items;
        if (!isCartLineArray(items)) {
            return null;
        }

        return items;
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
            const payload: CartPayloadV1 = {
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
        const payload: CartPayloadV1 = {
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
