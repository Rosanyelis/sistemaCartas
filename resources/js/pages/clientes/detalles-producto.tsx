import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ClienteLayout from '@/layouts/cliente-layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faCartShopping,
    faCheckCircle,
    faMagnifyingGlassPlus,
    faStamp,
    faUtensilSpoon,
    faLayerGroup,
    faBriefcase,
    faPlus,
    faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { ShieldCheck, Package, CalendarX, ChevronDown } from 'lucide-react';

export default function DetalleProducto() {
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(
        '/images/products/kit_lacre_real.png',
    );
    const [isZoomed, setIsZoomed] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const description = `El producto incluye dos sellos de cera completos con mangos de madera de color
caoba y bases de latón pulido, uno más alto que el otro, y un tercer mango más corto
visible en segundo plano. Hay dos sellos de cera roja prefabricados y solidificados: uno
grande con un intricado escudo de armas detallado y uno pequeño con un monograma.

Pequeñas bolitas de cera cruda de color gris-beige están esparcidas por la escena,
completando la presentación del kit de lacrado artesanal. La composición tiene una
estética sofisticada y clásica, con un enfoque nítido en el sello grande.`;

    const wordCount = description.trim().split(/\s+/).length;
    const isLongDescription = wordCount > 300;

    const price = 24.9;
    const oldPrice = 34.9;
    const total = (price * quantity).toFixed(2);

    const images = [
        '/images/products/kit_lacre_real.png',
        '/images/products/kit_lacre_real_details_2.png',
        '/images/products/product-1.png',
    ];

    const includedItems = [
        {
            title: 'Sello de latón',
            desc: 'Lorem ipsum dolor sit amet consectetur. Mi nibh egestas tellus.',
            icon: faStamp,
        },
        {
            title: 'Cuchara de fundición',
            desc: 'Lorem ipsum dolor sit amet consectetur. Sagittis venenatis.',
            icon: faUtensilSpoon,
        },
        {
            title: 'Tres barras de cera',
            desc: 'Lorem ipsum dolor sit amet consectetur. Dis enim egestas non.',
            icon: faLayerGroup,
        },
        {
            title: 'Estuche personalizado',
            desc: 'Lorem ipsum dolor sit amet consectetur. Sagittis venenatis.',
            icon: faBriefcase,
        },
    ];

    return (
        <ClienteLayout>
            <Head>
                <title>Kit de Lacre Real | Historias por Correo</title>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=playfair-display:400,600,700,700i|inter:400,500,600,700|cormorant-garamond:400,700,700i|roboto:400,500"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex w-full flex-col items-center bg-white">
                <div className="mt-[50px] w-full max-w-[1440px]">
                    {/* Hero Section */}
                    <section className="flex flex-col gap-[72px] border-b-[0.5px] border-[#F2F2F2] px-3 py-12 lg:flex-row lg:items-start lg:gap-[72px] lg:px-[72px] lg:py-[70px]">
                        {/* Left Side: Images */}
                        <div className="flex w-full flex-col gap-4 lg:w-[600px] lg:flex-row">
                            {/* Main Image with Zoom - Order 1 on mobile, 2 on desktop */}
                            <div
                                className="relative order-1 flex aspect-[351/419] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-[2px] bg-[#f9f9f9] shadow-[0px_3px_8px_rgba(0,0,0,0.15)] lg:order-2 lg:aspect-[474/545] lg:flex-1"
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                            >
                                <img
                                    src={mainImage}
                                    alt="Kit de Lacre Real"
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

                            {/* Thumbnails - Order 2 on mobile, 1 on desktop */}
                            <div className="order-2 flex flex-row gap-4 lg:order-1 lg:flex-col">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setMainImage(img)}
                                        className={`h-[110px] w-[110px] overflow-hidden rounded-[2px] transition duration-300 ${mainImage === img ? 'opacity-100 ring-2 ring-[#1B3D6D]' : 'opacity-60 hover:opacity-100'}`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${i}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Info */}
                        <div className="flex flex-1 flex-col gap-6 lg:max-w-[624px]">
                            {/* Breadcrumbs & Badge */}
                            <div className="flex items-center justify-between">
                                <nav className="flex items-center gap-2 font-['Inter',sans-serif] text-[13px] font-normal text-[#1B3D6D]">
                                    <Link href="/productos">Producto</Link>
                                    <span className="font-semibold">/</span>
                                    <span className="font-semibold">
                                        Papelería
                                    </span>
                                </nav>
                                <div className="flex items-center justify-center rounded-[2px] bg-[#1DA534] px-[10px] py-[3px] text-white">
                                    <span className="font-['Inter',sans-serif] text-[13px] font-normal">
                                        Stock disponible
                                    </span>
                                </div>
                            </div>

                            {/* Product Header */}
                            <div className="flex flex-col gap-2">
                                <h1 className="font-['Playfair_Display',serif] text-[39px] leading-tight font-semibold text-[#1B3D6D]">
                                    Kit de Lacre Real
                                </h1>
                                <p className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-[#7B7B7B]">
                                    Set completo con sello de latón
                                    personalizado, cuchara de fundición y tres
                                    barras de cera borgoña.
                                </p>
                            </div>

                            {/* Prices */}
                            <div className="flex items-end gap-6">
                                <span className="font-['Playfair_Display',serif] text-[32px] font-normal text-[#7B7B7B] line-through">
                                    ${oldPrice.toFixed(2).replace('.', ',')}
                                </span>
                                <span className="font-['Playfair_Display',serif] text-[32px] font-normal text-[#1B3D6D]">
                                    ${price.toFixed(2).replace('.', ',')}
                                </span>
                            </div>

                            {/* Purchase Options */}
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
                                <div className="flex h-[50px] items-center gap-6 rounded-[2px] bg-[#F5F5FF] px-6 py-[7px]">
                                    {/* Qty Selector */}
                                    <div className="flex h-9 w-[114px] items-center justify-between bg-white px-2">
                                        <button
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
                                            onClick={() =>
                                                setQuantity(quantity + 1)
                                            }
                                            className="text-[#1B3D6D]"
                                        >
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className="text-xs"
                                            />
                                        </button>
                                    </div>
                                    {/* Total to pay */}
                                    <div className="flex flex-col items-center">
                                        <span className="font-['Inter',sans-serif] text-[8px] font-normal text-[#1B3D6D]">
                                            Total a pagar
                                        </span>
                                        <span className="font-['Inter',sans-serif] text-[20px] font-semibold text-[#1B3D6D]">
                                            ${total.replace('.', ',')}
                                        </span>
                                    </div>
                                </div>

                                <button className="flex h-[47px] flex-1 items-center justify-center rounded-[2px] border border-[#1B3D6D] bg-[#1B3D6D] px-5 py-[14px] text-white transition hover:bg-[#1B3D6D]/90">
                                    <span className="font-['Inter',sans-serif] text-base font-semibold">
                                        Comprar ahora
                                    </span>
                                </button>
                            </div>

                            {/* Checks */}
                            <div className="flex flex-wrap gap-[29px]">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="text-[#1B3D6D]"
                                    />
                                    <span className="font-['Inter',sans-serif] text-[13px] font-normal text-[#1B3D6D]">
                                        Cancelable en cualquier momento
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="text-[#1B3D6D]"
                                    />
                                    <span className="font-['Inter',sans-serif] text-[13px] font-normal text-[#1B3D6D]">
                                        Sin permanencia
                                    </span>
                                </div>
                            </div>

                            <hr className="border-t-[0.5px] border-[#F2F2F2]" />

                            {/* Included Items Grid */}
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
                        </div>
                    </section>

                    {/* Long Description Section */}
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

                    {/* Info Cards Section */}
                    <section className="flex flex-col items-center justify-center gap-11 px-3 py-12 lg:flex-row lg:px-[72px] lg:py-[70px]">
                        {[
                            {
                                title: 'Pago seguro',
                                text: 'Transacciones cifradas de extremo a extremo.',
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
        </ClienteLayout>
    );
}
