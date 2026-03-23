import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faBriefcase,
    faBoxOpen,
    faCheckCircle,
    faLayerGroup,
    faMagnifyingGlassPlus,
    faMinus,
    faPlus,
    faStamp,
    faUtensilSpoon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, usePage } from '@inertiajs/react';
import { ShieldCheck, Package, CalendarX, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ClienteLayout from '@/layouts/cliente-layout';
import { useCart } from '@/contexts/cart-context';

const INCLUDED_ICONS: Record<string, IconDefinition> = {
    faStamp,
    faUtensilSpoon,
    faLayerGroup,
    faBriefcase,
    faBoxOpen,
};

type ProductPageRecord = {
    slug: string;
    name: string;
    subtitle: string;
    description: string;
    unit_price: number;
    old_price: number | null;
    category: string;
    images: string[];
    included: { title: string; desc: string; icon: string }[];
};

type DetalleProductoPageProps = {
    product: ProductPageRecord;
    /** True en `/productos/ejemplo` (datos de referencia hasta catálogo real) */
    referenceDemo?: boolean;
};

/**
 * CartProvider envuelve la app en `app.tsx` / `ssr.tsx`; el contenido sigue dentro de ClienteLayout por UI.
 */
export default function DetalleProducto() {
    return (
        <ClienteLayout>
            <DetalleProductoContent />
        </ClienteLayout>
    );
}

function DetalleProductoContent() {
    const { product, referenceDemo = false } =
        usePage<DetalleProductoPageProps>().props;
    const { addItem, openCart } = useCart();

    const primaryImage =
        product.images[0] ?? '/images/products/product-1.png';

    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(primaryImage);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const description = product.description;
    const wordCount = description.trim().split(/\s+/).length;
    const isLongDescription = wordCount > 300;

    const price = Number(product.unit_price);
    const oldPrice =
        product.old_price === null || product.old_price === undefined
            ? null
            : Number(product.old_price);
    const total = (Number.isFinite(price) ? price * quantity : 0).toFixed(2);

    const includedItems = product.included.map((row) => ({
        ...row,
        icon: INCLUDED_ICONS[row.icon] ?? faBoxOpen,
    }));

    return (
        <>
            {/* Hijos como array: evita nodos de texto por saltos de línea (Inertia Head hace Object.keys en cada hijo) */}
            <Head>
                {[
                    <title key="title">
                       Producto - Historias por Correo
                    </title>
                ]}
            </Head>

            <div className="flex w-full flex-col items-center bg-white">
                <div className="mt-[50px] w-full max-w-[1440px]">
                    {referenceDemo && (
                        <div
                            className="mx-3 mb-4 rounded-[2px] border border-amber-200 bg-amber-50 px-4 py-3 text-center font-['Inter',sans-serif] text-[13px] text-amber-950 lg:mx-[72px]"
                            role="status"
                        >
                            Vista con{' '}
                            <strong>datos de referencia</strong> del catálogo
                            demo. Más adelante se conectará al catálogo real.
                        </div>
                    )}
                    <section className="flex flex-col gap-[72px] border-b-[0.5px] border-[#F2F2F2] px-3 py-12 lg:flex-row lg:items-start lg:gap-[72px] lg:px-[72px] lg:py-[70px]">
                        <div className="flex w-full flex-col gap-4 lg:w-[600px] lg:flex-row">
                            <div
                                className="relative order-1 flex aspect-[351/419] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-[2px] bg-[#f9f9f9] shadow-[0px_3px_8px_rgba(0,0,0,0.15)] lg:order-2 lg:aspect-[474/545] lg:flex-1"
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                            >
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className={`h-full w-full object-cover transition-transform duration-500 ease-out ${isZoomed ? 'scale-150' : 'scale-100'}`}
                                />
                                {!isZoomed && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity hover:opacity-100">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1B3D6D]">
                                            <FontAwesomeIcon
                                                icon={faMagnifyingGlassPlus}
                                                className="text-xl"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="order-2 flex flex-row gap-4 lg:order-1 lg:flex-col">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setMainImage(img)}
                                        className={`h-[110px] w-[110px] overflow-hidden rounded-[2px] transition duration-300 ${mainImage === img ? 'opacity-100 ring-2 ring-[#1B3D6D]' : 'opacity-60 hover:opacity-100'}`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Miniatura ${i + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col gap-6 lg:max-w-[624px]">
                            <div className="flex items-center justify-between">
                                <nav className="flex items-center gap-2 font-['Inter',sans-serif] text-[13px] font-normal text-[#1B3D6D]">
                                    <Link href="/productos">Producto</Link>
                                    <span className="font-semibold">/</span>
                                    <span className="font-semibold">
                                        {product.category}
                                    </span>
                                </nav>
                                <div className="flex items-center justify-center rounded-[2px] bg-[#1DA534] px-[10px] py-[3px] text-white">
                                    <span className="font-['Inter',sans-serif] text-[13px] font-normal">
                                        Stock disponible
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <h1 className="font-['Playfair_Display',serif] text-[39px] leading-tight font-semibold text-[#1B3D6D]">
                                    {product.name}
                                </h1>
                                <p className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-[#7B7B7B]">
                                    {product.subtitle}
                                </p>
                            </div>

                            <div className="flex items-end gap-6">
                                {oldPrice !== null &&
                                    Number.isFinite(oldPrice) && (
                                    <span className="font-['Playfair_Display',serif] text-[32px] font-normal text-[#7B7B7B] line-through">
                                        $
                                        {oldPrice
                                            .toFixed(2)
                                            .replace('.', ',')}
                                    </span>
                                )}
                                <span className="font-['Playfair_Display',serif] text-[32px] font-normal text-[#1B3D6D]">
                                    $
                                    {(Number.isFinite(price) ? price : 0)
                                        .toFixed(2)
                                        .replace('.', ',')}
                                </span>
                            </div>

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
                                <div className="flex h-[50px] items-center gap-6 rounded-[2px] bg-[#F5F5FF] px-6 py-[7px]">
                                    <div className="flex h-9 w-[114px] items-center justify-between bg-white px-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                            className="text-[#1B3D6D]"
                                        >
                                            <FontAwesomeIcon
                                                icon={faMinus}
                                                className="text-xs"
                                            />
                                        </button>
                                        <span className="font-['Roboto',sans-serif] text-base font-normal text-[#1B3D6D]">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(99, quantity + 1),
                                                )
                                            }
                                            className="text-[#1B3D6D]"
                                        >
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className="text-xs"
                                            />
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="font-['Inter',sans-serif] text-[8px] font-normal text-[#1B3D6D]">
                                            Total a pagar
                                        </span>
                                        <span className="font-['Inter',sans-serif] text-[20px] font-semibold text-[#1B3D6D]">
                                            ${total.replace('.', ',')}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        addItem({
                                            slug: product.slug,
                                            name: product.name,
                                            subtitle: product.subtitle,
                                            price: Number.isFinite(price)
                                                ? price
                                                : 0,
                                            image: primaryImage,
                                            quantity,
                                            badge: 'Pago Único',
                                        });
                                        openCart();
                                    }}
                                    className="flex h-[47px] flex-1 items-center justify-center gap-2 rounded-[2px] border border-[#1B3D6D] bg-[#1B3D6D] px-5 py-[14px] text-white transition hover:bg-[#1B3D6D]/90"
                                >
                                    <span className="font-['Inter',sans-serif] text-base font-semibold">
                                        Comprar ahora
                                    </span>
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-[29px]">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="text-[#1B3D6D]"
                                    />
                                    <span className="font-['Inter',sans-serif] text-[13px] font-normal text-[#1B3D6D]">
                                        Pago seguro con PayPal (sandbox)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="text-[#1B3D6D]"
                                    />
                                    <span className="font-['Inter',sans-serif] text-[13px] font-normal text-[#1B3D6D]">
                                        Catálogo demo funcional
                                    </span>
                                </div>
                            </div>

                            <hr className="border-t-[0.5px] border-[#F2F2F2]" />

                            {includedItems.length > 0 && (
                                <div className="flex flex-col gap-6">
                                    <h3 className="font-['Inter',sans-serif] text-[20px] font-semibold text-[#1E3E6C]">
                                        ¿Qué incluye cada envío?
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {includedItems.map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-3"
                                            >
                                                <div className="flex h-6 w-6 items-center justify-center text-[#1B3D6D]">
                                                    <FontAwesomeIcon
                                                        icon={item.icon}
                                                        className="text-xl"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#1B3D6D]">
                                                        {item.title}
                                                    </span>
                                                    <p className="font-['Inter',sans-serif] text-[13px] font-normal text-[#7B7B7B]">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="flex flex-col items-center gap-11 border-b-[0.5px] border-[#F2F2F2] px-3 py-12 lg:items-start lg:px-[72px] lg:py-[70px]">
                        <div className="flex flex-col items-start gap-1">
                            <h2 className="font-['Playfair_Display',serif] text-[30px] font-semibold text-[#1B3D6D] lg:text-[39px]">
                                Descripción del producto
                            </h2>
                            <div className="h-1 w-[200px] rounded-full bg-[#1B3D6D] lg:w-[250px]"></div>
                        </div>

                        <div className="flex flex-col gap-8 font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#7B7B7B] lg:text-[20px] lg:leading-[28px]">
                            <div className="flex flex-col gap-6 text-left">
                                {description
                                    .split('\n\n')
                                    .map((paragraph, i) => (
                                        <p
                                            key={i}
                                            className={
                                                !isExpanded &&
                                                isLongDescription &&
                                                i > 0
                                                    ? 'hidden lg:block'
                                                    : 'block'
                                            }
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                            </div>

                            {!isExpanded && isLongDescription && (
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(true)}
                                    className="flex items-center justify-center gap-2 lg:hidden"
                                >
                                    <span className="font-['Inter',sans-serif] text-base font-semibold text-[#1B3D6D]">
                                        Leer más
                                    </span>
                                    <ChevronDown
                                        size={20}
                                        className="text-[#1B3D6D]"
                                    />
                                </button>
                            )}

                            {isExpanded && (
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(false)}
                                    className="flex items-center justify-center gap-2 lg:hidden"
                                >
                                    <span className="font-['Inter',sans-serif] text-base font-semibold text-[#1B3D6D]">
                                        Leer menos
                                    </span>
                                    <ChevronDown
                                        size={20}
                                        className="rotate-180 text-[#1B3D6D]"
                                    />
                                </button>
                            )}
                        </div>
                    </section>

                    <section className="flex flex-col items-center justify-center gap-11 px-3 py-12 lg:flex-row lg:px-[72px] lg:py-[70px]">
                        {[
                            {
                                title: 'Pago seguro',
                                text: 'PayPal sandbox para esta demostración.',
                                icon: ShieldCheck,
                            },
                            {
                                title: 'Envío protegido',
                                text: 'Embalaje reforzado para que llegue impecable.',
                                icon: Package,
                            },
                            {
                                title: 'Cancelación flexible',
                                text: 'Sin ataduras, cancela cuando quieras desde tu perfil.',
                                icon: CalendarX,
                            },
                        ].map((card, i) => (
                            <div
                                key={i}
                                className="flex w-full flex-col items-center gap-[10px] rounded-[2px] p-5 lg:w-[322px]"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-[2px] bg-[#F5F5FF] text-[#1B3D6D]">
                                    <card.icon size={32} />
                                </div>
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <h4 className="font-['Playfair_Display',serif] text-[25px] font-normal text-[#1B3D6D]">
                                        {card.title}
                                    </h4>
                                    <p className="font-['Inter',sans-serif] text-[13px] font-medium text-[#1B3D6D] italic opacity-80">
                                        {card.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </>
    );
}
