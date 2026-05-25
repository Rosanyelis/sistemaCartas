import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

type ReviewMock = {
    name: string;
    date: string;
    rating: number;
    text: string;
    avatar: string;
};

const MOCK_REVIEWS: ReviewMock[] = [
    {
        name: 'Sabo Masties',
        date: 'Hace 3 horas',
        rating: 5,
        text: 'Lorem ipsum dolor sit amet consectetur. Tortor nec sit nunc auctor etiam magna et...',
        avatar: '/images/person_holding_letter.png',
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

function ReviewNavButton({
    direction,
    disabled,
    onClick,
}: {
    direction: 'prev' | 'next';
    disabled: boolean;
    onClick: () => void;
}): ReactElement {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

    return (
        <button
            type="button"
            aria-label={
                direction === 'prev'
                    ? 'Reseñas anteriores'
                    : 'Reseñas siguientes'
            }
            disabled={disabled}
            onClick={onClick}
            className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#1B3D6D] text-[#1B3D6D] transition hover:bg-[#1B3D6D] hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-[#1B3D6D]"
        >
            <Icon className="size-8" strokeWidth={1.5} />
        </button>
    );
}

/** Bloque Trustpilot (mock) — layout según captura de detalle de historia. */
export function HistoriaTrustpilotReviews(): ReactElement {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback((): void => {
        const el = trackRef.current;

        if (!el) {
            setCanScrollLeft(false);
            setCanScrollRight(false);

            return;
        }

        const maxScroll = el.scrollWidth - el.clientWidth;

        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < maxScroll - 4);
    }, []);

    const scrollReviews = useCallback((direction: -1 | 1): void => {
        const el = trackRef.current;

        if (!el) {
            return;
        }

        const card = el.querySelector<HTMLElement>('[data-review-card]');
        const step = card
            ? card.offsetWidth + 24
            : Math.round(el.clientWidth * 0.85);

        el.scrollBy({ left: direction * step, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const el = trackRef.current;

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
    }, [updateScrollState]);

    return (
        <section className="flex flex-col items-center gap-11 border-b-[0.5px] border-[#F2F2F2] px-4 py-16 lg:px-[72px] lg:py-[70px]">
            <div className="flex w-full max-w-[1296px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="flex flex-col gap-2">
                    <h3 className="font-['Poppins',sans-serif] text-[24px] font-semibold text-[#1B3D6D]">
                        Our customers&apos; Trustpilot reviews
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex gap-1 text-[#FFC800]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} fill="currentColor" />
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

            <div
                ref={trackRef}
                className="flex w-full max-w-[1296px] gap-6 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
            >
                {MOCK_REVIEWS.map((review, i) => (
                    <article
                        key={i}
                        data-review-card
                        className="flex w-[min(85vw,280px)] shrink-0 flex-col gap-4 rounded-[24px] border border-[#F2F2F2] bg-white p-4 shadow-[0px_0px_4px_rgba(0,0,0,0.1)] md:w-[280px] lg:w-[300px]"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={review.avatar}
                                alt=""
                                className="h-[52px] w-[52px] rounded-full object-cover"
                            />
                            <div className="flex min-w-0 flex-col">
                                <span className="font-['Inter',sans-serif] text-[16px] font-semibold text-[#1B3D6D]">
                                    {review.name}
                                </span>
                                <span className="font-['Poppins',sans-serif] text-[13px] text-[#7B7B7B]">
                                    {review.date}
                                </span>
                            </div>
                            <div className="ml-auto flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[4px] bg-[#1DA534] text-white">
                                <Star size={16} fill="currentColor" />
                            </div>
                        </div>
                        <div className="flex gap-1 text-[#FFC800]">
                            {[...Array(review.rating)].map((_, j) => (
                                <Star key={j} size={16} fill="currentColor" />
                            ))}
                        </div>
                        <p className="font-['Inter',sans-serif] text-[15px] leading-[22px] text-[#7B7B7B] lg:text-[16px]">
                            {review.text}
                        </p>
                        <button
                            type="button"
                            className="flex items-center text-[#1B3D6D] transition hover:opacity-70"
                        >
                            <span className="font-['Inter',sans-serif] text-[14px] font-bold">
                                Leer más
                            </span>
                        </button>
                    </article>
                ))}
            </div>

            <div className="flex gap-12">
                <ReviewNavButton
                    direction="prev"
                    disabled={!canScrollLeft}
                    onClick={() => scrollReviews(-1)}
                />
                <ReviewNavButton
                    direction="next"
                    disabled={!canScrollRight}
                    onClick={() => scrollReviews(1)}
                />
            </div>
        </section>
    );
}
