import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import type { Story, Product, Testimonial } from '@/types/welcome';
import {
    defaultStories,
    defaultProducts,
    defaultTestimonials,
} from '@/constants/welcome';

export default function Welcome({
    canRegister = true,
    stories = defaultStories,
    products = defaultProducts,
    testimonials = defaultTestimonials,
}: {
    canRegister?: boolean;
    stories?: Story[];
    products?: Product[];
    testimonials?: Testimonial[];
}) {
    const { auth } = usePage().props;

    const [isLoaded, setIsLoaded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            if (typingInterval) clearInterval(typingInterval);
        };
    }, []);

    const baseStories = stories;

    const extendedStories = Array(20).fill(baseStories).flat();
    const START_INDEX = baseStories.length * 10;

    const [activeStorySlide, setActiveStorySlide] = useState(START_INDEX);
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isTransitioning) setIsTransitioning(true);
            setActiveStorySlide((prev) => prev + 1);
        }, 6000);
        return () => clearTimeout(timer);
    }, [activeStorySlide, isTransitioning]);

    const handleNextStory = () => {
        if (!isTransitioning) setIsTransitioning(true);
        setActiveStorySlide((prev) => prev + 1);
    };

    const handlePrevStory = () => {
        if (!isTransitioning) setIsTransitioning(true);
        setActiveStorySlide((prev) => prev - 1);
    };

    const handleTransitionEnd = () => {
        if (
            activeStorySlide <= baseStories.length ||
            activeStorySlide >= extendedStories.length - baseStories.length
        ) {
            setIsTransitioning(false);
            const middleIndex =
                START_INDEX + (activeStorySlide % baseStories.length);
            setActiveStorySlide(middleIndex);
        }
    };

    const baseProducts = products;

    const extendedProducts = Array(20).fill(baseProducts).flat();
    const START_PRODUCT_INDEX = baseProducts.length * 10;

    const [activeProductSlide, setActiveProductSlide] =
        useState(START_PRODUCT_INDEX);
    const [isProductTransitioning, setIsProductTransitioning] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isProductTransitioning) setIsProductTransitioning(true);
            setActiveProductSlide((prev) => prev + 1);
        }, 6000);
        return () => clearTimeout(timer);
    }, [activeProductSlide, isProductTransitioning]);

    const handleNextProduct = () => {
        if (!isProductTransitioning) setIsProductTransitioning(true);
        setActiveProductSlide((prev) => prev + 1);
    };

    const handlePrevProduct = () => {
        if (!isProductTransitioning) setIsProductTransitioning(true);
        setActiveProductSlide((prev) => prev - 1);
    };

    const handleProductTransitionEnd = () => {
        if (
            activeProductSlide <= baseProducts.length ||
            activeProductSlide >= extendedProducts.length - baseProducts.length
        ) {
            setIsProductTransitioning(false);
            const middleIndex =
                START_PRODUCT_INDEX +
                (activeProductSlide % baseProducts.length);
            setActiveProductSlide(middleIndex);
        }
    };

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
            if (!isTestimonialTransitioning)
                setIsTestimonialTransitioning(true);
            setActiveTestimonialSlide((prev) => prev + 1);
        }, 6000);
        return () => clearTimeout(timer);
    }, [activeTestimonialSlide, isTestimonialTransitioning]);

    const handleNextTestimonial = () => {
        if (!isTestimonialTransitioning) setIsTestimonialTransitioning(true);
        setActiveTestimonialSlide((prev) => prev + 1);
    };

    const handlePrevTestimonial = () => {
        if (!isTestimonialTransitioning) setIsTestimonialTransitioning(true);
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
        <>
            <Head>
                <title>Historias por Correo</title>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=playfair-display:400,600,700,700i|inter:400,500,600,700|cormorant-garamond:400,700,700i|roboto:400,500"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
            </Head>

            <div className="min-h-screen overflow-x-hidden bg-[#FDFBF7] font-['Inter',sans-serif] text-[#3e352f]">
                {/* 1. Header / Navegación */}
                <header className="sticky top-0 z-50 w-full border-b border-[#e8e4d9] bg-white shadow-[0px_0px_16px_rgba(0,0,0,0.04)]">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-6">
                        {/* Izquierda mobile: hamburger + texto marca */}
                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="relative flex h-8 w-8 flex-col items-center justify-center gap-[5px]"
                                aria-label={
                                    isMobileMenuOpen
                                        ? 'Cerrar menú'
                                        : 'Abrir menú'
                                }
                            >
                                <span
                                    className={`block h-[2px] w-5 bg-[#1B3D6D] transition-all duration-300 ${
                                        isMobileMenuOpen
                                            ? 'translate-y-[7px] rotate-45'
                                            : ''
                                    }`}
                                ></span>
                                <span
                                    className={`block h-[2px] w-5 bg-[#1B3D6D] transition-all duration-300 ${
                                        isMobileMenuOpen ? 'opacity-0' : ''
                                    }`}
                                ></span>
                                <span
                                    className={`block h-[2px] w-5 bg-[#1B3D6D] transition-all duration-300 ${
                                        isMobileMenuOpen
                                            ? '-translate-y-[7px] -rotate-45'
                                            : ''
                                    }`}
                                ></span>
                            </button>
                            <Link
                                href="/"
                                className="font-['Playfair_Display',serif] text-[15px] leading-tight font-bold tracking-wide text-[#1B3D6D] uppercase"
                            >
                                Historias por Correo
                            </Link>
                        </div>

                        {/* Logo desktop */}
                        <Link href="/" className="hidden md:block">
                            <img
                                src="/images/logo-principal.png"
                                alt="Historias por Correo"
                                className="h-12 w-auto object-contain"
                            />
                        </Link>

                        {/* Nav desktop */}
                        <nav className="hidden items-center gap-10 md:flex">
                            <Link
                                href="/"
                                className="border-b-2 border-[#d7c181] pb-1 font-['Inter',sans-serif] text-[15px] font-semibold text-[#1B3D6D] transition duration-300"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="#historias"
                                className="border-b-2 border-transparent pb-1 font-['Inter',sans-serif] text-[15px] font-medium text-[#1B3D6D] transition duration-300 hover:border-[#d7c181]"
                            >
                                Historias
                            </Link>
                            <Link
                                href="#productos"
                                className="border-b-2 border-transparent pb-1 font-['Inter',sans-serif] text-[15px] font-medium text-[#1B3D6D] transition duration-300 hover:border-[#d7c181]"
                            >
                                Productos
                            </Link>
                        </nav>

                        {/* Icons */}
                        <div className="flex items-center gap-2 md:gap-4">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(229,229,229,0.2)] text-[#1B3D6D] transition duration-300 hover:bg-[#eae4d3]"
                                >
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="text-lg"
                                    />
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(229,229,229,0.2)] text-[#1B3D6D] transition duration-300 hover:bg-[#eae4d3]"
                                >
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="text-lg"
                                    />
                                </Link>
                            )}
                            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(229,229,229,0.2)] text-[#1B3D6D] transition duration-300 hover:bg-[#eae4d3]">
                                <FontAwesomeIcon
                                    icon={faCartShopping}
                                    className="text-lg"
                                />
                            </button>
                        </div>
                    </div>

                    {/* Menú mobile desplegable */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
                            isMobileMenuOpen
                                ? 'max-h-[400px] opacity-100'
                                : 'max-h-0 opacity-0'
                        }`}
                    >
                        <nav className="flex flex-col border-t border-[#e8e4d9] bg-white px-5 py-4">
                            <Link
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center border-b border-[#f0ece3] py-4 font-['Inter',sans-serif] text-[15px] font-semibold text-[#1B3D6D]"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="#historias"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center border-b border-[#f0ece3] py-4 font-['Inter',sans-serif] text-[15px] font-medium text-[#1B3D6D]"
                            >
                                Historias
                            </Link>
                            <Link
                                href="#productos"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center border-b border-[#f0ece3] py-4 font-['Inter',sans-serif] text-[15px] font-medium text-[#1B3D6D]"
                            >
                                Productos
                            </Link>
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center py-4 font-['Inter',sans-serif] text-[15px] font-medium text-[#1B3D6D]"
                                >
                                    Mi cuenta
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center py-4 font-['Inter',sans-serif] text-[15px] font-medium text-[#1B3D6D]"
                                >
                                    Iniciar sesión
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                {/* 2. Hero Section */}
                <section className="relative isolate flex h-auto min-h-[600px] w-full flex-col items-center overflow-hidden bg-black/98 p-0 lg:h-[600px]">
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
                    <img
                        src="/images/Estampilla-1.png"
                        className="pointer-events-none absolute top-[23px] -left-[30px] z-[2] hidden h-[126px] w-[147px] opacity-80 lg:block"
                        alt=""
                    />
                    <img
                        src="/images/Estampilla-2.png"
                        className="pointer-events-none absolute top-[435px] left-[582px] z-[3] hidden h-[131px] w-[181px] opacity-60 mix-blend-overlay lg:block"
                        alt=""
                    />

                    {/* Main Container */}
                    <div className="relative bottom-0 left-1/2 z-[4] flex h-full w-full max-w-[1200px] -translate-x-1/2 flex-col items-center justify-end p-3 pb-0 lg:absolute lg:h-[485px] lg:-translate-y-10 lg:justify-center lg:p-0">
                        <div className="flex h-full w-full flex-col items-center justify-end gap-10 lg:h-[565px] lg:flex-row lg:items-start lg:justify-between xl:gap-[298px]">
                            {/* Left container: glass card con título + botón */}
                            <div
                                className={`mx-auto flex w-full max-w-[350px] transform flex-col items-start gap-6 rounded-[4px] bg-white/22 p-4 backdrop-blur-[2px] transition-all duration-1000 ease-out lg:mx-0 lg:h-[308px] lg:max-w-[607px] lg:self-center lg:p-6 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                            >
                                <div className="flex w-full flex-col items-start gap-1 p-0">
                                    <h2 className="font-['Cormorant_Garamond',serif] text-2xl leading-[26px] font-bold text-white">
                                        Una correspondencia para el alma
                                    </h2>
                                    <h1 className="py-2 font-['Playfair_Display',serif] text-[48px] leading-[58px] font-bold tracking-[-1.4px] text-white lg:text-[69px] lg:leading-[82px]">
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
                                    En un mundo que corre, nosotros elegimos la
                                    calma. Recibe cada mes en tu buzón una
                                    historia física, escrita a mano y envuelta
                                    en papel real.
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

                {/* 3. ¿Qué es Historias por Correo? */}
                {/* 3. Seccion ¿Qué es Historia por Correo? */}
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
                                        Capturando la esencia de épocas doradas
                                        y momentos olvidados.
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
                                        Siente el tacto del papel y la emoción
                                        de abrir un sobre real.
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
                                        Que mantienen viva la narrativa y la
                                        sorpresa de una nueva aventura.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Historias (Slider simplificado) */}
                {/* 4. Historias (Slider) */}
                <section
                    id="historias"
                    className="flex w-full flex-col items-center justify-center overflow-hidden bg-[#FFFCF4] py-20 lg:h-[913px] lg:py-[70px]"
                >
                    <div className="flex w-full flex-col items-center gap-[44px]">
                        {/* Header */}
                        <div className="flex w-full max-w-[1296px] flex-col items-center gap-4 px-6 lg:px-[72px]">
                            <h2 className="text-center font-['Playfair_Display',serif] text-[32px] leading-[65px] font-semibold text-[#1B3D6D] md:text-[49px]">
                                Historias
                            </h2>
                            <div className="h-[4px] w-[150px] rounded-[4px] bg-[#1B3D6D] md:w-[250px]"></div>
                        </div>

                        {/* Slider Content - Full bleed container */}
                        <div className="relative w-full overflow-hidden py-4">
                            {/* Cards Track */}
                            <div
                                className={`flex flex-row items-center gap-8 ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                                style={{
                                    transform: `translateX(calc(50vw - (min(100vw - 48px, 700px) / 2) - ${activeStorySlide} * (min(100vw - 48px, 700px) + 32px)))`,
                                }}
                                onTransitionEnd={handleTransitionEnd}
                            >
                                {extendedStories.map((story, i) => (
                                    <div
                                        key={i}
                                        className={`group relative h-[450px] w-[calc(100vw-48px)] max-w-[700px] shrink-0 overflow-hidden rounded-[4px] bg-black lg:h-[540px] lg:w-[700px] ${
                                            isTransitioning
                                                ? 'transition-opacity duration-500'
                                                : ''
                                        } ${
                                            activeStorySlide !== i
                                                ? 'opacity-60 grayscale-[30%]'
                                                : 'opacity-100 grayscale-0'
                                        }`}
                                    >
                                        {/* Imagen de fondo */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{
                                                backgroundImage: `url('${story.img}')`,
                                            }}
                                        ></div>

                                        {/* Badge */}
                                        <div className="absolute top-[18px] right-6 flex items-center justify-center rounded-[2px] bg-[#1B3D6D] px-[10px] py-[3px]">
                                            <span className="font-['Inter',sans-serif] text-[13px] leading-[16px] font-normal text-white">
                                                Suscripción disponible
                                            </span>
                                        </div>

                                        {/* Degradado e info */}
                                        <div className="absolute bottom-0 left-0 flex w-full flex-col items-start gap-6 bg-black/65 px-6 py-4 lg:h-[216px]">
                                            <div className="flex w-full flex-col items-start gap-2">
                                                <h3 className="font-['Playfair_Display',serif] text-[20px] leading-[33px] font-semibold text-white lg:text-[25px]">
                                                    {story.title}
                                                </h3>
                                                <p className="line-clamp-3 font-['Inter',sans-serif] text-[14px] leading-[22px] font-normal text-white lg:line-clamp-2 lg:text-[16px]">
                                                    {story.desc}
                                                </p>
                                                <h4 className="mt-1 font-['Playfair_Display',serif] text-[20px] leading-[29px] font-bold text-white lg:text-[22px]">
                                                    {story.price}{' '}
                                                    <span className="text-sm font-normal">
                                                        por entrega
                                                    </span>
                                                </h4>
                                            </div>

                                            <button className="flex h-[39px] w-[139px] items-center justify-center rounded-[2px] border border-white bg-white/20 px-5 py-[10px] transition-colors duration-300 group-hover:bg-white/30 hover:bg-white hover:text-[#1B3D6D]">
                                                <span className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold text-white transition-colors duration-300 group-hover:text-[#111]">
                                                    Ver historia
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Slider Controls */}
                        <div className="z-10 mt-4 flex flex-col items-center gap-5">
                            <div className="flex flex-row items-center gap-10 lg:gap-12">
                                <button
                                    onClick={handlePrevStory}
                                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] lg:h-[60px] lg:w-[60px]"
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
                                    onClick={handleNextStory}
                                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] lg:h-[60px] lg:w-[60px]"
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
                            {/* Botón CTA mobile */}
                            <Link
                                href="#historias"
                                className="flex h-[39px] items-center justify-center rounded-[2px] bg-[#1B3D6D] px-5 lg:hidden"
                            >
                                <span className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold text-white">
                                    Ver todas las historias
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 5. ¿Cómo funciona? */}
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
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="3"
                                                ></circle>
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

                {/* 6. Objetos que acompañan */}
                <section
                    id="productos"
                    className="flex w-full flex-col items-center justify-center overflow-hidden bg-[#FFFCF4] py-20 lg:py-[70px]"
                >
                    <div className="flex w-full flex-col items-center gap-[44px]">
                        {/* Header */}
                        <div className="flex w-full max-w-[1296px] flex-col items-center gap-4 px-6 lg:px-[72px]">
                            <h2 className="text-center font-['Playfair_Display',serif] text-[32px] leading-[65px] font-semibold text-[#1B3D6D] md:text-[49px]">
                                Objetos que acompañan tus historias
                            </h2>
                            <div className="h-[4px] w-[150px] rounded-[4px] bg-[#1B3D6D] md:w-[250px]"></div>
                        </div>

                        {/* Slider Content */}
                        <div className="relative w-full overflow-hidden py-4">
                            <div
                                className={`flex flex-row items-center gap-[24px] ${isProductTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                                style={{
                                    transform: `translateX(calc(50vw - (min(100vw - 48px, 416px) / 2) - ${activeProductSlide} * (min(100vw - 48px, 416px) + 24px)))`,
                                }}
                                onTransitionEnd={handleProductTransitionEnd}
                            >
                                {extendedProducts.map((product, i) => (
                                    <div
                                        key={i}
                                        className="group relative flex w-[calc(100vw-48px)] max-w-[416px] shrink-0 flex-col overflow-hidden border border-[#F2F2F2] bg-white shadow-sm transition-shadow duration-300 hover:shadow-md lg:w-[416px]"
                                    >
                                        <div className="h-[260px] w-full overflow-hidden">
                                            <img
                                                src={product.img}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex shrink-0 flex-grow flex-col items-start gap-4 border-t border-[#F2F2F2] p-6 lg:p-8">
                                            <div className="flex flex-col gap-2">
                                                <h3 className="font-['Inter',sans-serif] text-[20px] font-semibold text-[#1B3D6D]">
                                                    {product.name}
                                                </h3>
                                                <p className="font-['Inter',sans-serif] text-[14px] leading-relaxed font-light text-[#A4A4A4]">
                                                    {product.desc}
                                                </p>
                                            </div>

                                            {/* Spacer to push footer to bottom if desc is short */}
                                            <div className="flex-1"></div>

                                            <div className="flex w-full flex-row items-center justify-between">
                                                <span className="font-['Playfair_Display',serif] text-[25px] font-bold text-[#1B3D6D]">
                                                    {product.price}
                                                </span>
                                                <button className="flex h-[38px] items-center justify-center bg-[#1B3D6D] px-6 py-2 transition hover:bg-[#111]">
                                                    <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-white">
                                                        Ver producto
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Slider Controls */}
                        <div className="z-10 mt-4 flex flex-col items-center gap-5">
                            <div className="flex flex-row items-center gap-10 lg:gap-12">
                                <button
                                    onClick={handlePrevProduct}
                                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] lg:h-[60px] lg:w-[60px]"
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
                                    onClick={handleNextProduct}
                                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] lg:h-[60px] lg:w-[60px]"
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
                            {/* CTA button mobile para productos */}
                            <Link
                                href="#productos"
                                className="flex h-[39px] items-center justify-center rounded-[2px] bg-[#1B3D6D] px-5 lg:hidden"
                            >
                                <span className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold text-white">
                                    Ver todos los objetos
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 7. Testimonios */}
                <section className="flex w-full flex-col items-center justify-center overflow-hidden bg-[#FFFFFF] py-20 lg:py-[70px]">
                    <div className="flex w-full flex-col items-center gap-[44px]">
                        {/* Header */}
                        <div className="flex w-full max-w-[1296px] flex-col items-center gap-4 px-6 lg:px-[72px]">
                            <h2 className="text-center font-['Playfair_Display',serif] text-[32px] leading-[65px] font-semibold text-[#1B3D6D] md:text-[49px]">
                                Lo que dicen nuestros lectores
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

                {/* 8. CTA Final */}
                <section className="flex w-full flex-col items-center justify-center bg-[#FFFCF4] px-6 py-14 lg:py-[100px]">
                    <div className="relative flex w-full max-w-[850px] flex-col items-center justify-center gap-[44px] overflow-hidden rounded-[2px] bg-[#1B3D6D] px-6 py-10 shadow-[0px_0px_16px_rgba(0,0,0,0.04)] md:px-[56px] md:py-[60px]">
                        {/* Background Decorative Elements */}
                        {/* Left Decorations */}
                        <div className="pointer-events-none absolute top-4 -left-10 hidden opacity-10 md:block">
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
                        <div className="pointer-events-none absolute top-24 -left-10 hidden opacity-10 md:block">
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
                                Algunas historias merecen seguir llegando
                            </h2>
                            <div className="h-[4px] w-[150px] rounded-[4px] bg-[#FDF6E3] md:w-[250px]"></div>
                        </div>

                        {/* Button */}
                        <Link
                            href="#historias"
                            className="group z-10 inline-flex h-[47px] w-full max-w-[310px] items-center justify-center rounded-[2px] border border-white bg-transparent px-[20px] py-[14px] transition duration-300 hover:bg-white"
                        >
                            <span className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold text-white transition group-hover:text-[#1B3D6D]">
                                Explorar historias
                            </span>
                        </Link>
                    </div>
                </section>

                {/* 9. Footer */}
                <footer className="flex w-full flex-col items-center border-t border-[#9E9E9E] bg-[#242424] px-3 py-14 lg:px-[133px] lg:py-[56px]">
                    <div className="mb-[30px] flex w-full max-w-[1440px] flex-col items-center justify-between gap-9 px-3 md:flex-row md:items-start md:gap-[82px] lg:gap-[80px]">
                        {/* Col 1: Logo & Socials */}
                        <div className="flex w-full shrink-0 flex-col items-center gap-4 md:w-[172px] md:items-start">
                            <img
                                src="/images/logo-white.png"
                                alt="Historias por Correo"
                                className="h-[97px] w-[172px] object-contain brightness-0 invert"
                            />
                            <div className="flex w-[172px] flex-row justify-between gap-[24px]">
                                <a
                                    href="#"
                                    className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white transition hover:opacity-80"
                                >
                                    <i className="fa-brands fa-facebook-f text-[18px] text-[#242424]"></i>
                                </a>
                                <a
                                    href="#"
                                    className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#f2f2f2] transition hover:opacity-80"
                                >
                                    <i className="fa-brands fa-instagram text-[18px] text-[#242424]"></i>
                                </a>
                                <a
                                    href="#"
                                    className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#f2f2f2] transition hover:opacity-80"
                                >
                                    <i className="fa-brands fa-youtube text-[14px] text-[#242424]"></i>
                                </a>
                            </div>
                        </div>

                        {/* Col 2: Info */}
                        <div className="flex w-full flex-col items-center gap-[16px] md:w-auto md:max-w-[376px] md:items-start">
                            <h4 className="font-['Inter',sans-serif] text-[20px] leading-[24px] font-semibold text-white">
                                Información del contacto
                            </h4>
                            <div className="flex flex-col items-center gap-[12px] md:items-start">
                                <div className="flex flex-col items-center gap-[8px] text-center md:flex-row md:items-start md:text-left">
                                    <i className="fa-solid fa-location-dot mt-[2px] text-[18px] text-[#f2f2f2] md:mt-1"></i>
                                    <span className="w-full max-w-[344px] font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white">
                                        91331 Wiegand Harbors, East Nelson
                                        84959-3167
                                    </span>
                                </div>
                                <div className="flex flex-row items-center gap-[8px]">
                                    <i className="fa-solid fa-phone text-[16px] text-[#f2f2f2]"></i>
                                    <span className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white">
                                        1-615-883-6913 x15624
                                    </span>
                                </div>
                                <div className="flex flex-row items-center gap-[8px]">
                                    <i className="fa-solid fa-envelope text-[16px] text-[#f2f2f2]"></i>
                                    <span className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white">
                                        historias.correo@gmail.com
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Col 3: Acceso */}
                        <div className="flex w-full flex-col items-center gap-[16px] md:w-[190px] md:items-start">
                            <h4 className="font-['Inter',sans-serif] text-[20px] leading-[24px] font-semibold text-white">
                                Acceso
                            </h4>
                            <div className="flex flex-col items-center gap-[12px] md:items-start">
                                <Link
                                    href="/"
                                    className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white transition hover:underline"
                                >
                                    Inicio
                                </Link>
                                <Link
                                    href="#historias"
                                    className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white transition hover:underline"
                                >
                                    Historias
                                </Link>
                                <Link
                                    href="#productos"
                                    className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white transition hover:underline"
                                >
                                    Productos
                                </Link>
                            </div>
                        </div>

                        {/* Col 4: Políticas */}
                        <div className="flex w-full flex-col items-center gap-[16px] md:w-[190px] md:items-start">
                            <h4 className="font-['Inter',sans-serif] text-[20px] leading-[24px] font-semibold text-white">
                                Políticas
                            </h4>
                            <div className="flex flex-col items-center gap-[12px] md:items-start">
                                <a
                                    href="#"
                                    className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white transition hover:underline"
                                >
                                    Política de privacidad
                                </a>
                                <a
                                    href="#"
                                    className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white transition hover:underline"
                                >
                                    Términos y condiciones
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 w-full text-center font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white md:mt-[30px]">
                        © 2026 Historias por correo. Reservados todos los
                        derechos
                    </div>
                </footer>
            </div>
        </>
    );
}
