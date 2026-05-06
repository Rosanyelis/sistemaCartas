import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import {
    clearCartStorage,
    loadCartFromStorage,
    saveCartToStorage,
} from '@/lib/cart-storage';
import {
    getDerivedCartMode,
    normalizeCartItemsHomogeneous,
} from '@/lib/cart-mode';
import {
    cartLineKey,
    type CartLine,
    type CartLineProduct,
} from '@/types/cart-line';

export type { CartLine } from '@/types/cart-line';

export type CartAddOptions = {
    /** Si el carrito tiene el otro tipo de líneas, vaciarlas y continuar */
    replaceOtherKind?: boolean;
};

type OpenCartOptions = {
    view?: 'cart' | 'checkout';
};

type CartContextValue = {
    items: CartLine[];
    /** Derivado de `items` (opción A): productos | suscripciones | vacío */
    derivedCartMode: 'products' | 'subscriptions' | null;
    itemCount: number;
    isDrawerOpen: boolean;
    openCart: (options?: OpenCartOptions) => void;
    closeCart: () => void;
    /** Vista preferida al abrir (p. ej. ?checkout=1 tras auth); se consume una vez. */
    pendingDrawerView: 'cart' | 'checkout' | null;
    addItem: (
        input: {
            slug: string;
            name: string;
            subtitle: string;
            price: number;
            image: string;
            quantity?: number;
            badge?: string;
        },
        options?: CartAddOptions,
    ) => boolean;
    addHistoriaSuscripcion: (
        input: {
            slug: string;
            name: string;
            subtitle: string;
            price: number;
            image: string;
            duracion_meses: number;
            badge?: string;
        },
        options?: CartAddOptions,
    ) => boolean;
    updateQuantity: (lineKey: string, delta: number) => void;
    removeItem: (lineKey: string) => void;
    clearCart: () => void;
    clearProductLines: () => void;
    clearHistoriaSubscriptionLines: () => void;
    consumePendingDrawerView: () => 'cart' | 'checkout' | null;
    clearPendingDrawerView: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartLine[]>([]);
    const itemsRef = useRef<CartLine[]>([]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [pendingDrawerView, setPendingDrawerView] = useState<
        'cart' | 'checkout' | null
    >(null);
    const [restored, setRestored] = useState(false);

    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    useEffect(() => {
        const loaded = loadCartFromStorage();
        const id = requestAnimationFrame(() => {
            if (loaded !== null && loaded.length > 0) {
                setItems(loaded);
            }

            setRestored(true);
        });

        return () => cancelAnimationFrame(id);
    }, []);

    useLayoutEffect(() => {
        if (!restored) {
            return;
        }

        saveCartToStorage(items);
    }, [items, restored]);

    const addItem = useCallback(
        (
            input: {
                slug: string;
                name: string;
                subtitle: string;
                price: number;
                image: string;
                quantity?: number;
                badge?: string;
            },
            options?: CartAddOptions,
        ): boolean => {
            const qty = input.quantity ?? 1;
            let prev = itemsRef.current;
            if (
                prev.some((l) => l.kind === 'product') &&
                prev.some((l) => l.kind === 'historia_suscripcion')
            ) {
                prev = normalizeCartItemsHomogeneous(prev);
            }

            const mode = getDerivedCartMode(prev);
            if (mode === 'subscriptions') {
                if (!options?.replaceOtherKind) {
                    return false;
                }
                prev = prev.filter((l) => l.kind !== 'historia_suscripcion');
            }

            const found = prev.find(
                (l): l is CartLineProduct =>
                    l.kind === 'product' && l.slug === input.slug,
            );

            let next: CartLine[];
            if (found) {
                next = prev.map((l) =>
                    l.kind === 'product' && l.slug === input.slug
                        ? {
                              ...l,
                              quantity: Math.min(99, l.quantity + qty),
                          }
                        : l,
                );
            } else {
                const row: CartLineProduct = {
                    kind: 'product',
                    slug: input.slug,
                    name: input.name,
                    subtitle: input.subtitle,
                    price: input.price,
                    image: input.image,
                    quantity: qty,
                    badge: input.badge ?? 'Pago Único',
                };
                next = [...prev, row];
            }

            setItems(next);

            return true;
        },
        [],
    );

    const addHistoriaSuscripcion = useCallback(
        (
            input: {
                slug: string;
                name: string;
                subtitle: string;
                price: number;
                image: string;
                duracion_meses: number;
                badge?: string;
            },
            options?: CartAddOptions,
        ): boolean => {
            let prev = itemsRef.current;
            if (
                prev.some((l) => l.kind === 'product') &&
                prev.some((l) => l.kind === 'historia_suscripcion')
            ) {
                prev = normalizeCartItemsHomogeneous(prev);
            }

            const mode = getDerivedCartMode(prev);
            if (mode === 'products') {
                if (!options?.replaceOtherKind) {
                    return false;
                }
                prev = prev.filter((l) => l.kind !== 'product');
            }

            const filtered = prev.filter(
                (l) =>
                    !(
                        l.kind === 'historia_suscripcion' &&
                        l.slug === input.slug
                    ),
            );
            const row = {
                kind: 'historia_suscripcion' as const,
                slug: input.slug,
                name: input.name,
                subtitle: input.subtitle,
                price: input.price,
                image: input.image,
                quantity: 1 as const,
                badge: input.badge ?? 'Suscripción PayPal',
                duracion_meses: Math.max(
                    1,
                    Math.min(120, Math.floor(input.duracion_meses)),
                ),
            };

            setItems([...filtered, row]);

            return true;
        },
        [],
    );

    const updateQuantity = useCallback((lineKey: string, delta: number) => {
        setItems((prev) =>
            prev.map((l) => {
                if (cartLineKey(l) !== lineKey) {
                    return l;
                }

                if (l.kind === 'historia_suscripcion') {
                    return l;
                }

                const next = Math.max(1, Math.min(99, l.quantity + delta));

                return { ...l, quantity: next };
            }),
        );
    }, []);

    const removeItem = useCallback((lineKey: string) => {
        setItems((prev) => prev.filter((l) => cartLineKey(l) !== lineKey));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        clearCartStorage();
    }, []);

    const clearProductLines = useCallback(() => {
        setItems((prev) => prev.filter((l) => l.kind !== 'product'));
    }, []);

    const clearHistoriaSubscriptionLines = useCallback(() => {
        setItems((prev) =>
            prev.filter((l) => l.kind !== 'historia_suscripcion'),
        );
    }, []);

    const openCart = useCallback((options?: OpenCartOptions) => {
        if (options?.view) {
            setPendingDrawerView(options.view);
        }

        setDrawerOpen(true);
    }, []);

    const closeCart = useCallback(() => {
        setDrawerOpen(false);
    }, []);

    const consumePendingDrawerView = useCallback((): 'cart' | 'checkout' | null => {
        const v = pendingDrawerView;

        if (v !== null) {
            setPendingDrawerView(null);
        }

        return v;
    }, [pendingDrawerView]);

    const clearPendingDrawerView = useCallback(() => {
        setPendingDrawerView(null);
    }, []);

    const derivedCartMode = useMemo(
        () => getDerivedCartMode(items),
        [items],
    );

    const itemCount = useMemo(
        () => items.reduce((n, l) => n + l.quantity, 0),
        [items],
    );

    const value = useMemo(
        () => ({
            items,
            derivedCartMode,
            itemCount,
            isDrawerOpen,
            pendingDrawerView,
            openCart,
            closeCart,
            addItem,
            addHistoriaSuscripcion,
            updateQuantity,
            removeItem,
            clearCart,
            clearProductLines,
            clearHistoriaSubscriptionLines,
            consumePendingDrawerView,
            clearPendingDrawerView,
        }),
        [
            items,
            derivedCartMode,
            itemCount,
            isDrawerOpen,
            pendingDrawerView,
            openCart,
            closeCart,
            addItem,
            addHistoriaSuscripcion,
            updateQuantity,
            removeItem,
            clearCart,
            clearProductLines,
            clearHistoriaSubscriptionLines,
            consumePendingDrawerView,
            clearPendingDrawerView,
        ],
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);

    if (!ctx) {
        throw new Error('useCart debe usarse dentro de CartProvider');
    }

    return ctx;
}
