import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ClienteLayout from '@/layouts/cliente-layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlay,
    faChevronLeft,
    faChevronRight,
    faChevronDown,
    faChevronUp,
    faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import HowItWorksSection from '@/components/tienda/HowItWorksSection';
import {
    ShieldCheck,
    Package,
    CalendarX,
    Star,
    Quote,
    FileText,
    Newspaper,
    Mail,
    Image as ImageIcon,
    Gift,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

export default function DetalleHistoria() {
    const media = [
        { url: '/images/story_cover.png', type: 'video' },
        { url: '/images/cards/cards-1.png', type: 'image' },
        { url: '/images/cards/cards-2.png', type: 'image' },
        { url: '/images/cards/cards-3.png', type: 'image' },
        { url: '/images/cards/cards-4.png', type: 'image' },
    ];

    const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    const reviews = [
        {
            name: 'Sabo Masties',
            date: 'Hace 3 horas',
            rating: 5,
            text: 'Lorem ipsum dolor sit amet consectetur. Tortor nec sit nunc auctor etiam magna et...',
            avatar: '/images/person_holding_letter.png', // Placeholder
        },
        {
            name: 'Rosa Mendoza',
            date: 'Hace 3 horas',
            rating: 5,
            text: 'Lorem ipsum dolor sit amet consectetur. Tortor nec sit nunc auctor etiam magna et...',
            avatar: '/images/person_holding_letter.png',
        },
        {
            name: 'Joel Leat',
            date: 'Hace 3 horas',
            rating: 5,
            text: 'Lorem ipsum dolor sit amet consectetur. Tortor nec sit nunc auctor etiam magna et...',
            avatar: '/images/person_holding_letter.png',
        },
        {
            name: 'Sofia G.',
            date: 'Hace 3 horas',
            rating: 5,
            text: 'Lorem ipsum dolor sit amet consectetur. Tortor nec sit nunc auctor etiam magna et...',
            avatar: '/images/person_holding_letter.png',
        },
    ];

    const includedItems = [
        {
            title: 'La carta',
            icon: FileText,
        },
        {
            title: 'Un recorte de periódico de la época',
            icon: Newspaper,
        },
        {
            title: 'Una postal',
            icon: Mail,
        },
        {
            title: 'Una foto o un elemento sorpresa',
            icon: ImageIcon,
        },
        {
            title: 'Un regalo único de la historia (cada 3 cartas)',
            icon: Gift,
        },
    ];

    return (
        <ClienteLayout>
            <Head>
                {[
                    <title key="title">
                        El Secreto del Galeón | Historias por Correo
                    </title>,
                    <link
                        key="preconnect"
                        rel="preconnect"
                        href="https://fonts.bunny.net"
                    />,
                    <link
                        key="fonts"
                        href="https://fonts.bunny.net/css?family=playfair-display:400,600,700,700i|inter:400,500,600,700|cormorant-garamond:400,700,700i|roboto:400,500|poppins:400,500,600"
                        rel="stylesheet"
                    />,
                ]}
            </Head>

            <div className="flex w-full flex-col items-center bg-white px-0 lg:px-0">
                <div className="mt-[50px] w-full max-w-[1440px]">
                    {/* 1. Hero / Detalle del Producto Section */}
                    <section className="flex flex-col gap-8 border-b-[0.5px] border-[#F2F2F2] px-4 py-8 lg:mt-[50px] lg:flex-row lg:items-start lg:gap-[72px] lg:px-[72px] lg:py-[70px]">
                        {/* Video / Image Display */}
                        <div className="flex w-full flex-col gap-4 lg:w-[600px]">
                            {/* Main Video/Image Frame */}
                            <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[2px] bg-[#242424] shadow-[0px_3px_8px_rgba(0,0,0,0.15)] lg:aspect-[600/462]">
                                <img
                                    src={media[activeThumbnailIndex].url}
                                    alt="Detalle de historia"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Play Button Overlay */}
                                {media[activeThumbnailIndex].type ===
                                    'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-100 transition-opacity group-hover:bg-black/40">
                                        <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full border-[2.5px] border-white bg-transparent text-white backdrop-blur-[2px] transition-transform duration-300 hover:scale-110 lg:h-[95px] lg:w-[95px]">
                                            <div className="ml-1 flex h-0 w-0 border-t-[12px] border-b-[12px] border-l-20 border-t-transparent border-b-transparent border-l-white lg:border-t-[15px] lg:border-b-[15px] lg:border-l-[25px]"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails Row */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide lg:justify-between lg:overflow-visible lg:pb-0">
                                {media.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() =>
                                            setActiveThumbnailIndex(i)
                                        }
                                        className={`relative h-[80px] w-[80px] min-w-[80px] shrink-0 overflow-hidden rounded-[2px] transition duration-300 lg:h-[110px] lg:w-full lg:min-w-[110px] lg:flex-1 ${activeThumbnailIndex === i ? 'ring-2 ring-[#1B3D6D] ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                                    >
                                        <img
                                            src={item.url}
                                            alt={`Thumbnail ${i}`}
                                            className="h-full w-full object-cover"
                                        />
                                        {item.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/80 bg-black/20 text-white backdrop-blur-[1px]">
                                                    <div className="ml-0.5 h-0 w-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent border-l-white"></div>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info Column */}
                        <div className="flex w-full flex-1 flex-col gap-6 lg:max-w-[624px]">
                            {/* Breadcrumbs & Badge */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <nav className="flex items-center gap-2 font-['Inter',sans-serif] text-[13px] font-semibold text-[#1E3E6C]">
                                    <Link href="/historias">Colecciones</Link>
                                    <span className="text-[#A4A4A4]">/</span>
                                    <span>Siglo XVIII</span>
                                </nav>
                                <div className="rounded-[2px] bg-[#1DA534] px-4 py-1 text-white">
                                    <span className="font-['Inter',sans-serif] text-[12px] font-normal tracking-wide">
                                        Suscripción disponible
                                    </span>
                                </div>
                            </div>

                            {/* Header Info */}
                            <div className="flex flex-col gap-2">
                                <h1 className="font-['Playfair_Display',serif] text-[39px] leading-tight font-semibold text-[#1B3D6D]">
                                    El Secreto del Galeón
                                </h1>
                                <p className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-[#7B7B7B]">
                                    Una correspondencia perdida entre un
                                    cartógrafo real y una pasajera clandestina
                                    que cambiará el rumbo de la historia.
                                </p>
                            </div>

                            {/* Prices Box */}
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-col items-center justify-center gap-2 rounded-[2px] bg-[#F5F5FF] py-4 lg:h-[53px] lg:flex-row lg:gap-4 lg:py-0">
                                    <span className="font-['Playfair_Display',serif] text-[28px] font-normal text-[#7B7B7B] line-through lg:text-[32px]">
                                        $34,90
                                    </span>
                                    <span className="font-['Playfair_Display',serif] text-[32px] font-bold text-[#1B3D6D] lg:font-normal">
                                        $24,90
                                    </span>
                                </div>
                                <span className="text-center font-['Inter',sans-serif] text-[15px] font-normal text-[#1B3D6D] lg:text-[16px]">
                                    Por entrega mensual
                                </span>
                            </div>

                            {/* Subscribe Button */}
                            <button className="flex h-[47px] w-full items-center justify-center rounded-[2px] border border-[#1B3D6D] bg-[#1B3D6D] px-5 py-[14px] text-white transition hover:bg-[#1B3D6D]/90">
                                <span className="font-['Inter',sans-serif] text-base font-semibold">
                                    Suscribirme a esta historia
                                </span>
                            </button>

                            {/* Verification Lines */}
                            <div className="flex flex-wrap gap-x-8 gap-y-2">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck
                                        size={20}
                                        className="text-[#1B3D6D]"
                                    />
                                    <span className="font-['Inter',sans-serif] text-[13px] font-normal text-[#1B3D6D]">
                                        Cancelable en cualquier momento
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package
                                        size={20}
                                        className="text-[#1B3D6D]"
                                    />
                                    <span className="font-['Inter',sans-serif] text-[13px] font-normal text-[#1B3D6D]">
                                        Sin permanencia
                                    </span>
                                </div>
                            </div>

                            <hr className="border-t-[0.5px] border-[#F2F2F2]" />

                            {/* What's Included */}
                            <div className="flex flex-col gap-6">
                                <h3 className="font-['Inter',sans-serif] text-[20px] font-semibold text-[#1E3E6C]">
                                    ¿Qué incluye cada envío?
                                </h3>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                                    {includedItems.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="mt-0.5 flex h-6 w-6 items-center justify-center text-[#1B3D6D]">
                                                <item.icon size={20} />
                                            </div>
                                            <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#1B3D6D]">
                                                {item.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Sinopsis de la historia Section */}
                    <section className="flex flex-col gap-10 border-b-[0.5px] border-[#F2F2F2] px-4 py-12 lg:items-center lg:gap-11 lg:px-[72px] lg:py-[70px]">
                        <div className="flex w-full flex-col items-start gap-2">
                            <h2 className="font-['Playfair_Display',serif] text-[32px] font-semibold text-[#1B3D6D] lg:text-[39px]">
                                Sinopsis de la historia
                            </h2>
                            <div className="h-1 w-[250px] rounded-full bg-[#1B3D6D] lg:w-[250px]"></div>
                        </div>

                        <div className="flex w-full max-w-[1208px] flex-col items-center gap-8">
                            <div className="flex w-full items-start gap-4 lg:gap-10">
                                <Quote
                                    size={32}
                                    className="shrink-0 text-[#1B3D6D] lg:mt-2 lg:size-[44px]"
                                />
                                <div
                                    className={`relative flex flex-col gap-6 overflow-hidden transition-all duration-500 font-['Inter',sans-serif] ${!isExpanded ? 'max-h-[220px]' : 'max-h-[3000px]'}`}
                                >
                                    <p className="text-[15px] font-normal leading-relaxed text-[#7B7B7B] lg:text-[20px] lg:leading-[28px]">
                                        Año 1742. El navío de línea San Lorenzo
                                        zarpa de Cádiz con destino a las
                                        colonias, portando en sus bodegas un
                                        cargamento que podría cambiar el
                                        equilibrio de poder en Europa. Entre la
                                        tripulación se encuentra Julián de
                                        Aranda, un cartógrafo real cuya
                                        verdadera misión es descifrar un antiguo
                                        mapa fenicio que supuestamente indica la
                                        ruta hacia la ciudad sumergida de
                                        Tartessos.
                                    </p>
                                    <p className="text-[15px] font-normal leading-relaxed text-[#7B7B7B] lg:text-[20px] lg:leading-[28px]">
                                        Sin embargo, Julián no está solo en sus
                                        pesquisas. Oculta tras los fardos de
                                        seda de la bodega, Elena de Valparaíso,
                                        una joven de la nobleza que huye de un
                                        matrimonio concertado, descubre por
                                        accidente los planos del cartógrafo. Lo
                                        que comienza como una tensa tregua entre
                                        el deber y la supervivencia se
                                        transforma rápidamente en una alianza
                                        desesperada cuando extraños sucesos
                                        empiezan a diezmar a la guardia del
                                        galeón.
                                    </p>
                                    <p className="text-[15px] font-normal leading-relaxed text-[#7B7B7B] lg:text-[20px] lg:leading-[28px]">
                                        A través de estas cartas, vivirás la
                                        atmósfera opresiva del océano Atlántico,
                                        el olor a madera vieja y salitre, y el
                                        suspenso de una travesía donde cada
                                        trazo en el mapa oculta un peligro
                                        mortal. No es solo una historia de
                                        aventura; es el testimonio íntimo de dos
                                        almas que, entre tormentas y secretos de
                                        estado, descubrieron que el mapa más
                                        difícil de trazar es el del propio
                                        corazón.
                                    </p>

                                    <div className="flex justify-end">
                                        <Quote
                                            size={32}
                                            className="rotate-180 text-[#1B3D6D] lg:size-[44px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-4 flex items-center gap-3 text-[#1B3D6D] transition-colors hover:opacity-80"
                            >
                                <span className="font-['Inter',sans-serif] text-[16px] font-bold text-[#1E3E6C]">
                                    {isExpanded ? 'Ver menos' : 'Leer más'}
                                </span>
                                <FontAwesomeIcon
                                    icon={isExpanded ? faChevronUp : faChevronDown}
                                    className="text-[14px]"
                                />
                            </button>
                        </div>
                    </section>

                    {/* 3. Trustpilot Reviews Section */}
                    <section className="flex flex-col items-center gap-11 border-b-[0.5px] border-[#F2F2F2] px-3 py-16 lg:px-[72px] lg:py-[70px]">
                        <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="flex flex-col gap-2">
                                <h3 className="font-['Poppins',sans-serif] text-[24px] font-semibold text-[#1B3D6D]">
                                    Our customers&apos; Trustpilot reviews
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-1 text-[#FFC800]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={20}
                                                fill="currentColor"
                                            />
                                        ))}
                                    </div>
                                    <span className="font-['Inter',sans-serif] text-[16px] font-semibold text-[#1B3D6D]">
                                        4.9 average rating
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-[16px] bg-white px-4 py-3 shadow-[0px_2px_4px_rgba(0,0,0,0.075)]">
                                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[4px] bg-[#1DA534] text-white">
                                    <Star size={20} fill="currentColor" />
                                </div>
                                <span className="font-['Poppins',sans-serif] text-[24px] font-medium text-[#373737]">
                                    Trustpilot
                                </span>
                            </div>
                        </div>

                        {/* Reviews Carousel/Grid */}
                        <div className="flex w-full gap-6 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4 lg:pb-0">
                            {reviews.map((review, i) => (
                                <div
                                    key={i}
                                    className="flex w-[85vw] shrink-0 flex-col gap-4 rounded-[24px] border border-[#F2F2F2] bg-white p-4 shadow-[0px_0px_4px_rgba(0,0,0,0.1)] transition-transform md:w-full hover:-translate-y-1"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={review.avatar}
                                            alt={review.name}
                                            className="h-[52px] w-[52px] rounded-full object-cover"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-['Inter',sans-serif] text-[16px] font-semibold text-[#1B3D6D]">
                                                {review.name}
                                            </span>
                                            <span className="font-['Poppins',sans-serif] text-[13px] text-[#7B7B7B]">
                                                {review.date}
                                            </span>
                                        </div>
                                        <div className="ml-auto flex h-[34px] w-[34px] items-center justify-center rounded-[4px] bg-[#1DA534] text-white">
                                            <Star
                                                size={16}
                                                fill="currentColor"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-1 text-[#FFC800]">
                                        {[...Array(5)].map((_, j) => (
                                            <Star
                                                key={j}
                                                size={16}
                                                fill="currentColor"
                                            />
                                        ))}
                                    </div>
                                    <p className="font-['Inter',sans-serif] text-[15px] leading-[22px] text-[#7B7B7B] lg:text-[16px]">
                                        {review.text}
                                    </p>
                                    <button className="flex items-center text-[#1B3D6D] transition hover:opacity-70">
                                        <span className="font-['Inter',sans-serif] text-[14px] font-bold">
                                            Leer más
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Arrows for Reviews */}
                        <div className="flex gap-12">
                            <button className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#1B3D6D] text-[#1B3D6D] transition hover:bg-[#1B3D6D] hover:text-white">
                                <ChevronLeft size={40} />
                            </button>
                            <button className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#1B3D6D] text-[#1B3D6D] transition hover:bg-[#1B3D6D] hover:text-white">
                                <ChevronRight size={40} />
                            </button>
                        </div>
                    </section>

                    {/* 4. Info Cards Section */}
                    <section className="flex flex-col items-center justify-center gap-12 border-b-[0.5px] border-[#F2F2F2] px-4 py-16 lg:flex-row lg:gap-11 lg:px-[72px] lg:py-[70px]">
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
                                className="flex w-full flex-col items-center gap-[10px] rounded-[2px] lg:w-[322px]"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-[2px] bg-[#F5F5FF] text-[#1B3D6D] lg:h-16 lg:w-16">
                                    <card.icon size={28} className="lg:size-[32px]" />
                                </div>
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <h4 className="font-['Playfair_Display',serif] text-[22px] font-semibold text-[#1B3D6D] lg:text-[25px] lg:font-normal">
                                        {card.title}
                                    </h4>
                                    <p className="max-w-[250px] font-['Inter',sans-serif] text-[13px] font-medium text-[#1B3D6D] italic opacity-80 lg:max-w-none">
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
