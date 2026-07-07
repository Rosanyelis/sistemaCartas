import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactElement,
} from 'react';

export type MediaItem = {
    url: string;
    type: 'image' | 'video';
    thumbUrl: string;
};

const THUMB_SIZE_PX = 110;
const THUMB_GAP_PX = 16;

function ThumbnailPlayOverlay(): ReactElement {
    return (
        <div
            className="absolute inset-0 flex items-center justify-center bg-black/10"
            aria-hidden
        >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-black/25 text-white backdrop-blur-[2px]">
                <span className="ml-0.5 h-0 w-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent border-l-white" />
            </span>
        </div>
    );
}

function CarouselNavButton({
    direction,
    disabled,
    onClick,
}: {
    direction: 'prev' | 'next';
    disabled: boolean;
    onClick: () => void;
}): ReactElement {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
    const label =
        direction === 'prev'
            ? 'Ver miniaturas anteriores'
            : 'Ver miniaturas siguientes';

    return (
        <button
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8E8E8] bg-white text-[#1B3D6D] shadow-[0px_2px_6px_rgba(0,0,0,0.08)] transition hover:bg-[#F5F5FF] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white lg:h-11 lg:w-11"
        >
            <Icon className="size-5" strokeWidth={2} />
        </button>
    );
}

export function HistoriaHeroMedia({
    media,
    tituloHistoria,
}: {
    media: MediaItem[];
    tituloHistoria: string;
}): ReactElement {
    const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
    const [heroVideoPlaying, setHeroVideoPlaying] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const thumbStripRef = useRef<HTMLDivElement>(null);
    const thumbButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const idx = Math.min(activeThumbnailIndex, Math.max(0, media.length - 1));
    const active = media[idx];
    const altPrincipal =
        active.type === 'video'
            ? `Vista previa del vídeo — ${tituloHistoria}`
            : `Imagen — ${tituloHistoria}`;

    const updateScrollState = useCallback((): void => {
        const el = thumbStripRef.current;

        if (!el) {
            setCanScrollLeft(false);
            setCanScrollRight(false);

            return;
        }

        const maxScroll = el.scrollWidth - el.clientWidth;

        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < maxScroll - 4);
    }, []);

    const scrollThumbs = useCallback((direction: -1 | 1): void => {
        const el = thumbStripRef.current;

        if (!el) {
            return;
        }

        el.scrollBy({
            left: direction * (THUMB_SIZE_PX + THUMB_GAP_PX),
            behavior: 'smooth',
        });
    }, []);

    const selectThumbnail = useCallback((i: number): void => {
        videoRef.current?.pause();
        setActiveThumbnailIndex(i);
        setHeroVideoPlaying(false);
    }, []);

    useEffect(() => {
        const el = thumbStripRef.current;

        if (!el) {
            return;
        }

        updateScrollState();
        el.addEventListener('scroll', updateScrollState, { passive: true });
        window.addEventListener('resize', updateScrollState);

        return () => {
            el.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, [media.length, updateScrollState]);

    useEffect(() => {
        thumbButtonRefs.current[idx]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
        });
    }, [idx]);

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
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : null}

                {active.type === 'video' && !heroVideoPlaying ? (
                    <>
                        <img
                            src={active.thumbUrl}
                            alt={altPrincipal}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                            type="button"
                            aria-label="Reproducir vídeo"
                            onClick={() => setHeroVideoPlaying(true)}
                            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/20 transition-opacity group-hover:bg-black/35"
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

            <div className="flex items-center gap-2 lg:gap-3">
                <CarouselNavButton
                    direction="prev"
                    disabled={!canScrollLeft}
                    onClick={() => scrollThumbs(-1)}
                />

                <div
                    ref={thumbStripRef}
                    className="scrollbar-hide flex min-w-0 flex-1 gap-4 overflow-x-auto scroll-smooth pb-1"
                >
                    {media.map((item, i) => {
                        const altMini =
                            item.type === 'video'
                                ? `Miniatura de vídeo (${i + 1} de ${media.length}) — ${tituloHistoria}`
                                : `Miniatura de imagen (${i + 1} de ${media.length}) — ${tituloHistoria}`;
                        const isActive = idx === i;

                        return (
                            <button
                                key={i}
                                ref={(node) => {
                                    thumbButtonRefs.current[i] = node;
                                }}
                                type="button"
                                onClick={() => selectThumbnail(i)}
                                aria-label={altMini}
                                aria-current={isActive ? 'true' : undefined}
                                className={`relative h-[80px] w-[80px] min-w-[80px] shrink-0 overflow-hidden rounded-[2px] transition duration-300 lg:h-[110px] lg:w-[110px] lg:min-w-[110px] ${
                                    isActive
                                        ? 'opacity-100 ring-2 ring-[#1B3D6D]'
                                        : 'opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img
                                    src={item.thumbUrl}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                                {item.type === 'video' ? (
                                    <ThumbnailPlayOverlay />
                                ) : null}
                            </button>
                        );
                    })}
                </div>

                <CarouselNavButton
                    direction="next"
                    disabled={!canScrollRight}
                    onClick={() => scrollThumbs(1)}
                />
            </div>
        </div>
    );
}
