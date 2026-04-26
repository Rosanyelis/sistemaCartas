import { Link } from '@inertiajs/react';
import { useCart } from '@/contexts/cart-context';
import { show } from '@/routes/productos';
import type { ProductosPaginator } from '@/types/producto-tienda';

function decodePaginationLabel(label: string): string {
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&hellip;/g, '…')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

interface GridProductsSectionProps {
    products: ProductosPaginator;
}

export default function GridProductsSection({
    products,
}: GridProductsSectionProps) {
    const { addItem, openCart } = useCart();
    const items = products.data ?? [];

    return (
        <section className="flex w-full flex-col items-center justify-center bg-white px-6 py-20 lg:px-[72px] lg:pt-[70px] lg:pb-[100px]">
            <div className="flex w-full max-w-[1296px] flex-col items-center gap-[44px]">
                {items.length === 0 ? (
                    <p className="font-['Inter',sans-serif] text-[16px] text-[#7B7B7B]">
                        No hay productos en esta categoría por ahora.
                    </p>
                ) : (
                    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {items.map((product) => (
                            <div
                                key={product.slug}
                                className="group flex flex-col items-start gap-4 overflow-hidden rounded-sm bg-white pb-6 shadow-[0px_0px_16px_rgba(0,0,0,0.04)]"
                            >
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

                                <div className="flex w-full flex-1 flex-col gap-4 px-4">
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

                                    <div className="mt-auto flex flex-col gap-3">
                                        <div className="flex items-center justify-between gap-4 py-0">
                                            <span className="font-['Playfair_Display',serif] text-[30px] leading-none font-normal text-[#1B3D6D]">
                                                {product.price}
                                            </span>
                                            <Link
                                                href={show.url(product.slug)}
                                                className="flex h-[39px] shrink-0 items-center justify-center rounded-[2px] bg-[#1B3D6D] px-4 py-[10px] text-white transition duration-300 hover:scale-[1.02] hover:bg-[#1B3D6D]/90"
                                            >
                                                <span className="font-['Inter',sans-serif] text-[14px] leading-none font-semibold">
                                                    Ver detalles
                                                </span>
                                            </Link>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                addItem({
                                                    slug: product.slug,
                                                    name: product.name,
                                                    subtitle: product.desc,
                                                    price: product.unit_price,
                                                    image: product.img,
                                                    badge: 'Pago Único',
                                                });
                                                openCart();
                                            }}
                                            className="flex h-[39px] w-full items-center justify-center rounded-[2px] border border-[#1B3D6D] bg-white font-['Inter',sans-serif] text-[14px] font-semibold text-[#1B3D6D] transition hover:bg-[#1B3D6D]/5"
                                        >
                                            Añadir al carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {products.last_page > 1 && (
                    <nav
                        className="mt-[30px] flex w-full max-w-[640px] flex-row flex-wrap items-center justify-center gap-1 rounded-[3px] border border-[#F3F4F6] bg-white p-2 shadow-sm"
                        aria-label="Paginación de productos"
                    >
                        {products.links.map((link, idx) => {
                            const label = decodePaginationLabel(link.label);
                            const isNumeric = /^\d+$/.test(label.trim());

                            if (link.url === null) {
                                return (
                                    <span
                                        key={`p-${idx}`}
                                        className={`flex min-h-[38px] min-w-[38px] items-center justify-center rounded-[3px] px-2 font-['Inter',sans-serif] text-[14px] ${
                                            link.active
                                                ? 'bg-[#1B3D6D] font-semibold text-white'
                                                : 'cursor-default text-[#9CA3AF]'
                                        }`}
                                        aria-current={
                                            link.active ? 'page' : undefined
                                        }
                                    >
                                        {label}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={`p-${idx}`}
                                    href={link.url}
                                    preserveScroll
                                    preserveState
                                    className={`flex min-h-[38px] min-w-[38px] items-center justify-center rounded-[3px] px-2 font-['Inter',sans-serif] text-[14px] transition hover:bg-[#F3F4F6] ${
                                        link.active
                                            ? 'bg-[#1B3D6D] font-semibold text-white hover:bg-[#1B3D6D]'
                                            : 'text-[#637381] hover:text-[#1B3D6D]'
                                    } ${isNumeric ? '' : 'px-3'}`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </div>
        </section>
    );
}
