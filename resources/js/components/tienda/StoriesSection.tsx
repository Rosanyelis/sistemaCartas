import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import type { Story } from '@/types/welcome';

interface StoriesSectionProps {
    stories: Story[];
}

export default function StoriesSection({ stories }: StoriesSectionProps) {
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
        <section
            id="historias"
            className="flex w-full flex-col items-center justify-center overflow-hidden bg-[#FFFCF4] py-20 lg:h-[913px] lg:py-[70px]"
        >
            <div className="flex w-full flex-col items-center gap-[44px]">
                {/* Header */}
                <div className="flex w-full max-w-[1296px] flex-col items-center gap-4 px-6 lg:px-[72px]">
                    <h2 className="text-center font-['Playfair_Display',serif] text-[32px] leading-[65px] font-semibold text-[#1B3D6D] md:text-[49px]">
                        Historias
                    </h2>
                    <div className="h-[4px] w-[150px] rounded-[4px] bg-[#1B3D6D] md:w-[250px]"></div>
                </div>

                {/* Slider Content - Full bleed container */}
                <div className="relative w-full overflow-hidden py-4">
                    {/* Cards Track */}
                    <div
                        className={`flex flex-row items-center gap-8 ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                        style={{
                            transform: `translateX(calc(50vw - (min(100vw - 48px, 700px) / 2) - ${activeStorySlide} * (min(100vw - 48px, 700px) + 32px)))`,
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {extendedStories.map((story, i) => (
                            <div
                                key={i}
                                className={`group relative h-[450px] w-[calc(100vw-48px)] max-w-[700px] shrink-0 overflow-hidden rounded-[4px] bg-black lg:h-[540px] lg:w-[700px] ${
                                    isTransitioning
                                        ? 'transition-opacity duration-500'
                                        : ''
                                } ${
                                    activeStorySlide !== i
                                        ? 'opacity-60 grayscale-[30%]'
                                        : 'opacity-100 grayscale-0'
                                }`}
                            >
                                {/* Imagen de fondo */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{
                                        backgroundImage: `url('${story.img}')`,
                                    }}
                                ></div>

                                {/* Badge */}
                                <div className="absolute top-[18px] right-6 flex items-center justify-center rounded-[2px] bg-[#1B3D6D] px-[10px] py-[3px]">
                                    <span className="font-['Inter',sans-serif] text-[13px] leading-[16px] font-normal text-white">
                                        Suscripción disponible
                                    </span>
                                </div>

                                {/* Degradado e info */}
                                <div className="absolute bottom-0 left-0 flex w-full flex-col items-start gap-6 bg-black/65 px-6 py-4 lg:h-[216px]">
                                    <div className="flex w-full flex-col items-start gap-2">
                                        <h3 className="font-['Playfair_Display',serif] text-[20px] leading-[33px] font-semibold text-white lg:text-[25px]">
                                            {story.title}
                                        </h3>
                                        <p className="line-clamp-3 font-['Inter',sans-serif] text-[14px] leading-[22px] font-normal text-white lg:line-clamp-2 lg:text-[16px]">
                                            {story.desc}
                                        </p>
                                        <h4 className="mt-1 font-['Playfair_Display',serif] text-[20px] leading-[29px] font-bold text-white lg:text-[22px]">
                                            {story.price}{' '}
                                            <span className="text-sm font-normal">
                                                por entrega
                                            </span>
                                        </h4>
                                    </div>

                                    <button className="flex h-[39px] w-[139px] items-center justify-center rounded-[2px] border border-white bg-white/20 px-5 py-[10px] transition-colors duration-300 group-hover:bg-white/30 hover:bg-white hover:text-[#1B3D6D]">
                                        <span className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold text-white transition-colors duration-300 group-hover:text-[#111]">
                                            Ver historia
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slider Controls */}
                <div className="z-10 mt-4 flex flex-col items-center gap-5">
                    <div className="flex flex-row items-center gap-10 lg:gap-12">
                        <button
                            onClick={handlePrevStory}
                            className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] lg:h-[60px] lg:w-[60px]"
                        >
                            <svg
                                className="h-5 w-5 text-[#1B3D6D] group-hover:text-white lg:h-6 lg:w-6"
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
                            onClick={handleNextStory}
                            className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] lg:h-[60px] lg:w-[60px]"
                        >
                            <svg
                                className="h-5 w-5 text-[#1B3D6D] group-hover:text-white lg:h-6 lg:w-6"
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
                    {/* Botón CTA mobile */}
                    <Link
                        href="#historias"
                        className="flex h-[39px] items-center justify-center rounded-[2px] bg-[#1B3D6D] px-5 lg:hidden"
                    >
                        <span className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold text-white">
                            Ver todas las historias
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
