import { Link } from '@inertiajs/react';
import { useCallback, useRef } from 'react';
import { show } from '@/routes/historias';
import type { Story } from '@/types/welcome';

interface FeaturedStoriesSectionProps {
    stories: Story[];
}

export default function FeaturedStoriesSection({
    stories,
}: FeaturedStoriesSectionProps) {
    const scrollerRef = useRef<HTMLDivElement>(null);

    const scrollByCards = useCallback((dir: -1 | 1) => {
        const el = scrollerRef.current;

        if (!el) {
            return;
        }

        const card = el.querySelector<HTMLElement>('[data-feature-card]');
        const delta = card ? card.offsetWidth + 24 : 320;

        el.scrollBy({ left: dir * delta, behavior: 'smooth' });
    }, []);

    if (stories.length === 0) {
        return null;
    }

    return (
        <section className="flex w-full flex-col items-center justify-center bg-white px-6 pt-[50px] pb-20 lg:px-[72px] lg:pt-0 lg:pb-[70px]">
            <div className="flex w-full max-w-[1296px] flex-col items-center gap-[44px]">
                <div className="flex w-full flex-col items-center gap-1 text-center lg:items-start lg:text-left">
                    <h2 className="font-['Playfair_Display',serif] text-[36px] leading-[1.1] font-semibold text-[#1B3D6D] lg:text-[39px] lg:leading-[52px]">
                        Historias
                        <br className="lg:hidden" /> destacadas
                    </h2>
                    <p className="font-['Inter',sans-serif] text-[14px] leading-[20px] font-normal text-[#7B7B7B] lg:text-[16px] lg:leading-[22px]">
                        Favoritas de nuestros usuarios
                    </p>
                </div>

                <div className="relative w-full">
                    <div
                        ref={scrollerRef}
                        className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-0 scrollbar-hide lg:gap-8"
                        tabIndex={0}
                        aria-label="Historias destacadas"
                    >
                        {stories.map((story) => (
                            <div
                                key={story.slug}
                                data-feature-card
                                className="group relative flex h-[460px] w-[min(100%,340px)] shrink-0 snap-center flex-col overflow-hidden rounded-[4px] bg-black sm:w-[min(100%,400px)] lg:h-[480px] lg:w-[min(100%,520px)]"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{
                                        backgroundImage: `url('${story.img}')`,
                                    }}
                                ></div>
                                <div className="absolute top-[18px] right-6 flex items-center justify-center rounded-[2px] bg-[#1B3D6D] px-[10px] py-[3px]">
                                    <span className="font-['Inter',sans-serif] text-[13px] leading-[16px] font-normal text-white">
                                        Suscripción disponible
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 flex w-full flex-col items-start justify-center gap-4 bg-[rgba(0,0,0,0.65)] px-6 py-4 lg:min-h-[216px]">
                                    <div className="flex w-full flex-col items-start gap-2">
                                        <h3 className="font-['Playfair_Display',serif] text-[25px] leading-[33px] font-semibold text-white">
                                            {story.title}
                                        </h3>
                                        <p className="line-clamp-2 font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white">
                                            {story.desc}
                                        </p>
                                        <h4 className="mt-1 font-['Playfair_Display',serif] text-[22px] leading-[29px] font-bold text-white">
                                            {story.price}{' '}
                                            <span className="text-sm font-normal">
                                                por entrega
                                            </span>
                                        </h4>
                                    </div>
                                    <Link
                                        href={show({ slug: story.slug }).url}
                                        className="flex h-[39px] w-[150px] items-center justify-center rounded-[2px] border border-white bg-[rgba(255,255,255,0.2)] px-5 py-[10px] text-white transition duration-300 hover:bg-white hover:text-[#1B3D6D]"
                                    >
                                        <span className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold transition group-hover:text-[#111]">
                                            Ver historia
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {stories.length > 1 ? (
                    <div className="flex flex-row items-center gap-[24px] lg:gap-[48px]">
                        <button
                            type="button"
                            onClick={() => scrollByCards(-1)}
                            className="group flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#1B3D6D] text-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] hover:text-white lg:h-[60px] lg:w-[60px]"
                            aria-label="Ver destacadas anteriores"
                        >
                            <i className="fa-solid fa-chevron-left text-sm lg:text-xl"></i>
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollByCards(1)}
                            className="group flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#1B3D6D] text-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] hover:text-white lg:h-[60px] lg:w-[60px]"
                            aria-label="Ver destacadas siguientes"
                        >
                            <i className="fa-solid fa-chevron-right text-sm lg:text-xl"></i>
                        </button>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
