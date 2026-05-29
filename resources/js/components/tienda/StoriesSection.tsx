import { Link } from '@inertiajs/react';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import { show } from '@/routes/historias';
import type { Story } from '@/types/welcome';

interface StoriesSectionProps {
    stories: Story[];
}

const LG_MEDIA_QUERY = '(min-width: 1024px)';

function subscribeLg(callback: () => void): () => void {
    if (typeof window === 'undefined') {
        return () => {};
    }

    const mql = window.matchMedia(LG_MEDIA_QUERY);
    mql.addEventListener('change', callback);

    return () => mql.removeEventListener('change', callback);
}

function getLgSnapshot(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia(LG_MEDIA_QUERY).matches;
}

function useIsLgViewport(): boolean {
    return useSyncExternalStore(subscribeLg, getLgSnapshot, () => false);
}

function StoriesSectionHeader() {
    return (
        <div className="flex w-full max-w-[1296px] flex-col items-center gap-4 px-3 lg:gap-4 lg:px-[72px]">
            <h2 className="text-center font-['Playfair_Display',serif] text-[40px] font-semibold text-[#1B3D6D] lg:text-[49px] lg:leading-[65px]">
                Historias
            </h2>
            <div className="h-[4px] w-[200px] rounded-[4px] bg-[#1B3D6D] lg:w-[250px]" />
        </div>
    );
}

type StoryHighlightCardProps = {
    story: Story;
    variant: 'mobile' | 'slider';
};

function StoryHighlightCard({ story, variant }: StoryHighlightCardProps) {
    const isMobile = variant === 'mobile';

    return (
        <div
            className={cn(
                'group relative shrink-0 overflow-hidden rounded-[4px] bg-black',
                isMobile
                    ? 'h-[540px] w-full'
                    : 'h-[450px] w-[calc(100vw-48px)] max-w-[700px] lg:h-[540px] lg:w-[700px]',
            )}
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${story.img}')` }}
            />

            <div className="absolute top-[18px] right-6 flex items-center justify-center rounded-[2px] bg-[#1B3D6D] px-[10px] py-[3px]">
                <span className="font-['Inter',sans-serif] text-[13px] leading-[16px] font-normal text-white">
                    Suscripción disponible
                </span>
            </div>

            <div
                className={cn(
                    'absolute bottom-0 left-0 flex w-full flex-col items-start bg-black/65',
                    isMobile
                        ? 'gap-6 px-3 py-4'
                        : 'gap-6 px-6 py-4 lg:h-[216px]',
                )}
            >
                <div className="flex w-full flex-col items-start gap-2">
                    <h3
                        className={cn(
                            "font-['Playfair_Display',serif] font-semibold text-white",
                            isMobile
                                ? 'text-[25px] leading-[28px]'
                                : 'text-[20px] leading-[33px] lg:text-[25px]',
                        )}
                    >
                        {story.title}
                    </h3>
                    <p
                        className={cn(
                            "font-['Inter',sans-serif] font-normal text-white",
                            isMobile
                                ? 'text-[13px] leading-normal'
                                : 'line-clamp-3 text-[14px] leading-[22px] lg:line-clamp-2 lg:text-[16px]',
                        )}
                    >
                        {story.desc}
                    </p>
                    <h4
                        className={cn(
                            "mt-1 font-['Playfair_Display',serif] font-bold text-white",
                            isMobile ? 'text-[22px] leading-normal' : 'text-[20px] leading-[29px] lg:text-[22px]',
                        )}
                    >
                        {story.price}{' '}
                        <span
                            className={cn(
                                'font-normal',
                                isMobile
                                    ? "font-['Inter',sans-serif] text-[16px] text-white/50"
                                    : 'text-sm',
                            )}
                        >
                            por entrega
                        </span>
                    </h4>
                </div>

                <Link
                    href={show.url(story.slug)}
                    className="flex h-[39px] w-[139px] items-center justify-center rounded-[2px] border border-white bg-white/20 px-5 py-[10px] transition-colors duration-300 group-hover:bg-white/30 hover:bg-white hover:text-[#1B3D6D]"
                >
                    <span className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold text-white transition-colors duration-300 group-hover:text-[#111]">
                        Ver historia
                    </span>
                </Link>
            </div>
        </div>
    );
}

function StoriesMobileList({ stories }: { stories: Story[] }) {
    return (
        <div className="flex w-full max-w-[1296px] flex-col items-center gap-11 px-3">
            <div className="flex w-full flex-col gap-8">
                {stories.map((story) => (
                    <StoryHighlightCard
                        key={story.slug}
                        story={story}
                        variant="mobile"
                    />
                ))}
            </div>

            <Link
                href="/historias"
                className="flex items-center justify-center rounded-[2px] bg-[#1B3D6D] px-5 py-[10px] font-['Inter',sans-serif] text-[16px] font-semibold text-white transition hover:bg-[#1B3D6D]/90"
            >
                Ver todas las historias
            </Link>
        </div>
    );
}

function StoriesDesktopSlider({ stories }: { stories: Story[] }) {
    const baseStories = stories;
    const extendedStories = Array(20).fill(baseStories).flat();
    const START_INDEX = baseStories.length * 10;

    const [activeStorySlide, setActiveStorySlide] = useState(START_INDEX);
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isTransitioning) {
                setIsTransitioning(true);
            }

            setActiveStorySlide((prev) => prev + 1);
        }, 6000);

        return () => clearTimeout(timer);
    }, [activeStorySlide, isTransitioning]);

    const handleNextStory = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
        }

        setActiveStorySlide((prev) => prev + 1);
    };

    const handlePrevStory = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
        }

        setActiveStorySlide((prev) => prev - 1);
    };

    const handleTransitionEnd = () => {
        if (
            activeStorySlide <= baseStories.length ||
            activeStorySlide >= extendedStories.length - baseStories.length
        ) {
            setIsTransitioning(false);
            const middleIndex =
                START_INDEX + (activeStorySlide % baseStories.length);
            setActiveStorySlide(middleIndex);
        }
    };

    return (
        <>
            <div className="relative w-full overflow-hidden py-4">
                <div
                    className={`flex flex-row items-center gap-8 ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                    style={{
                        transform: `translateX(calc(50vw - (min(100vw - 48px, 700px) / 2) - ${activeStorySlide} * (min(100vw - 48px, 700px) + 32px)))`,
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {extendedStories.map((story, i) => (
                        <div
                            key={`${story.slug}-${i}`}
                            className={`shrink-0 ${
                                isTransitioning
                                    ? 'transition-opacity duration-500'
                                    : ''
                            } ${
                                activeStorySlide !== i
                                    ? 'opacity-60 grayscale-[30%]'
                                    : 'opacity-100 grayscale-0'
                            }`}
                        >
                            <StoryHighlightCard
                                story={story}
                                variant="slider"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="z-10 mt-4 flex flex-col items-center gap-5">
                <div className="flex flex-row items-center gap-12">
                    <button
                        type="button"
                        onClick={handlePrevStory}
                        className="group flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D]"
                        aria-label="Historia anterior"
                    >
                        <svg
                            className="h-6 w-6 text-[#1B3D6D] group-hover:text-white"
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
                        type="button"
                        onClick={handleNextStory}
                        className="group flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D]"
                        aria-label="Historia siguiente"
                    >
                        <svg
                            className="h-6 w-6 text-[#1B3D6D] group-hover:text-white"
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
            </div>
        </>
    );
}

function StoriesEmpty() {
    return (
        <section
            id="historias"
            className="flex w-full flex-col items-center justify-center bg-[#FFFCF4] py-12 lg:py-[70px]"
        >
            <div className="flex w-full max-w-[1296px] flex-col items-center gap-6 px-3 text-center lg:px-[72px]">
                <h2 className="font-['Playfair_Display',serif] text-[40px] font-semibold text-[#1B3D6D] lg:text-[49px]">
                    Historias
                </h2>
                <div className="h-[4px] w-[200px] rounded-[4px] bg-[#1B3D6D] lg:w-[250px]" />
                <p className="max-w-xl font-['Inter',sans-serif] text-[16px] leading-relaxed text-[#7B7B7B]">
                    Pronto publicaremos historias destacadas aquí. Mientras tanto, explorá el catálogo
                    completo.
                </p>
                <Link
                    href="/historias"
                    className="flex items-center justify-center rounded-[2px] bg-[#1B3D6D] px-5 py-[10px] font-['Inter',sans-serif] text-[16px] font-semibold text-white transition hover:bg-[#1B3D6D]/90"
                >
                    Ver todas las historias
                </Link>
            </div>
        </section>
    );
}

function StoriesSectionContent({ stories }: { stories: Story[] }) {
    const isLgViewport = useIsLgViewport();
    const mobileStories = stories.slice(0, 3);

    return (
        <section
            id="historias"
            className="flex w-full flex-col items-center justify-center overflow-hidden bg-[#FFFCF4] py-12 lg:h-[913px] lg:py-[70px]"
        >
            <div className="flex w-full flex-col items-center gap-11 lg:gap-[44px]">
                <StoriesSectionHeader />

                <div className="w-full lg:hidden">
                    <StoriesMobileList stories={mobileStories} />
                </div>

                {isLgViewport ? (
                    <div className="hidden w-full lg:block">
                        <StoriesDesktopSlider stories={stories} />
                    </div>
                ) : null}
            </div>
        </section>
    );
}

export default function StoriesSection({ stories }: StoriesSectionProps) {
    if (stories.length === 0) {
        return <StoriesEmpty />;
    }

    return <StoriesSectionContent stories={stories} />;
}
