export default function HowItWorksSection() {
    return (
        <section className="flex w-full flex-col items-center justify-center bg-[#1B3D6D] px-6 py-20 lg:px-[72px] lg:py-[70px]">
            <div className="flex w-full max-w-[1296px] flex-col items-center gap-[44px]">
                {/* Header */}
                <div className="flex w-full flex-col items-center gap-4">
                    <h2 className="text-center font-['Playfair_Display',serif] text-[32px] leading-[65px] font-semibold text-white md:text-[49px]">
                        ¿Cómo Funciona?
                    </h2>
                    <div className="h-[4px] w-[150px] rounded-[4px] bg-[#D7C181] md:w-[250px]"></div>
                </div>

                {/* Timeline Wrapper */}
                <div className="relative mt-4 flex w-full max-w-[1080px] flex-col items-center px-4 md:px-0">
                    {/* Línea Central */}
                    <div className="absolute top-[24px] bottom-[24px] left-[40px] w-[4px] -translate-x-1/2 bg-[#A4A4A4] md:left-1/2"></div>

                    <div className="flex w-full flex-col gap-[67px]">
                        {[
                            {
                                step: 'Paso 1',
                                title: 'Elige tu historia',
                                desc: 'Explora nuestra colección de relatos históricos y selecciona la temática que más te apasione.',
                                align: 'left',
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                    </svg>
                                ),
                            },
                            {
                                step: 'Paso 2',
                                title: 'Activa tu suscripción',
                                desc: 'Proceso de alta sencillo y seguro. Sin cuotas ocultas ni complicaciones técnicas.',
                                align: 'right',
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ),
                            },
                            {
                                step: 'Paso 3',
                                title: 'Recibe cada entrega en tu buzón',
                                desc: 'Relatos físicos en papel de alta calidad enviados directamente a tu buzón cada mes.',
                                align: 'left',
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect
                                            width="20"
                                            height="16"
                                            x="2"
                                            y="4"
                                            rx="2"
                                        ></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </svg>
                                ),
                            },
                            {
                                step: 'Paso 4',
                                title: 'Gestiona o cancela cuando quieras',
                                desc: 'Control total. Cancela o pausa en un clic desde tu perfil, sin preguntas ni permanencia.',
                                align: 'right',
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                ),
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="relative flex w-full items-center md:justify-center"
                            >
                                {/* Vista Escritorio: Izquierda */}
                                <div className="hidden w-1/2 justify-end pr-[48px] md:flex">
                                    {item.align === 'left' && (
                                        <div className="flex w-full max-w-[492px] flex-col items-end text-right">
                                            <span className="mb-1 font-['Inter',sans-serif] text-[13px] font-semibold text-white">
                                                {item.step}
                                            </span>
                                            <h3 className="mb-1 font-['Inter',sans-serif] text-[25px] leading-[30px] font-semibold text-white">
                                                {item.title}
                                            </h3>
                                            <p className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-light text-[#F2F2F2] italic">
                                                {item.desc}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Icono central (Escritorio) */}
                                <div className="absolute left-1/2 z-10 hidden h-[48px] w-[48px] shrink-0 -translate-x-1/2 items-center justify-center rounded-[2px] bg-[#A69B98] md:flex">
                                    {item.icon}
                                </div>

                                {/* Vista Escritorio: Derecha */}
                                <div className="hidden w-1/2 justify-start pl-[48px] md:flex">
                                    {item.align === 'right' && (
                                        <div className="flex w-full max-w-[492px] flex-col items-start text-left">
                                            <span className="mb-1 font-['Inter',sans-serif] text-[13px] font-semibold text-white">
                                                {item.step}
                                            </span>
                                            <h3 className="mb-1 font-['Inter',sans-serif] text-[25px] leading-[30px] font-semibold text-white">
                                                {item.title}
                                            </h3>
                                            <p className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-light text-[#F2F2F2] italic">
                                                {item.desc}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Vista Móvil */}
                                <div className="z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[2px] bg-[#A69B98] md:hidden">
                                    {item.icon}
                                </div>
                                <div className="flex flex-1 flex-col items-start pl-6 text-left md:hidden">
                                    <span className="mb-1 font-['Inter',sans-serif] text-[13px] font-semibold text-white">
                                        {item.step}
                                    </span>
                                    <h3 className="mb-1 font-['Inter',sans-serif] text-[20px] leading-[26px] font-semibold text-white">
                                        {item.title}
                                    </h3>
                                    <p className="font-['Inter',sans-serif] text-[14px] leading-[18px] font-light text-[#F2F2F2] italic">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
