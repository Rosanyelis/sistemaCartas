import { Link } from '@inertiajs/react';
import { show } from '@/routes/productos';
import type { Product } from '@/types/welcome';

interface GridProductsSectionProps {
    products: Product[];
}

export default function GridProductsSection({
    products,
}: GridProductsSectionProps) {
    return (
        <section className="flex w-full flex-col items-center justify-center bg-white px-6 py-20 lg:px-[72px] lg:pt-[70px] lg:pb-[100px]">
            <div className="flex w-full max-w-[1296px] flex-col items-center gap-[44px]">
                <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {products.map((product, i) => (
                        <div
                            key={i}
                            className="group flex flex-col items-start gap-4 overflow-hidden rounded-sm bg-white pb-6 shadow-[0px_0px_16px_rgba(0,0,0,0.04)]"
                        >
                            {/* Image Container */}
                            <Link 
                                href={show.url(product.slug)}
                                className="relative h-[350px] w-full overflow-hidden"
                            >
                                <img
                                    src={product.img}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    alt={product.name}
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
                            </Link>

                            {/* Content */}
                            <div className="flex flex-1 flex-col gap-4 px-4">
                                <div className="flex flex-1 flex-col gap-3">
                                    <Link href={show.url(product.slug)}>
                                        <h3 className="font-['Inter',sans-serif] text-[18px] leading-tight font-semibold text-[#1B3D6D] hover:underline">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="line-clamp-4 font-['Inter',sans-serif] text-[14px] leading-[22px] font-normal text-[#7B7B7B]">
                                        {product.desc}
                                    </p>
                                </div>

                                <div className="mt-auto flex items-center justify-between gap-4 py-0">
                                    <span className="font-['Playfair_Display',serif] text-[30px] leading-none font-normal text-[#1B3D6D]">
                                        {product.price}
                                    </span>
                                    <Link 
                                        href={show.url(product.slug)}
                                        className="flex h-[39px] items-center justify-center rounded-[2px] bg-[#1B3D6D] px-5 py-[10px] text-white transition duration-300 hover:scale-[1.02] hover:bg-[#1B3D6D]/90"
                                    >
                                        <span className="font-['Inter',sans-serif] text-[14px] leading-none font-semibold">
                                            Ver detalles
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-[30px] flex h-[46px] w-full max-w-[284px] flex-row items-center justify-between rounded-[3px] border border-[#F3F4F6] bg-white p-1 shadow-sm">
                    <button className="flex h-full w-[10%] items-center justify-center text-[#637381] hover:text-[#1B3D6D]">
                        <i className="fa-solid fa-chevron-left text-sm"></i>
                    </button>
                    <div className="flex items-center gap-3 font-['Inter',sans-serif] text-[16px] font-normal text-[#637381]">
                        <span className="cursor-pointer hover:font-bold">
                            1
                        </span>
                        <span className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[3px] bg-[#1B3D6D] font-bold text-white">
                            2
                        </span>
                        <span className="cursor-pointer hover:font-bold">
                            3
                        </span>
                        <span className="cursor-pointer hover:font-bold">
                            4
                        </span>
                        <span className="cursor-pointer hover:font-bold">
                            5
                        </span>
                        <span>...</span>
                        <span className="cursor-pointer hover:font-bold">
                            12
                        </span>
                    </div>
                    <button className="flex h-full w-[10%] flex-col items-center justify-center rounded-r-[3px] bg-[#F3F4F6] text-[#637381] hover:text-[#1B3D6D]">
                        <i className="fa-solid fa-chevron-right text-sm"></i>
                    </button>
                </div>
            </div>
        </section>
    );
}
