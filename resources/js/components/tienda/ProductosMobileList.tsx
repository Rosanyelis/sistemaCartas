import ProductoGridCard from '@/components/tienda/ProductoGridCard';
import type { Product } from '@/types/welcome';

const MOBILE_VISIBLE_LIMIT = 6;

export type ProductosMobileListProps = {
    products: Product[];
    onAddToCart: (product: Product) => void;
};

export default function ProductosMobileList({
    products,
    onAddToCart,
}: ProductosMobileListProps) {
    const mobileProducts = products.slice(0, MOBILE_VISIBLE_LIMIT);

    return (
        <div className="flex w-full flex-col gap-8">
            {mobileProducts.map((product) => (
                <ProductoGridCard
                    key={product.slug}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}
