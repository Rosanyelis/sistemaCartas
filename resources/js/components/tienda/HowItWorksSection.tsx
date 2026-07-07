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
                                        className="text-white"
                                        width="24"
                                        height="27"
                                        viewBox="0 0 24 27"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M23.3333 20V0.833333C23.3333 0.416667 22.9167 0 22.5 0H4.16667C1.82292 0 0 1.875 0 4.16667V22.5C0 24.8438 1.82292 26.6667 4.16667 26.6667H22.5C22.9167 26.6667 23.3333 26.3021 23.3333 25.8333V25C23.3333 24.6354 23.0208 24.2708 22.6563 24.2188C22.3958 23.5417 22.3958 21.5104 22.6563 20.8333C23.0208 20.7812 23.3333 20.4167 23.3333 20ZM20.5208 24.1667H4.16667C3.22917 24.1667 2.5 23.4375 2.5 22.5C2.5 21.6146 3.22917 20.8333 4.16667 20.8333H20.5208C20.3646 21.7708 20.3646 23.2812 20.5208 24.1667ZM20.8333 18.3333H4.16667C3.54167 18.3333 2.96875 18.4896 2.5 18.6979V4.16667C2.5 3.28125 3.22917 2.5 4.16667 2.5H20.8333V18.3333ZM12.7604 13.9062L14.1667 16.6667L15.5208 13.9062L18.3333 12.5L15.5208 11.1458L14.1667 8.33333L12.7604 11.1458L10 12.5L12.7604 13.9062ZM8.33333 10.4167L9.27083 8.48958L11.25 7.5L9.27083 6.5625L8.33333 4.58333L7.34375 6.5625L5.41667 7.5L7.34375 8.48958L8.33333 10.4167Z"
                                            fill="white"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                step: 'Paso 2',
                                title: 'Activa tu suscripción',
                                desc: 'Proceso de alta sencillo y seguro. Sin pagos ocultos ni complicaciones técnicas.',
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
                                        width="26"
                                        height="26"
                                        viewBox="0 0 26 26"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M22.7538 11.888L24.4204 10.9505C24.8892 10.6901 25.1496 10.1172 24.9933 9.54427C24.4204 7.35677 23.2225 5.3776 21.66 3.76302C21.2433 3.39844 20.6183 3.29427 20.1496 3.55469L18.4829 4.54427C17.9621 4.1276 17.3892 3.8151 16.7642 3.55469V1.6276C16.7642 1.05469 16.3996 0.585937 15.8267 0.429687C13.6913 -0.143229 11.3475 -0.143229 9.21209 0.429687C8.63917 0.585937 8.27459 1.05469 8.27459 1.6276V3.55469C7.64959 3.8151 7.07668 4.1276 6.55584 4.54427L4.88918 3.55469C4.42043 3.29427 3.79543 3.39844 3.37876 3.76302C1.81626 5.3776 0.618342 7.35677 0.0454253 9.54427C-0.110825 10.1172 0.149592 10.6901 0.618342 10.9505L2.28501 11.888C2.23293 12.2526 2.23293 12.5651 2.23293 12.9297C2.23293 13.2422 2.23293 13.5547 2.28501 13.8672L0.618342 14.8568C0.149592 15.1172 -0.110825 15.6901 0.0454253 16.263C0.618342 18.4505 1.81626 20.4297 3.37876 22.0443C3.79543 22.4089 4.42043 22.513 4.88918 22.2526L6.55584 21.263C7.07668 21.6797 7.64959 21.9922 8.27459 22.2526V24.1797C8.27459 24.7526 8.63917 25.2214 9.21209 25.3776C11.3475 25.9505 13.6913 25.9505 15.8267 25.3776C16.3996 25.2214 16.7642 24.7526 16.7642 24.1797V22.2526C17.3892 21.9922 17.9621 21.6797 18.4829 21.263L20.1496 22.2526C20.6183 22.513 21.2433 22.4089 21.66 22.0443C23.2225 20.4297 24.4204 18.4505 24.9933 16.263C25.1496 15.6901 24.8892 15.1172 24.4204 14.8568L22.7538 13.8672C22.8058 13.2422 22.8058 12.5651 22.7538 11.888ZM19.9933 15.2214L22.285 16.5234C21.8683 17.6172 21.2954 18.6589 20.5142 19.5443L18.2225 18.2422C16.5558 19.6484 16.3475 19.8047 14.2642 20.5339V23.1901C13.6913 23.2943 13.1183 23.3464 12.4933 23.3464C11.9204 23.3464 11.3475 23.2943 10.7746 23.1901V20.5339C8.69126 19.8047 8.43084 19.6484 6.81626 18.2422L4.52459 19.5443C3.74334 18.6589 3.17043 17.6172 2.75376 16.5234L5.04543 15.2214C4.62876 13.0339 4.62876 12.7734 5.04543 10.5859L2.75376 9.28385C3.17043 8.1901 3.74334 7.14844 4.52459 6.26302L6.81626 7.5651C8.48292 6.15885 8.69126 6.0026 10.7746 5.27344V2.61719C11.3475 2.51302 11.9204 2.46094 12.5454 2.46094C13.1183 2.46094 13.6913 2.51302 14.2642 2.61719V5.27344C16.3475 6.0026 16.6079 6.15885 18.2225 7.5651L20.5142 6.26302C21.2954 7.14844 21.8683 8.1901 22.285 9.28385L19.9933 10.5859C20.41 12.7734 20.41 13.0339 19.9933 15.2214ZM12.5454 7.8776C9.78501 7.8776 7.54542 10.1693 7.54542 12.8776C7.54542 15.638 9.78501 17.8776 12.5454 17.8776C15.2538 17.8776 17.5454 15.638 17.5454 12.8776C17.5454 10.1693 15.2538 7.8776 12.5454 7.8776ZM12.5454 15.3776C11.1392 15.3776 10.0454 14.2839 10.0454 12.8776C10.0454 11.5234 11.1392 10.3776 12.5454 10.3776C13.8996 10.3776 15.0454 11.5234 15.0454 12.8776C15.0454 14.2839 13.8996 15.3776 12.5454 15.3776Z"
                                            fill="white"
                                        />
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
                                            <p className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-light text-[#F2F2F2]">
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
                                            <p className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-light text-[#F2F2F2]">
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
                                    <p className="font-['Inter',sans-serif] text-[14px] leading-[18px] font-light text-[#F2F2F2]">
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
