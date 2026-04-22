import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Estampilla1Icon } from '@/components/icons/Estampilla1Icon';
import { Estampilla2Icon } from '@/components/icons/Estampilla2Icon';

export default function HeroSection() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [typedText, setTypedText] = useState('');
    const heroText =
        'En un mundo que corre, nosotros elegimos la calma. Recibe cada mes en tu buzón una historia física, escrita a mano y envuelta en papel real.';

    useEffect(() => {
        setIsLoaded(true);

        let typingInterval: NodeJS.Timeout;
        const startTimeout = setTimeout(() => {
            let i = 0;
            typingInterval = setInterval(() => {
                if (i <= heroText.length) {
                    setTypedText(heroText.slice(0, i));
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 50);
        }, 1000); // Inicia después de la transición inicial

        return () => {
            clearTimeout(startTimeout);

            if (typingInterval) {
                clearInterval(typingInterval);
            }
        };
    }, []);

    return (
        <section className="relative isolate mt-20 flex h-auto min-h-[600px] w-full flex-col items-center overflow-hidden bg-black/98 p-0 lg:h-[600px]">
            {/* Background images and overlays */}
            <div className="absolute inset-[-15%] bg-[url('/images/hero-image.png')] bg-cover bg-center"></div>

            <div
                className="pointer-events-none absolute top-0 left-1/2 z-[1] h-[660px] w-full -translate-x-1/2"
                style={{
                    background:
                        'radial-gradient(57.57% 245.83% at 60.62% 59.71%, rgba(215, 193, 129, 0.44) 4.81%, rgba(17, 17, 16, 0.44) 33.65%)',
                }}
            ></div>

            {/* Stamps */}
            <Estampilla1Icon className="pointer-events-none absolute top-[23px] -left-[30px] z-[2] hidden h-[126px] w-[147px] opacity-80 lg:block" />
            <Estampilla2Icon className="pointer-events-none absolute top-[435px] left-[582px] z-[3] hidden h-[131px] w-[181px] opacity-60 mix-blend-overlay lg:block" />

            {/* Main Container */}
            <div className="relative bottom-0 left-1/2 z-[4] flex h-full w-full max-w-[1200px] -translate-x-1/2 flex-col items-center justify-end p-3 pb-0 lg:absolute lg:h-[485px] lg:-translate-y-10 lg:justify-center lg:p-0">
                <div className="flex h-full w-full flex-col items-center justify-end gap-10 lg:h-[565px] lg:flex-row lg:items-start lg:justify-between xl:gap-[298px]">
                    {/* Left container: glass card con título + botón */}
                    <div
                        className={`mx-auto flex w-full max-w-[350px] transform flex-col items-start gap-6 rounded-[4px] bg-white/22 p-4 backdrop-blur-[2px] transition-all duration-1000 ease-out lg:mx-0 lg:h-[397px] lg:max-w-[607px] lg:gap-6 lg:self-center lg:p-6 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                    >
                        <div className="flex w-full flex-col items-start gap-[4px] p-0">
                            <h2 className="font-['Cormorant_Garamond',serif] text-2xl leading-[26px] font-bold text-white">
                                Una correspondencia para el alma
                            </h2>
                            <h1 className="font-['Playfair_Display',serif] text-[48px] leading-[58px] font-bold tracking-[-1.4px] text-white lg:text-[69px] lg:leading-[82px]">
                                "Antes de los mensajes instantáneos..."
                            </h1>
                        </div>

                        <Link
                            href="#historias"
                            className="group flex h-[47px] w-full max-w-[310px] flex-row items-center justify-center gap-2 rounded-[2px] border border-[#1B3D6D] bg-[#1B3D6D] px-5 py-3.5 transition duration-300 hover:border-white hover:bg-white"
                        >
                            <span className="font-['Inter',sans-serif] text-base leading-[19px] font-semibold text-white transition group-hover:text-[#1B3D6D]">
                                Descubrir historias
                            </span>
                        </Link>
                    </div>

                    {/* Right container: descripción italic + imagen persona */}
                    <div
                        className={`relative flex w-full max-w-[350px] transform flex-col items-start gap-5 pb-0 transition-all delay-[400ms] duration-1000 ease-out lg:h-[565px] lg:max-w-[334px] lg:justify-between ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                    >
                        {/* Texto descriptivo: estático en mobile, animado en desktop */}
                        <p className="w-full font-['Cormorant_Garamond',serif] text-[20px] leading-[26px] font-bold text-white italic lg:hidden">
                            En un mundo que corre, nosotros elegimos la calma.
                            Recibe cada mes en tu buzón una historia física,
                            escrita a mano y envuelta en papel real.
                        </p>
                        <div className="hidden lg:flex">
                            <p className="min-h-[90px] w-[265px] text-left font-['Cormorant_Garamond',serif] text-xl leading-[22px] font-bold text-white/90 italic drop-shadow-sm">
                                {typedText}
                                {typedText.length < heroText.length && (
                                    <span className="animate-pulse opacity-70">
                                        |
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Imagen persona */}
                        <div className="relative h-[320px] w-full lg:h-[419px]">
                            <div className="absolute top-[42px] left-[85px] hidden h-[326px] w-[249px] rounded bg-[#1B3D6D]/22 lg:block"></div>
                            <img
                                src="/images/carta.png"
                                alt="Carta"
                                className="absolute right-0 bottom-0 h-full w-auto max-w-[310px] rounded-t-[4px] object-cover shadow-[0px_0px_20px_rgba(36,16,167,0.15)] lg:right-[24px] lg:h-[419px] lg:w-[310px]"
                            />
                        </div>

                        {/* Scroll indicator - solo desktop */}
                        <div className="absolute top-[80px] -right-[70px] hidden w-[36px] flex-col items-center gap-[25px] lg:flex">
                            <span className="origin-center -rotate-90 font-['Roboto',sans-serif] text-[13px] leading-[15px] font-medium whitespace-nowrap text-white opacity-80">
                                Scroll
                            </span>
                            <div className="relative h-[59px] w-[36px]">
                                <div className="absolute top-[23px] left-1/2 box-border h-[36px] w-[36px] -translate-x-1/2 rounded-full border-[1.5px] border-white/80"></div>
                                <div className="absolute top-0 left-1/2 box-border h-[46px] w-[1.5px] -translate-x-1/2 bg-white/80"></div>
                                <div className="absolute bottom-[8px] left-1/2 -ml-[0.5px] h-[8px] w-[8px] -translate-x-1/2 rotate-45 border-r-[1.5px] border-b-[1.5px] border-white/80"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
