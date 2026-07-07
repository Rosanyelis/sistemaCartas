import { Link } from '@inertiajs/react';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import { show } from '@/routes/productos';
import type { Product } from '@/types/welcome';

interface ProductsSectionProps {
    title?: string;
    products: Product[];
}

const LG_MEDIA_QUERY = '(min-width: 1024px)';

function subscribeLg(callback: () => void): () => void {
    if (typeof window === 'undefined') {
        return () => {};
    }

    const mql = window.matchMedia(LG_MEDIA_QUERY);
    mql.addEventListener('change', callback);

    return () => mql.removeEventListener('change', callback);
}

function getLgSnapshot(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia(LG_MEDIA_QUERY).matches;
}

function useIsLgViewport(): boolean {
    return useSyncExternalStore(subscribeLg, getLgSnapshot, () => false);
}

function ProductsSectionHeader({ title }: { title: string }) {
    return (
        <div className="flex w-full max-w-[1296px] flex-col items-center gap-4 px-3 lg:gap-4 lg:px-[72px]">
            <h2 className="text-center font-['Playfair_Display',serif] text-[40px] font-semibold text-[#1B3D6D] lg:text-[49px] lg:leading-[65px]">
                {title}
            </h2>
            <div className="h-[4px] w-[200px] rounded-[4px] bg-[#1B3D6D] lg:w-[250px]" />
        </div>
    );
}

type ProductHighlightCardProps = {
    product: Product;
    variant: 'mobile' | 'slider';
};

function ProductHighlightCard({ product, variant }: ProductHighlightCardProps) {
    const isMobile = variant === 'mobile';

    return (
        <div
            className={cn(
                'group relative flex shrink-0 flex-col overflow-hidden border border-[#F2F2F2] bg-white shadow-sm transition-shadow duration-300 hover:shadow-md',
                isMobile
                    ? 'w-full'
                    : 'w-[calc(100vw-48px)] max-w-[416px] lg:w-[416px]',
            )}
        >
            <div className="h-[260px] w-full overflow-hidden">
                <img
                    src={product.img}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            <div
                className={cn(
                    'flex shrink-0 flex-grow flex-col items-start gap-4 border-t border-[#F2F2F2]',
                    isMobile ? 'p-6' : 'p-6 lg:p-8',
                )}
            >
                <div className="flex flex-col gap-2">
                    <h3 className="font-['Inter',sans-serif] text-[20px] font-semibold text-[#1B3D6D]">
                        {product.name}
                    </h3>
                    <p className="font-['Inter',sans-serif] text-[14px] leading-relaxed font-light text-[#A4A4A4]">
                        {product.desc}
                    </p>
                </div>

                <div className="flex-1" />

                <div className="flex w-full flex-row items-center justify-between">
                    <span className="font-['Playfair_Display',serif] text-[25px] font-bold text-[#1B3D6D]">
                        {product.price}
                    </span>
                    <Link
                        href={show.url(product.slug)}
                        className="flex h-[38px] items-center justify-center bg-[#1B3D6D] px-6 py-2 transition hover:bg-[#111]"
                    >
                        <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-white">
                            Ver producto
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ProductsMobileList({ products }: { products: Product[] }) {
    return (
        <div className="flex w-full max-w-[1296px] flex-col items-center gap-11 px-3">
            <div className="flex w-full flex-col gap-8">
                {products.map((product) => (
                    <ProductHighlightCard
                        key={product.slug}
                        product={product}
                        variant="mobile"
                    />
                ))}
            </div>

            <Link
                href="/productos"
                className="flex h-[39px] items-center justify-center rounded-[2px] bg-[#1B3D6D] px-5 font-['Inter',sans-serif] text-[16px] font-semibold text-white transition hover:bg-[#1B3D6D]/90"
            >
                Ver todos los objetos
            </Link>
        </div>
    );
}

function ProductsDesktopSlider({ products }: { products: Product[] }) {
    const baseProducts = products;
    const extendedProducts = Array(20).fill(baseProducts).flat();
    const START_PRODUCT_INDEX = baseProducts.length * 10;

    const [activeProductSlide, setActiveProductSlide] =
        useState(START_PRODUCT_INDEX);
    const [isProductTransitioning, setIsProductTransitioning] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isProductTransitioning) {
                setIsProductTransitioning(true);
            }

            setActiveProductSlide((prev) => prev + 1);
        }, 6000);

        return () => clearTimeout(timer);
    }, [activeProductSlide, isProductTransitioning]);

    const handleNextProduct = () => {
        if (!isProductTransitioning) {
            setIsProductTransitioning(true);
        }

        setActiveProductSlide((prev) => prev + 1);
    };

    const handlePrevProduct = () => {
        if (!isProductTransitioning) {
            setIsProductTransitioning(true);
        }

        setActiveProductSlide((prev) => prev - 1);
    };

    const handleProductTransitionEnd = () => {
        if (
            activeProductSlide <= baseProducts.length ||
            activeProductSlide >= extendedProducts.length - baseProducts.length
        ) {
            setIsProductTransitioning(false);
            const middleIndex =
                START_PRODUCT_INDEX +
                (activeProductSlide % baseProducts.length);
            setActiveProductSlide(middleIndex);
        }
    };

    return (
        <>
            <div className="relative w-full overflow-hidden py-4">
                <div
                    className={`flex flex-row items-center gap-[24px] ${isProductTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                    style={{
                        transform: `translateX(calc(50vw - (min(100vw - 48px, 416px) / 2) - ${activeProductSlide} * (min(100vw - 48px, 416px) + 24px)))`,
                    }}
                    onTransitionEnd={handleProductTransitionEnd}
                >
                    {extendedProducts.map((product, i) => (
                        <ProductHighlightCard
                            key={`${product.slug}-${i}`}
                            product={product}
                            variant="slider"
                        />
                    ))}
                </div>
            </div>

            <div className="z-10 mt-4 flex flex-col items-center gap-5">
                <div className="flex flex-row items-center gap-12">
                    <button
                        type="button"
                        onClick={handlePrevProduct}
                        className="group flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D]"
                        aria-label="Producto anterior"
                    >
                        <svg
                            className="h-6 w-6 text-[#1B3D6D] group-hover:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={handleNextProduct}
                        className="group flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D]"
                        aria-label="Producto siguiente"
                    >
                        <svg
                            className="h-6 w-6 text-[#1B3D6D] group-hover:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}

function ProductsEmpty({ title }: { title: string }) {
    return (
        <section
            id="productos"
            className="flex w-full flex-col items-center justify-center bg-[#FFFCF4] py-12 lg:py-[70px]"
        >
            <div className="flex w-full max-w-[1296px] flex-col items-center gap-6 px-3 text-center lg:px-[72px]">
                <h2 className="font-['Playfair_Display',serif] text-[40px] font-semibold text-[#1B3D6D] lg:text-[49px]">
                    {title}
                </h2>
                <div className="h-[4px] w-[200px] rounded-[4px] bg-[#1B3D6D] lg:w-[250px]" />
                <p className="max-w-xl font-['Inter',sans-serif] text-[16px] leading-relaxed text-[#7B7B7B]">
                    Pronto publicaremos objetos que acompañen tus historias.
                    Mientras tanto, explorá el catálogo completo.
                </p>
                <Link
                    href="/productos"
                    className="flex h-[39px] items-center justify-center rounded-[2px] bg-[#1B3D6D] px-5 font-['Inter',sans-serif] text-[16px] font-semibold text-white transition hover:bg-[#1B3D6D]/90"
                >
                    Ver todos los objetos
                </Link>
            </div>
        </section>
    );
}

function ProductsSectionContent({
    title,
    products,
}: {
    title: string;
    products: Product[];
}) {
    const isLgViewport = useIsLgViewport();
    const mobileProducts = products.slice(0, 3);

    return (
        <section
            id="productos"
            className="flex w-full flex-col items-center justify-center overflow-hidden bg-[#FFFCF4] py-12 lg:py-[70px]"
        >
            <div className="flex w-full flex-col items-center gap-11 lg:gap-[44px]">
                <ProductsSectionHeader title={title} />

                <div className="w-full lg:hidden">
                    <ProductsMobileList products={mobileProducts} />
                </div>

                {isLgViewport ? (
                    <div className="hidden w-full lg:block">
                        <ProductsDesktopSlider products={products} />
                    </div>
                ) : null}
            </div>
        </section>
    );
}

export default function ProductsSection({
    title = 'Objetos que acompañan tus historias',
    products,
}: ProductsSectionProps) {
    if (products.length === 0) {
        return <ProductsEmpty title={title} />;
    }

    return <ProductsSectionContent title={title} products={products} />;
}
