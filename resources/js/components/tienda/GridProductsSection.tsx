import { useCallback, useRef, useState } from 'react';
import CartConflictModal from '@/components/tienda/CartConflictModal';
import CatalogGridPagination from '@/components/tienda/CatalogGridPagination';
import ProductoGridCard from '@/components/tienda/ProductoGridCard';
import ProductosMobileList from '@/components/tienda/ProductosMobileList';
import { useCart } from '@/contexts/cart-context';
import type { ProductosPaginator } from '@/types/producto-tienda';
import type { Product } from '@/types/welcome';

const PRODUCTOS_INERTIA_ONLY = ['products', 'categorias', 'filters'] as const;

interface GridProductsSectionProps {
    products: ProductosPaginator;
}

type PendingCartProduct = {
    slug: string;
    name: string;
    subtitle: string;
    price: number;
    image: string;
    badge: string;
};

export default function GridProductsSection({
    products,
}: GridProductsSectionProps) {
    const { addItem, openCart } = useCart();
    const items = products.data ?? [];
    const [cartConflictOpen, setCartConflictOpen] = useState(false);
    const pendingGridProductRef = useRef<PendingCartProduct | null>(null);

    const handleAddToCart = useCallback(
        (product: Product) => {
            const payload: PendingCartProduct = {
                slug: product.slug,
                name: product.name,
                subtitle: product.desc,
                price: product.unit_price,
                image: product.img,
                badge: 'Pago Único',
            };
            const ok = addItem(payload);
            if (!ok) {
                pendingGridProductRef.current = payload;
                setCartConflictOpen(true);

                return;
            }
            openCart();
        },
        [addItem, openCart],
    );

    return (
        <section className="flex w-full flex-col items-center justify-center bg-white px-6 py-20 lg:px-[72px] lg:pt-[70px] lg:pb-[100px]">
            <div className="flex w-full max-w-[1296px] flex-col items-center gap-[44px]">
                {items.length === 0 ? (
                    <p className="font-['Inter',sans-serif] text-[16px] text-[#7B7B7B]">
                        No hay productos en esta categoría por ahora.
                    </p>
                ) : (
                    <>
                        <div className="w-full lg:hidden">
                            <ProductosMobileList
                                products={items}
                                onAddToCart={handleAddToCart}
                            />
                        </div>

                        <div className="hidden w-full gap-8 lg:grid lg:grid-cols-4">
                            {items.map((product) => (
                                <ProductoGridCard
                                    key={product.slug}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    </>
                )}

                <CatalogGridPagination
                    pagination={products}
                    inertiaOnly={[...PRODUCTOS_INERTIA_ONLY]}
                    ariaLabel="Paginación de productos"
                />
            </div>
            <CartConflictModal
                open={cartConflictOpen}
                title="Tu carrito tiene suscripciones"
                description="No es posible combinar productos y suscripciones en el mismo carrito. Si continúas, se vaciarán las suscripciones y se añadirá este producto."
                confirmLabel="Vaciar suscripciones y añadir producto"
                onCancel={() => {
                    setCartConflictOpen(false);
                    pendingGridProductRef.current = null;
                }}
                onConfirm={() => {
                    const payload = pendingGridProductRef.current;
                    if (payload) {
                        addItem(payload, { replaceOtherKind: true });
                    }
                    pendingGridProductRef.current = null;
                    setCartConflictOpen(false);
                    openCart();
                }}
            />
        </section>
    );
}
