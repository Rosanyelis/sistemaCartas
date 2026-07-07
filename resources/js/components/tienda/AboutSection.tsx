import { AboutFeatureIconBox } from '@/components/tienda/AboutFeatureIconBox';

export default function AboutSection() {
    return (
        <section className="relative isolate flex w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-20 lg:h-[522px] lg:py-[70px]">
            {/* Decoraciones absolutas */}
            <img
                src="/images/Circulo_1-08 1.svg"
                alt=""
                className="pointer-events-none absolute top-[310px] -left-[42px] z-[3] h-[142px] w-[146px] opacity-50"
            />
            <img
                src="/images/circulo-linea.svg"
                alt=""
                className="pointer-events-none absolute top-[60px] right-[-25px] z-[2] h-[85px] w-[220px]"
            />

            <div className="relative z-10 flex w-full max-w-[1296px] flex-col items-center gap-[57px]">
                {/* Título y línea */}
                <div className="flex w-full flex-col items-center gap-4">
                    <h2 className="text-center font-['Playfair_Display',serif] text-[32px] leading-tight font-semibold text-[#1B3D6D] md:text-[49px] md:leading-[65px]">
                        ¿Qué es Historias por Correo?
                    </h2>
                    <div className="h-[4px] w-[150px] rounded-[4px] bg-[#D7C181] md:w-[250px]"></div>
                </div>

                {/* Contenido (3 Iconos) */}
                <div className="z-[1] flex w-full flex-col items-start justify-center gap-12 lg:h-[240px] lg:flex-row lg:items-center lg:gap-[120px]">
                    <div className="mx-auto flex w-full flex-col items-center gap-[10px] md:w-[267px] lg:mx-0">
                        <AboutFeatureIconBox
                            iconSrc="/images/Icono_pergamino-01 3.png"
                            iconSize="scroll"
                        />
                        <div className="flex w-full flex-col items-center gap-[4px]">
                            <h3 className="text-center font-['Playfair_Display',serif] text-[22px] leading-tight font-bold text-[#1B3D6D] md:text-[25px] md:leading-[33px]">
                                Historias ambientadas antes de 1970
                            </h3>
                            <p className="text-center font-['Inter',sans-serif] text-[13px] leading-[16px] font-medium text-[#1B3D6D]">
                                Capturando la esencia de épocas doradas y
                                momentos olvidados.
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto flex w-full flex-col items-center gap-[10px] md:w-[267px] lg:mx-0">
                        <AboutFeatureIconBox
                            iconSrc="/images/Sobre_Icon-02 1.png"
                            iconClassName="h-auto w-[80px] object-contain object-center"
                        />
                        <div className="flex w-full flex-col items-center gap-[4px]">
                            <h3 className="text-center font-['Playfair_Display',serif] text-[22px] leading-tight font-bold text-[#1B3D6D] md:text-[25px] md:leading-[33px]">
                                Recíbelas físicamente en tu hogar
                            </h3>
                            <p className="text-center font-['Inter',sans-serif] text-[13px] leading-[16px] font-medium text-[#1B3D6D]">
                                Siente el tacto del papel y la emoción de abrir
                                un sobre real.
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto flex w-full flex-col items-center gap-[10px] md:w-[267px] lg:mx-0">
                        <AboutFeatureIconBox
                            iconSrc="/images/Sobre_Abierto-03 2.png"
                            iconSize="open"
                        />
                        <div className="flex w-full flex-col items-center gap-[4px]">
                            <h3 className="text-center font-['Playfair_Display',serif] text-[22px] leading-tight font-bold text-[#1B3D6D] md:text-[25px] md:leading-[33px]">
                                Nuevas entregas periódicas
                            </h3>
                            <p className="text-center font-['Inter',sans-serif] text-[13px] leading-[16px] font-medium text-[#1B3D6D]">
                                Que mantienen viva la narrativa y la sorpresa de
                                una nueva aventura.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
