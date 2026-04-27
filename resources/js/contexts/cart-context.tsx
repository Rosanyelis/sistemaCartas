import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import {
    clearCartStorage,
    loadCartFromStorage,
    saveCartToStorage,
} from '@/lib/cart-storage';
import type { CartLine } from '@/types/cart-line';

export type { CartLine } from '@/types/cart-line';

type OpenCartOptions = {
    view?: 'cart' | 'checkout';
};

type CartContextValue = {
    items: CartLine[];
    itemCount: number;
    isDrawerOpen: boolean;
    openCart: (options?: OpenCartOptions) => void;
    closeCart: () => void;
    /** Vista preferida al abrir (p. ej. ?checkout=1 tras auth); se consume una vez. */
    pendingDrawerView: 'cart' | 'checkout' | null;
    addItem: (input: {
        slug: string;
        name: string;
        subtitle: string;
        price: number;
        image: string;
        quantity?: number;
        badge?: string;
    }) => void;
    updateQuantity: (slug: string, delta: number) => void;
    removeItem: (slug: string) => void;
    clearCart: () => void;
    consumePendingDrawerView: () => 'cart' | 'checkout' | null;
    clearPendingDrawerView: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartLine[]>([]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [pendingDrawerView, setPendingDrawerView] = useState<
        'cart' | 'checkout' | null
    >(null);
    const [restored, setRestored] = useState(false);

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
        (input: {
            slug: string;
            name: string;
            subtitle: string;
            price: number;
            image: string;
            quantity?: number;
            badge?: string;
        }) => {
            const qty = input.quantity ?? 1;
            setItems((prev) => {
                const found = prev.find((l) => l.slug === input.slug);

                if (found) {
                    return prev.map((l) =>
                        l.slug === input.slug
                            ? {
                                  ...l,
                                  quantity: Math.min(99, l.quantity + qty),
                              }
                            : l,
                    );
                }

                return [
                    ...prev,
                    {
                        slug: input.slug,
                        name: input.name,
                        subtitle: input.subtitle,
                        price: input.price,
                        image: input.image,
                        quantity: qty,
                        badge: input.badge ?? 'Pago Único',
                    },
                ];
            });
        },
        [],
    );

    const updateQuantity = useCallback((slug: string, delta: number) => {
        setItems((prev) =>
            prev.map((l) => {
                if (l.slug !== slug) {
                    return l;
                }

                const next = Math.max(1, Math.min(99, l.quantity + delta));

                return { ...l, quantity: next };
            }),
        );
    }, []);

    const removeItem = useCallback((slug: string) => {
        setItems((prev) => prev.filter((l) => l.slug !== slug));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        clearCartStorage();
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

    const itemCount = useMemo(
        () => items.reduce((n, l) => n + l.quantity, 0),
        [items],
    );

    const value = useMemo(
        () => ({
            items,
            itemCount,
            isDrawerOpen,
            pendingDrawerView,
            openCart,
            closeCart,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
            consumePendingDrawerView,
            clearPendingDrawerView,
        }),
        [
            items,
            itemCount,
            isDrawerOpen,
            pendingDrawerView,
            openCart,
            closeCart,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
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
