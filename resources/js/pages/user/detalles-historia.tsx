import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { PageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
import { Check, ShieldCheck, Package, CalendarX, Quote } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import CartConflictModal from '@/components/tienda/CartConflictModal';
import {
    HistoriaHeroMedia,
    type MediaItem,
} from '@/components/tienda/HistoriaHeroMedia';
import { HistoriaTrustpilotReviews } from '@/components/tienda/HistoriaTrustpilotReviews';
import ClienteLayout from '@/layouts/cliente-layout';
import { useCart } from '@/contexts/cart-context';
import { HISTORIA_SUSCRIPCION_SUBTITLE } from '@/types/cart-line';
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
    precio_suscripcion: string | null;
    duracion_meses: number | null;
    /** Precio por ciclo de suscripción sin IVA (base catálogo) */
    subscription_unit_price: string;
    /** Cobro recurrente PayPal por ciclo (IVA incluido) */
    subscription_charge_unit_price: string;
    /** Opciones públicas (papel, color, etc.) */
    variantes: { tipo: string; valor: string }[];
    galeria: { id: number; path: string; tipo: string; es_principal: boolean }[];
}

type DetalleHistoriaPageProps = PageProps & {
    historia: HistoriaPublicaDetalle;
};

const STORY_COVER_FALLBACK = '/images/story_cover.png';

function parseSubscriptionUnitPrice(
    raw: string | number | null | undefined,
): number {
    if (typeof raw === 'number' && Number.isFinite(raw)) {
        return raw;
    }

    const normalized = String(raw ?? '')
        .trim()
        .replace(/\s/g, '')
        .replace(',', '.');

    const n = Number.parseFloat(normalized);

    return Number.isFinite(n) ? n : 0;
}

/** URL para poster/miniaturas de ítems vídeo: imagen principal o placeholder del proyecto. */
function posterThumbUrl(h: HistoriaPublicaDetalle): string {
    const src = h.imagen?.trim();

    return src && src !== '' ? src : STORY_COVER_FALLBACK;
}

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

export default function DetalleHistoria({
    historia: historiaProp,
}: DetalleHistoriaPageProps) {
    const pageProps = usePage<DetalleHistoriaPageProps>().props;
    const historia = historiaProp ?? pageProps.historia;

    const media = useMemo(() => buildMediaFromHistoria(historia), [historia]);

    const [isExpanded, setIsExpanded] = useState(false);

    const incluyeCadaEnvio = useMemo(() => {
        const raw = historia.detalle;

        if (!Array.isArray(raw) || raw.length === 0) {
            return [];
        }

        return raw.filter((x) => x && typeof x.title === 'string' && x.title.trim() !== '');
    }, [historia.detalle]);

    const tituloPagina = `${historia.nombre} | Historias por Correo`;

    const { addHistoriaSuscripcion, openCart } = useCart();
    const [cartConflictOpen, setCartConflictOpen] = useState(false);
    const pendingHistoriaSubRef = useRef<{
        slug: string;
        name: string;
        subtitle: string;
        price: number;
        image: string;
        duracion_meses: number;
        badge: string;
    } | null>(null);

    const handleAddSuscripcion = useCallback(() => {
        const dur =
            typeof historia.duracion_meses === 'number' &&
            !Number.isNaN(historia.duracion_meses)
                ? historia.duracion_meses
                : 1;
        const price = parseSubscriptionUnitPrice(historia.subscription_unit_price);
        const cover = posterThumbUrl(historia);

        const payload = {
            slug: historia.slug,
            name: historia.nombre,
            subtitle: HISTORIA_SUSCRIPCION_SUBTITLE,
            price,
            image: cover,
            duracion_meses: dur,
            badge: 'Suscripción',
        };

        const ok = addHistoriaSuscripcion(payload);
        if (!ok) {
            pendingHistoriaSubRef.current = payload;
            setCartConflictOpen(true);

            return;
        }
        openCart({ view: 'cart' });
    }, [addHistoriaSuscripcion, historia, openCart]);

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
                            <button
                                type="button"
                                onClick={handleAddSuscripcion}
                                className="flex h-[47px] w-full items-center justify-center rounded-[2px] border border-[#1B3D6D] bg-[#1B3D6D] px-5 py-[14px] text-white transition hover:bg-[#1B3D6D]/90"
                            >
                                <span className="font-['Inter',sans-serif] text-base font-semibold">
                                    Suscribirme a esta historia
                                </span>
                            </button>
                            <p className="font-['Inter',sans-serif] text-[11px] leading-relaxed text-[#7B7B7B]">
                                El carrito no permite mezclar suscripciones con
                                productos del catálogo: si ya tienes productos,
                                te pediremos confirmación para reemplazarlos.
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-8">
                                <div className="flex items-center gap-2">
                                    <Check
                                        size={18}
                                        strokeWidth={2.5}
                                        className="shrink-0 text-[#1B3D6D]"
                                    />
                                    <span className="font-['Inter',sans-serif] text-[13px] font-normal text-[#1B3D6D]">
                                        Cancelable en cualquier momento
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check
                                        size={18}
                                        strokeWidth={2.5}
                                        className="shrink-0 text-[#1B3D6D]"
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
                    <section className="flex flex-col gap-10 border-b-[0.5px] border-[#F2F2F2] px-4 py-12 lg:gap-11 lg:px-[72px] lg:py-[70px]">
                        <div className="mx-auto flex w-full max-w-[1208px] flex-col items-start gap-2">
                            <h2 className="font-['Playfair_Display',serif] text-[32px] font-semibold text-[#1B3D6D] lg:text-[39px]">
                                Sinopsis de la historia
                            </h2>
                            <div className="h-1 w-[250px] rounded-full bg-[#1B3D6D]" />
                        </div>

                        <div className="mx-auto flex w-full max-w-[1208px] flex-col items-center gap-8">
                            <div className="relative flex w-full items-start gap-4 lg:gap-10">
                                <Quote
                                    size={32}
                                    className="shrink-0 text-[#1B3D6D] lg:mt-2 lg:size-[44px]"
                                    aria-hidden
                                />
                                <div
                                    className={`relative min-w-0 flex-1 overflow-hidden transition-all duration-500 font-['Inter',sans-serif] ${!isExpanded ? 'max-h-[220px] lg:max-h-[280px]' : 'max-h-[3000px]'}`}
                                >
                                    {!isExpanded ? (
                                        <div
                                            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-white to-transparent"
                                            aria-hidden
                                        />
                                    ) : null}
                                    <div
                                        className="prose prose-neutral max-w-none text-[15px] font-normal leading-relaxed text-[#7B7B7B] lg:text-[20px] lg:leading-[28px]"
                                        dangerouslySetInnerHTML={{
                                            __html: historia.descripcion_larga,
                                        }}
                                    />
                                    <div className="mt-6 flex justify-end">
                                        <Quote
                                            size={32}
                                            className="rotate-180 text-[#1B3D6D] lg:size-[44px]"
                                            aria-hidden
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-3 text-[#1B3D6D] transition-colors hover:opacity-80"
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

                    <HistoriaTrustpilotReviews />

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
                                    <p className="max-w-[250px] font-['Inter',sans-serif] text-[13px] font-medium text-[#1B3D6D] opacity-80 lg:max-w-none">
                                        {card.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
            <CartConflictModal
                open={cartConflictOpen}
                title="Tu carrito tiene productos"
                description="No es posible combinar productos y suscripciones en el mismo carrito. Si continúas, se vaciarán los productos y se añadirá esta suscripción."
                confirmLabel="Vaciar productos y añadir suscripción"
                onCancel={() => {
                    setCartConflictOpen(false);
                    pendingHistoriaSubRef.current = null;
                }}
                onConfirm={() => {
                    const payload = pendingHistoriaSubRef.current;
                    if (payload) {
                        addHistoriaSuscripcion(payload, {
                            replaceOtherKind: true,
                        });
                    }
                    pendingHistoriaSubRef.current = null;
                    setCartConflictOpen(false);
                    openCart({ view: 'cart' });
                }}
            />
        </ClienteLayout>
    );
}
