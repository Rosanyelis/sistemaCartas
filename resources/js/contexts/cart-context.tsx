import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

export type CartLine = {
    slug: string;
    name: string;
    subtitle: string;
    price: number;
    image: string;
    quantity: number;
    badge: string;
};

type CartContextValue = {
    items: CartLine[];
    itemCount: number;
    isDrawerOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
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
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartLine[]>([]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);

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
    }, []);

    const openCart = useCallback(() => {
        setDrawerOpen(true);
    }, []);

    const closeCart = useCallback(() => {
        setDrawerOpen(false);
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
            openCart,
            closeCart,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
        }),
        [
            items,
            itemCount,
            isDrawerOpen,
            openCart,
            closeCart,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
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
