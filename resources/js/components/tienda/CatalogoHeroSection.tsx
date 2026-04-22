import { Estampilla1Icon } from '@/components/icons/Estampilla1Icon';
import { Estampilla2Icon } from '@/components/icons/Estampilla2Icon';

export default function CatalogoHeroSection() {
    return (
        <section className="relative isolate mt-20 flex w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-[50px] lg:h-[495px] lg:py-[70px]">
            {/* Ellipses decoration */}
            <div className="pointer-events-none absolute top-[332px] left-1/2 -z-10 h-[242px] w-[1976px] -translate-x-1/2 -rotate-[4deg] rounded-[100%] bg-[rgba(27,61,109,0.1)] blur-[25px]"></div>
            <div className="pointer-events-none absolute top-[413px] left-1/2 -z-10 h-[249px] w-[1679px] -translate-x-1/2 -rotate-[0.16deg] rounded-[100%] bg-white blur-[50px]"></div>

            {/* Stamps */}
            <Estampilla1Icon className="pointer-events-none absolute -top-[19px] -left-[80px] -z-[1] h-[126px] w-[147px] lg:top-[88px] lg:left-[calc(50%-749px)]" />
            <Estampilla2Icon className="pointer-events-none absolute top-[calc(50%-77px)] -right-[58px] -z-[1] h-[131px] w-[181px] lg:top-[156px] lg:right-auto lg:left-[calc(50%+562px)]" />

            <div className="z-10 flex w-full max-w-[1030px] flex-col items-center gap-[60px] lg:flex-row lg:gap-[76px]">
                <div className="flex w-full flex-col items-start gap-[12px] lg:w-[654px]">
                    <h1 className="font-['Playfair_Display',serif] text-[44px] leading-[1.1] font-bold tracking-[-1.4px] text-[#1B3D6D] lg:text-[69px] lg:leading-[82px]">
                        Catálogo de
                        <br className="lg:hidden" /> Historias
                    </h1>
                    <p className="w-full font-['Cormorant_Garamond',serif] text-[18px] leading-[1.3] font-bold text-[#7B7B7B] italic lg:text-[24px]">
                        Sumérgete en el pasado a través de nuestras
                        correspondencias epistolares narradas en tiempo real.
                        Cada sobre es una puerta a otra época.
                    </p>
                </div>

                {/* Hero Images Right */}
                <div className="relative -left-[10%] isolate mt-[5px] flex h-[250px] w-[190px] shrink-0 items-center justify-center sm:-left-[5%] sm:h-[300px] sm:w-[230px] lg:left-0 lg:mt-0 lg:h-[351px] lg:w-[300px]">
                    <div className="absolute -inset-[14%] z-0 bg-[url('/images/catalogo.png')] bg-cover bg-center shadow-md"></div>
                    <img
                        src="/images/catalogo2.png"
                        className="absolute top-[78%] -right-[40%] z-10 h-[120px] w-[95px] object-cover p-0 sm:-right-[20%] sm:h-[150px] sm:w-[110px] lg:-right-[25%] lg:h-[150px] lg:w-[114px]"
                        alt="Carta detalle"
                    />
                </div>
            </div>
        </section>
    );
}
