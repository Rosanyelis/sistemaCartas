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
                src="/images/Lineas_4-07 1.svg"
                alt=""
                className="pointer-events-none absolute top-[60px] right-0 z-[2] h-[85px] w-[220px]"
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
                    {/* Item 1 */}
                    <div className="mx-auto flex w-full flex-col items-center gap-[10px] md:w-[267px] lg:mx-0">
                        <div
                            className="relative flex h-[112px] w-[112px] items-center justify-center bg-[#1B3D6D] drop-shadow-[4px_4px_8px_rgba(255,255,255,0.2)]"
                            style={{
                                maskImage:
                                    'radial-gradient(linear, transparent 4px, black 4.5px)',
                                maskSize: '14px 14px',
                                maskPosition: '-7px -7px',
                                WebkitMaskImage:
                                    'radial-gradient(linear, transparent 4px, black 4.5px)',
                                WebkitMaskSize: '14px 14px',
                                WebkitMaskPosition: '-7px -7px',
                            }}
                        >
                            <img
                                src="/images/Icono_pergamino-01 3.png"
                                alt=""
                                className="h-auto w-[68px] object-contain"
                            />
                        </div>
                        <div className="flex w-full flex-col items-center gap-[4px]">
                            <h3 className="text-center font-['Playfair_Display',serif] text-[22px] leading-tight font-bold text-[#1B3D6D] md:text-[25px] md:leading-[33px]">
                                Historias ambientadas antes de 1970
                            </h3>
                            <p className="text-center font-['Inter',sans-serif] text-[13px] leading-[16px] font-medium text-[#1B3D6D] italic">
                                Capturando la esencia de épocas doradas y
                                momentos olvidados.
                            </p>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="mx-auto flex w-full flex-col items-center gap-[10px] md:w-[267px] lg:mx-0">
                        <div
                            className="relative flex h-[112px] w-[112px] items-center justify-center bg-[#1B3D6D] drop-shadow-[4px_4px_8px_rgba(255,255,255,0.2)]"
                            style={{
                                maskImage:
                                    'radial-gradient(linear, transparent 4px, black 4.5px)',
                                maskSize: '14px 14px',
                                maskPosition: '-7px -7px',
                                WebkitMaskImage:
                                    'radial-gradient(linear, transparent 4px, black 4.5px)',
                                WebkitMaskSize: '14px 14px',
                                WebkitMaskPosition: '-7px -7px',
                            }}
                        >
                            <img
                                src="/images/Sobre_Icon-02 1.png"
                                alt=""
                                className="h-auto w-[76px] object-contain"
                            />
                        </div>
                        <div className="flex w-full flex-col items-center gap-[4px]">
                            <h3 className="text-center font-['Playfair_Display',serif] text-[22px] leading-tight font-bold text-[#1B3D6D] md:text-[25px] md:leading-[33px]">
                                Recíbelas físicamente en tu hogar
                            </h3>
                            <p className="text-center font-['Inter',sans-serif] text-[13px] leading-[16px] font-medium text-[#1B3D6D] italic">
                                Siente el tacto del papel y la emoción de abrir
                                un sobre real.
                            </p>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="mx-auto flex w-full flex-col items-center gap-[10px] md:w-[267px] lg:mx-0">
                        <div
                            className="relative flex h-[112px] w-[112px] items-center justify-center bg-[#1B3D6D] drop-shadow-[4px_4px_8px_rgba(255,255,255,0.2)]"
                            style={{
                                maskImage:
                                    'radial-gradient(linear, transparent 4px, black 4.5px)',
                                maskSize: '14px 14px',
                                maskPosition: '-7px -7px',
                                WebkitMaskImage:
                                    'radial-gradient(linear, transparent 4px, black 4.5px)',
                                WebkitMaskSize: '14px 14px',
                                WebkitMaskPosition: '-7px -7px',
                            }}
                        >
                            <img
                                src="/images/Sobre_Abierto-03 2.png"
                                alt=""
                                className="h-[76px] w-[76px] object-contain"
                            />
                        </div>
                        <div className="flex w-full flex-col items-center gap-[4px]">
                            <h3 className="text-center font-['Playfair_Display',serif] text-[22px] leading-tight font-bold text-[#1B3D6D] md:text-[25px] md:leading-[33px]">
                                Nuevas entregas periódicas
                            </h3>
                            <p className="text-center font-['Inter',sans-serif] text-[13px] leading-[16px] font-medium text-[#1B3D6D] italic">
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
