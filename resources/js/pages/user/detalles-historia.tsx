import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Package, CalendarX, Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ClienteLayout from '@/layouts/cliente-layout';
import { inclusionIconOrFallback } from '@/lib/historia-detalle-inclusion-lucide-map';

export interface HistoriaPublicaDetalle {
    nombre: string;
    slug: string;
    categoria: string;
    descripcion_corta: string;
    descripcion_larga: string;
    detalle: { icon: string; title: string; description?: string | null }[];
    imagen: string | null;
    video: string | null;
    precio_base: string;
    precio_promocional: string | null;
    /** Opciones públicas (papel, color, etc.) */
    variantes: { tipo: string; valor: string }[];
    galeria: { id: number; path: string; tipo: string; es_principal: boolean }[];
}

interface DetalleHistoriaPageProps {
    historia: HistoriaPublicaDetalle;
}

const STORY_COVER_FALLBACK = '/images/story_cover.png';

/** URL para poster/miniaturas de ítems vídeo: imagen principal o placeholder del proyecto. */
function posterThumbUrl(h: HistoriaPublicaDetalle): string {
    const src = h.imagen?.trim();

    return src && src !== '' ? src : STORY_COVER_FALLBACK;
}

export type MediaItem = {
    url: string;
    type: 'image' | 'video';
    /** Siempre válida para `<img>` (vídeo → imagen principal o fallback). */
    thumbUrl: string;
};

function buildMediaFromHistoria(h: HistoriaPublicaDetalle): MediaItem[] {
    const out: MediaItem[] = [];
    const videoPoster = posterThumbUrl(h);

    const push = (url: string | null | undefined, type: 'image' | 'video'): void => {
        if (!url) {
            return;
        }

        const thumbUrl = type === 'video' ? videoPoster : url;

        out.push({ url, type, thumbUrl });
    };

    push(h.video, 'video');
    push(h.imagen, 'image');
    (h.galeria ?? []).forEach((g) => {
        if (!g.path || g.es_principal) {
            return;
        }

        push(g.path, g.tipo === 'video' ? 'video' : 'image');
    });

    if (out.length === 0) {
        return [
            {
                url: STORY_COVER_FALLBACK,
                type: 'image',
                thumbUrl: STORY_COVER_FALLBACK,
            },
        ];
    }

    return out;
}

function HistoriaHeroMedia({
    media,
    tituloHistoria,
}: {
    media: MediaItem[];
    tituloHistoria: string;
}) {
    const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
    const [heroVideoPlaying, setHeroVideoPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const idx = Math.min(activeThumbnailIndex, Math.max(0, media.length - 1));
    const active = media[idx];
    const altPrincipal =
        active.type === 'video'
            ? `Vista previa del vídeo — ${tituloHistoria}`
            : `Imagen — ${tituloHistoria}`;

    const selectThumbnail = useCallback((i: number): void => {
        videoRef.current?.pause();
        setActiveThumbnailIndex(i);
        setHeroVideoPlaying(false);
    }, []);

    useEffect(() => {
        if (!heroVideoPlaying || active.type !== 'video') {
            return;
        }

        const el = videoRef.current;

        if (!el) {
            return;
        }

        el.play().catch(() => {});

        return () => {
            el.pause();
        };
    }, [heroVideoPlaying, active.type, active.url]);

    return (
        <div className="flex w-full flex-col gap-4 lg:w-[600px]">
            <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[2px] bg-[#242424] shadow-[0px_3px_8px_rgba(0,0,0,0.15)] lg:aspect-[600/462]">
                {active.type === 'image' ? (
                    <img
                        src={active.thumbUrl}
                        alt={altPrincipal}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : null}

                {active.type === 'video' && !heroVideoPlaying ? (
                    <>
                        <img
                            src={active.thumbUrl}
                            alt={altPrincipal}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button
                            type="button"
                            aria-label="Reproducir vídeo"
                            onClick={() => setHeroVideoPlaying(true)}
                            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/20 opacity-100 transition-opacity group-hover:bg-black/40"
                        >
                            <span
                                aria-hidden
                                className="pointer-events-none flex h-[75px] w-[75px] items-center justify-center rounded-full border-[2.5px] border-white bg-transparent text-white backdrop-blur-[2px] transition-transform duration-300 group-hover:scale-110 lg:h-[95px] lg:w-[95px]"
                            >
                                <span
                                    aria-hidden
                                    className="ml-1 flex h-0 w-0 border-t-[12px] border-b-[12px] border-l-20 border-t-transparent border-b-transparent border-l-white lg:border-t-[15px] lg:border-b-[15px] lg:border-l-[25px]"
                                />
                            </span>
                        </button>
                    </>
                ) : null}

                {active.type === 'video' && heroVideoPlaying ? (
                    <video
                        ref={videoRef}
                        key={active.url}
                        src={active.url}
                        poster={active.thumbUrl}
                        controls
                        playsInline
                        className="absolute inset-0 z-20 h-full w-full object-cover"
                    />
                ) : null}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide lg:justify-between lg:overflow-visible lg:pb-0">
                {media.map((item, i) => {
                    const altMini =
                        item.type === 'video'
                            ? `Miniatura de vídeo (${i + 1} de ${media.length}) — ${tituloHistoria}`
                            : `Miniatura de imagen (${i + 1} de ${media.length}) — ${tituloHistoria}`;

                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => selectThumbnail(i)}
                            className={`relative h-[80px] w-[80px] min-w-[80px] shrink-0 overflow-hidden rounded-[2px] transition duration-300 lg:h-[110px] lg:w-full lg:min-w-[110px] lg:flex-1 ${idx === i ? 'ring-2 ring-[#1B3D6D] ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                        >
                            <img
                                src={item.thumbUrl}
                                alt={altMini}
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
                    );
                })}
            </div>
        </div>
    );
}

export default function DetalleHistoria({ historia }: DetalleHistoriaPageProps) {
    const media = useMemo(() => buildMediaFromHistoria(historia), [historia]);

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

    const incluyeCadaEnvio = useMemo(() => {
        const raw = historia.detalle;

        if (!Array.isArray(raw) || raw.length === 0) {
            return [];
        }

        return raw.filter((x) => x && typeof x.title === 'string' && x.title.trim() !== '');
    }, [historia.detalle]);

    const tituloPagina = `${historia.nombre} | Historias por Correo`;

    return (
        <ClienteLayout>
            <Head>
                {[
                    <title key="title">{tituloPagina}</title>,
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
                        <HistoriaHeroMedia
                            key={historia.slug}
                            media={media}
                            tituloHistoria={historia.nombre}
                        />

                        {/* Product Info Column */}
                        <div className="flex w-full flex-1 flex-col gap-6 lg:max-w-[624px]">
                            {/* Breadcrumbs & Badge */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <nav className="flex items-center gap-2 font-['Inter',sans-serif] text-[13px] font-semibold text-[#1E3E6C]">
                                    <Link href="/historias">Colecciones</Link>
                                    <span className="text-[#A4A4A4]">/</span>
                                    <span>{historia.categoria}</span>
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
                                    {historia.nombre}
                                </h1>
                                <p className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-[#7B7B7B]">
                                    {historia.descripcion_corta}
                                </p>
                            </div>

                            {/* Prices Box */}
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-col items-center justify-center gap-2 rounded-[2px] bg-[#F5F5FF] py-4 lg:h-[53px] lg:flex-row lg:gap-4 lg:py-0">
                                    {historia.precio_promocional ? (
                                        <span className="font-['Playfair_Display',serif] text-[28px] font-normal text-[#7B7B7B] line-through lg:text-[32px]">
                                            ${historia.precio_base}
                                        </span>
                                    ) : null}
                                    <span className="font-['Playfair_Display',serif] text-[32px] font-bold text-[#1B3D6D] lg:font-normal">
                                        ${historia.precio_promocional ?? historia.precio_base}
                                    </span>
                                </div>
                                <span className="text-center font-['Inter',sans-serif] text-[15px] font-normal text-[#1B3D6D] lg:text-[16px]">
                                    Por entrega mensual
                                </span>
                            </div>

                            {historia.variantes.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {historia.variantes.map((v, i) => (
                                        <span
                                            key={`${v.tipo}-${v.valor}-${i}`}
                                            className="rounded-[2px] border border-[#E8E8E8] bg-[#FAFAFA] px-3 py-1 font-['Inter',sans-serif] text-[12px] font-medium text-[#1B3D6D] capitalize"
                                        >
                                            {v.tipo}: {v.valor}
                                        </span>
                                    ))}
                                </div>
                            ) : null}

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

                            {/* What's Included (desde `historia.detalle` JSON) */}
                            {incluyeCadaEnvio.length > 0 ? (
                                <div className="flex flex-col gap-6">
                                    <h3 className="font-['Inter',sans-serif] text-[20px] font-semibold text-[#1E3E6C]">
                                        ¿Qué incluye cada envío?
                                    </h3>
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                                        {incluyeCadaEnvio.map((item, i) => {
                                            const Icon = inclusionIconOrFallback(item.icon);
                                            const desc =
                                                typeof item.description === 'string' &&
                                                item.description.trim() !== '';

                                            return (
                                                <div
                                                    key={`${item.icon}-${i}-${item.title}`}
                                                    className="flex items-start gap-3"
                                                >
                                                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-[#1B3D6D]">
                                                        <Icon size={20} />
                                                    </div>
                                                    <div className="flex min-w-0 flex-col gap-0.5">
                                                        <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#1B3D6D]">
                                                            {item.title}
                                                        </span>
                                                        {desc ? (
                                                            <span className="font-['Inter',sans-serif] text-[12px] font-normal leading-snug text-[#7B7B7B]">
                                                                {item.description}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : null}
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
                                    <div
                                        className="prose prose-neutral max-w-none text-[15px] font-normal leading-relaxed text-[#7B7B7B] lg:text-[20px] lg:leading-[28px]"
                                        dangerouslySetInnerHTML={{ __html: historia.descripcion_larga }}
                                    />

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
