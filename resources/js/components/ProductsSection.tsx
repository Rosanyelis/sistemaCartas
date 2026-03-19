import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import type { Product } from '@/types/welcome';

interface ProductsSectionProps {
    title?: string;
    products: Product[];
}

export default function ProductsSection({
    title = 'Objetos que acompañan tus historias',
    products,
}: ProductsSectionProps) {
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
        <section
            id="productos"
            className="flex w-full flex-col items-center justify-center overflow-hidden bg-[#FFFCF4] py-20 lg:py-[70px]"
        >
            <div className="flex w-full flex-col items-center gap-[44px]">
                {/* Header */}
                <div className="flex w-full max-w-[1296px] flex-col items-center gap-4 px-6 lg:px-[72px]">
                    <h2 className="text-center font-['Playfair_Display',serif] text-[32px] leading-[65px] font-semibold text-[#1B3D6D] md:text-[49px]">
                        {title}
                    </h2>
                    <div className="h-[4px] w-[150px] rounded-[4px] bg-[#1B3D6D] md:w-[250px]"></div>
                </div>

                {/* Slider Content */}
                <div className="relative w-full overflow-hidden py-4">
                    <div
                        className={`flex flex-row items-center gap-[24px] ${isProductTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                        style={{
                            transform: `translateX(calc(50vw - (min(100vw - 48px, 416px) / 2) - ${activeProductSlide} * (min(100vw - 48px, 416px) + 24px)))`,
                        }}
                        onTransitionEnd={handleProductTransitionEnd}
                    >
                        {extendedProducts.map((product, i) => (
                            <div
                                key={i}
                                className="group relative flex w-[calc(100vw-48px)] max-w-[416px] shrink-0 flex-col overflow-hidden border border-[#F2F2F2] bg-white shadow-sm transition-shadow duration-300 hover:shadow-md lg:w-[416px]"
                            >
                                <div className="h-[260px] w-full overflow-hidden">
                                    <img
                                        src={product.img}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex shrink-0 flex-grow flex-col items-start gap-4 border-t border-[#F2F2F2] p-6 lg:p-8">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-['Inter',sans-serif] text-[20px] font-semibold text-[#1B3D6D]">
                                            {product.name}
                                        </h3>
                                        <p className="font-['Inter',sans-serif] text-[14px] leading-relaxed font-light text-[#A4A4A4]">
                                            {product.desc}
                                        </p>
                                    </div>

                                    {/* Spacer to push footer to bottom if desc is short */}
                                    <div className="flex-1"></div>

                                    <div className="flex w-full flex-row items-center justify-between">
                                        <span className="font-['Playfair_Display',serif] text-[25px] font-bold text-[#1B3D6D]">
                                            {product.price}
                                        </span>
                                        <button className="flex h-[38px] items-center justify-center bg-[#1B3D6D] px-6 py-2 transition hover:bg-[#111]">
                                            <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-white">
                                                Ver producto
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slider Controls */}
                <div className="z-10 mt-4 flex flex-col items-center gap-5">
                    <div className="flex flex-row items-center gap-10 lg:gap-12">
                        <button
                            onClick={handlePrevProduct}
                            className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] lg:h-[60px] lg:w-[60px]"
                        >
                            <svg
                                className="h-5 w-5 text-[#1B3D6D] group-hover:text-white lg:h-6 lg:w-6"
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
                            onClick={handleNextProduct}
                            className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] lg:h-[60px] lg:w-[60px]"
                        >
                            <svg
                                className="h-5 w-5 text-[#1B3D6D] group-hover:text-white lg:h-6 lg:w-6"
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
                    {/* CTA button mobile para productos */}
                    <Link
                        href="#productos"
                        className="flex h-[39px] items-center justify-center rounded-[2px] bg-[#1B3D6D] px-5 lg:hidden"
                    >
                        <span className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold text-white">
                            Ver todos los objetos
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
