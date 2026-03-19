import { Estampilla1Icon } from '@/components/icons/Estampilla1Icon';
import { Estampilla2Icon } from '@/components/icons/Estampilla2Icon';

export default function ProductosHeroSection() {
    return (
        <section className="relative isolate mt-20 flex w-full flex-col items-start justify-center overflow-hidden bg-white px-3 py-[48px] lg:h-[495px] lg:items-center lg:px-0 lg:py-0">
            {/* Ellipses decoration */}
            <div className="pointer-events-none absolute top-[305.19px] left-[calc(50%-1976.83px/2-53.46px)] -z-10 h-[242.32px] w-[1976.83px] -rotate-[4deg] rounded-[100%] bg-[rgba(27,61,109,0.1)] blur-[25px]"></div>
            <div className="pointer-events-none absolute top-[407.26px] left-[calc(50%-1759.16px/2-97.44px)] -z-10 h-[261.45px] w-[1759.16px] -rotate-[0.16deg] rounded-[100%] bg-white blur-[50px]"></div>

            {/* Stamps */}
            <Estampilla1Icon className="(146.64px) pointer-events-none absolute top-[3px] left-[-34px] -z-[1] h-[126px] w-[146.64px] lg:top-[3px]" />
            <Estampilla2Icon className="pointer-events-none absolute top-[280px] left-[240px] -z-[1] h-[131px] w-[181px] lg:top-[120px] lg:left-[1242px]" />

            <div className="z-10 mx-auto flex h-[574px] w-full max-w-[1240px] flex-col items-start justify-center gap-[40px] px-0 lg:h-auto lg:flex-row lg:items-center lg:gap-0 lg:px-0">
                {/* Content Frame */}
                <div className="z-20 flex w-full flex-col items-center text-left lg:w-[750px] lg:items-start lg:text-left">
                    <h1 className="flex items-center font-['Playfair_Display',serif] text-[44px] leading-[1.1] font-bold tracking-[-1.4px] text-[#1B3D6D] lg:h-[82px] lg:text-[69px] lg:leading-[82px]">
                        Catálogo de Objetos
                    </h1>
                    <p className="mt-4 w-full font-['Cormorant_Garamond',serif] text-[18px] leading-[1.3] font-bold text-[#7B7B7B] italic lg:h-[77px] lg:text-[24px] lg:leading-[24px]">
                        Descubre el arte perdido de la correspondencia a través
                        de nuestra selección de artículos de escritura fina.
                        Cada objeto cuenta una historia de elegancia, paciencia
                        y la nostalgia de las palabras escritas a mano.
                    </p>
                </div>

                {/* Hero Images Right Group */}
                <div className="relative flex w-full items-center justify-center lg:w-[620px]">
                    <img
                        src="/images/hero-objets.png"
                        className="h-auto w-full max-w-[450px] object-contain drop-shadow-xl lg:h-[509.64px] lg:w-[625.6px] lg:max-w-none"
                        alt="Catálogo de Objetos"
                    />
                </div>
            </div>
        </section>
    );
}
