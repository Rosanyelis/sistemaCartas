import { Link } from '@inertiajs/react';

interface CtaSectionProps {
    title: string;
    description?: string;
    buttonText: string;
    buttonLink: string;
}

export default function CtaSection({
    title,
    description,
    buttonText,
    buttonLink,
}: CtaSectionProps) {
    return (
        <section className="flex w-full flex-col items-center justify-center bg-[#FFFCF4] px-6 py-14 lg:py-[100px]">
            <div className="relative flex w-full max-w-[850px] flex-col items-center justify-center gap-[44px] overflow-hidden rounded-[2px] bg-[#1B3D6D] px-6 py-10 shadow-[0px_0px_16px_rgba(0,0,0,0.04)] md:px-[56px] md:py-[60px]">
                {/* Background Decorative Elements */}
                {/* Left Decorations */}
                <div className="pointer-events-none absolute top-4 -left-[-10px] hidden opacity-10 md:block">
                    <svg
                        width="60"
                        height="150"
                        viewBox="0 0 60 150"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M50 0 V150"
                            stroke="white"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                        <rect
                            x="10"
                            y="10"
                            width="40"
                            height="130"
                            stroke="white"
                            strokeWidth="1"
                        />
                    </svg>
                </div>
                <div className="pointer-events-none absolute top-24 -left-20 hidden opacity-10 md:block">
                    <svg
                        width="150"
                        height="40"
                        viewBox="0 0 150 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0 10 Q20 -5, 40 10 T80 10 T120 10 T160 10"
                            stroke="white"
                            strokeWidth="1"
                            fill="none"
                        />
                        <path
                            d="M0 20 Q20 5, 40 20 T80 20 T120 20 T160 20"
                            stroke="white"
                            strokeWidth="1"
                            fill="none"
                        />
                        <path
                            d="M0 30 Q20 15, 40 30 T80 30 T120 30 T160 30"
                            stroke="white"
                            strokeWidth="1"
                            fill="none"
                        />
                    </svg>
                </div>

                {/* Right Decorations */}
                <div className="pointer-events-none absolute -right-20 -bottom-20 hidden md:block">
                    <div className="h-[191px] w-[191px] rounded-full bg-white/10 blur-[2px]"></div>
                </div>
                <div className="pointer-events-none absolute right-10 -bottom-10 hidden md:block">
                    <div className="h-[111px] w-[111px] rounded-full bg-white/5 blur-[2px]"></div>
                </div>
                <div className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 opacity-20 md:block">
                    <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="white"
                            strokeWidth="1"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="30"
                            stroke="white"
                            strokeWidth="1"
                            strokeDasharray="2 4"
                        />
                        <rect
                            x="35"
                            y="40"
                            width="30"
                            height="20"
                            stroke="white"
                            strokeWidth="1"
                        />
                        <path
                            d="M35 40 L50 50 L65 40"
                            stroke="white"
                            strokeWidth="1"
                        />
                    </svg>
                </div>

                {/* Content */}
                <div className="z-10 flex w-full max-w-[704px] flex-col items-center gap-[16px] text-center">
                    <h2 className="font-['Playfair_Display',serif] text-[36px] leading-[45px] font-bold text-[#D7C181] italic md:text-[49px] md:leading-[58px]">
                        {title}
                    </h2>
                    <div className="h-[4px] w-[150px] rounded-[4px] bg-[#FDF6E3] md:w-[250px]"></div>
                    {description && (
                        <p className="mx-auto mt-2 max-w-[688px] font-['Inter',sans-serif] text-[15px] leading-[22px] font-normal text-white md:text-[16px]">
                            {description}
                        </p>
                    )}
                </div>

                {/* Button */}
                <Link
                    href={buttonLink}
                    className="group z-10 inline-flex h-[47px] w-full max-w-[310px] items-center justify-center rounded-[2px] border border-white bg-transparent px-[20px] py-[14px] transition duration-300 hover:bg-white"
                >
                    <span className="font-['Inter',sans-serif] text-[14px] leading-[19px] font-semibold text-white transition group-hover:text-[#1B3D6D]">
                        {buttonText}
                    </span>
                </Link>
            </div>
        </section>
    );
}
