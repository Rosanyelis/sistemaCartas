import { useState, useEffect } from 'react';
import type { Testimonial } from '@/types/welcome';

interface TestimonialsSectionProps {
    title: string;
    testimonials: Testimonial[];
}

export default function TestimonialsSection({
    title,
    testimonials,
}: TestimonialsSectionProps) {
    const baseTestimonials = testimonials;

    const extendedTestimonials = Array(20).fill(baseTestimonials).flat();
    const START_TESTIMONIAL_INDEX = baseTestimonials.length * 10;

    const [activeTestimonialSlide, setActiveTestimonialSlide] = useState(
        START_TESTIMONIAL_INDEX,
    );
    const [isTestimonialTransitioning, setIsTestimonialTransitioning] =
        useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isTestimonialTransitioning) {
                setIsTestimonialTransitioning(true);
            }

            setActiveTestimonialSlide((prev) => prev + 1);
        }, 6000);

        return () => clearTimeout(timer);
    }, [activeTestimonialSlide, isTestimonialTransitioning]);

    const handleNextTestimonial = () => {
        if (!isTestimonialTransitioning) {
            setIsTestimonialTransitioning(true);
        }

        setActiveTestimonialSlide((prev) => prev + 1);
    };

    const handlePrevTestimonial = () => {
        if (!isTestimonialTransitioning) {
            setIsTestimonialTransitioning(true);
        }

        setActiveTestimonialSlide((prev) => prev - 1);
    };

    const handleTestimonialTransitionEnd = () => {
        if (
            activeTestimonialSlide <= baseTestimonials.length ||
            activeTestimonialSlide >=
                extendedTestimonials.length - baseTestimonials.length
        ) {
            setIsTestimonialTransitioning(false);
            const middleIndex =
                START_TESTIMONIAL_INDEX +
                (activeTestimonialSlide % baseTestimonials.length);
            setActiveTestimonialSlide(middleIndex);
        }
    };

    return (
        <section className="flex w-full flex-col items-center justify-center overflow-hidden bg-[#FFFFFF] py-20 lg:py-[70px]">
            <div className="flex w-full flex-col items-center gap-[44px]">
                {/* Header */}
                <div className="flex w-full max-w-[1296px] flex-col items-center gap-4 px-6 lg:px-[72px]">
                    <h2 className="text-center font-['Playfair_Display',serif] text-[32px] leading-[65px] font-semibold text-[#1B3D6D] md:text-[49px]">
                        {title}
                    </h2>
                    <div className="h-[4px] w-[150px] rounded-[4px] bg-[#FDF6E3] md:w-[250px]"></div>
                </div>

                {/* Slider Content */}
                <div className="relative w-full overflow-hidden py-4">
                    <div
                        className={`flex flex-row items-center gap-[48px] ${isTestimonialTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                        style={{
                            transform: `translateX(calc(50vw - (min(100vw - 48px, 420px) / 2) - ${activeTestimonialSlide} * (min(100vw - 48px, 420px) + 48px)))`,
                        }}
                        onTransitionEnd={handleTestimonialTransitionEnd}
                    >
                        {extendedTestimonials.map((testimonial, i) => (
                            <div
                                key={i}
                                className="flex w-[calc(100vw-48px)] max-w-[420px] shrink-0 flex-col items-start justify-between gap-4 rounded-[2px] bg-white p-4 shadow-[0px_0px_16px_rgba(0,0,0,0.04)] lg:h-[196px] lg:w-[420px]"
                            >
                                <div className="flex w-full flex-row items-start justify-between gap-4">
                                    {/* Quote Left */}
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] bg-white">
                                        <svg
                                            width="32"
                                            height="32"
                                            viewBox="0 0 32 32"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M25 14.6667H22.6667V14.3334C22.6667 13.4167 23.375 12.6667 24.3333 12.6667H24.6667C25.75 12.6667 26.6667 11.7917 26.6667 10.6667V8.66675C26.6667 7.58341 25.75 6.66675 24.6667 6.66675H24.3333C20.0833 6.66675 16.6667 10.1251 16.6667 14.3334V22.3334C16.6667 24.0001 18 25.3334 19.6667 25.3334H25C26.625 25.3334 28 24.0001 28 22.3334V17.6667C28 16.0417 26.625 14.6667 25 14.6667ZM26 22.3334C26 22.9167 25.5417 23.3334 25 23.3334H19.6667C19.0833 23.3334 18.6667 22.9167 18.6667 22.3334V14.3334C18.6667 11.2084 21.2083 8.66675 24.3333 8.66675H24.6667V10.6667H24.3333C22.2917 10.6667 20.6667 12.3334 20.6667 14.3334V16.6667H25C25.5417 16.6667 26 17.1251 26 17.6667V22.3334ZM12.3333 14.6667H10V14.3334C10 13.4167 10.7083 12.6667 11.6667 12.6667H12C13.0833 12.6667 14 11.7917 14 10.6667V8.66675C14 7.58341 13.0833 6.66675 12 6.66675H11.6667C7.41667 6.66675 4 10.1251 4 14.3334V22.3334C4 24.0001 5.33333 25.3334 7 25.3334H12.3333C13.9583 25.3334 15.3333 24.0001 15.3333 22.3334V17.6667C15.3333 16.0417 13.9583 14.6667 12.3333 14.6667ZM13.3333 22.3334C13.3333 22.9167 12.875 23.3334 12.3333 23.3334H7C6.41667 23.3334 6 22.9167 6 22.3334V14.3334C6 11.2084 8.54167 8.66675 11.6667 8.66675H12V10.6667H11.6667C9.625 10.6667 8 12.3334 8 14.3334V16.6667H12.3333C12.875 16.6667 13.3333 17.1251 13.3333 17.6667V22.3334Z"
                                                fill="#1B3D6D"
                                            />
                                        </svg>
                                    </div>

                                    {/* Text */}
                                    <div className="mt-1 flex-1">
                                        <p className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-[#7B7B7B]">
                                            {testimonial.text}
                                        </p>
                                    </div>

                                    {/* Quote Right */}
                                    <div className="mt-8 flex h-8 w-8 shrink-0 items-center justify-center self-end rounded-[2px] bg-white">
                                        <svg
                                            width="24"
                                            height="19"
                                            viewBox="0 0 24 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M8.33333 0H3C1.33333 0 0 1.375 0 3V7.66667C0 9.33333 1.33333 10.6667 3 10.6667H5.33333V11C5.33333 11.9583 4.58333 12.6667 3.66667 12.6667H3.33333C2.20833 12.6667 1.33333 13.5833 1.33333 14.6667V16.6667C1.33333 17.7917 2.20833 18.6667 3.33333 18.6667H3.66667C7.875 18.6667 11.3333 15.25 11.3333 11V3C11.3333 1.375 9.95833 0 8.33333 0ZM9.33333 11C9.33333 14.125 6.79167 16.6667 3.66667 16.6667H3.33333V14.6667H3.66667C5.66667 14.6667 7.33333 13.0417 7.33333 11V8.66667H3C2.41667 8.66667 2 8.25 2 7.66667V3C2 2.45833 2.41667 2 3 2H8.33333C8.875 2 9.33333 2.45833 9.33333 3V11ZM21 0H15.6667C14 0 12.6667 1.375 12.6667 3V7.66667C12.6667 9.33333 14 10.6667 15.6667 10.6667H18V11C18 11.9583 17.25 12.6667 16.3333 12.6667H16C14.875 12.6667 14 13.5833 14 14.6667V16.6667C14 17.7917 14.875 18.6667 16 18.6667H16.3333C20.5417 18.6667 24 15.25 24 11V3C24 1.375 22.625 0 21 0ZM22 11C22 14.125 19.4583 16.6667 16.3333 16.6667H16V14.6667H16.3333C18.3333 14.6667 20 13.0417 20 11V8.66667H15.6667C15.0833 8.66667 14.6667 8.25 14.6667 7.66667V3C14.6667 2.45833 15.0833 2 15.6667 2H21C21.5417 2 22 2.45833 22 3V11Z"
                                                fill="#1B3D6D"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex w-full flex-row items-center gap-5 pl-[55px]">
                                    <img
                                        src={testimonial.img}
                                        alt={testimonial.author}
                                        className="h-[52px] w-[52px] rounded-full object-cover"
                                    />
                                    <div className="flex flex-col items-start gap-1">
                                        <h4 className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold text-[#1B3D6D]">
                                            {testimonial.author}
                                        </h4>
                                        <p className="font-['Poppins',sans-serif] text-[13px] leading-5 font-normal text-[#7B7B7B] md:font-['Inter',sans-serif]">
                                            {testimonial.city}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slider Controls */}
                <div className="z-10 mt-4 flex flex-row items-center gap-10 lg:gap-12">
                    <button
                        onClick={handlePrevTestimonial}
                        className="group flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] lg:h-[60px] lg:w-[60px] lg:border"
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
                        onClick={handleNextTestimonial}
                        className="group flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] lg:h-[60px] lg:w-[60px] lg:border"
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
            </div>
        </section>
    );
}
