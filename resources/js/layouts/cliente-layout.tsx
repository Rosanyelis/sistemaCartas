import { Head, Link, usePage } from '@inertiajs/react';
import { useState, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

interface ClienteLayoutProps {
    children: ReactNode;
}

export default function ClienteLayout({ children }: ClienteLayoutProps) {
    const { auth } = usePage().props as any;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#FFFCF4] font-['Inter',sans-serif] text-[#3e352f]">
            {/* Header / Navegación */}
            <header className="fixed top-0 z-50 w-full border-b border-[#e8e4d9] bg-white shadow-[0px_0px_16px_rgba(0,0,0,0.04)]">
                <div className="mx-auto flex h-[80px] max-w-7xl items-center justify-between px-5 md:px-[71px]">
                    {/* Izquierda mobile: hamburger + texto marca */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="relative flex h-8 w-8 flex-col items-center justify-center gap-[5px]"
                            aria-label={
                                isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'
                            }
                        >
                            <span
                                className={`block h-[2px] w-5 bg-[#1B3D6D] transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
                            ></span>
                            <span
                                className={`block h-[2px] w-5 bg-[#1B3D6D] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}
                            ></span>
                            <span
                                className={`block h-[2px] w-5 bg-[#1B3D6D] transition-all duration-300 ${isMobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
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
                    <Link href="/" className="mx-auto hidden md:block lg:mx-0">
                        <img
                            src="/images/logo-principal.png"
                            alt="Historias por Correo"
                            className="h-[70px] w-[100px] object-contain"
                        />
                    </Link>

                    {/* Nav desktop + Icons */}
                    <div className="hidden items-center gap-[36px] md:flex">
                        <nav className="flex items-center gap-[34px] pt-[5px]">
                            <Link
                                href="/"
                                className="border-b-2 border-transparent pb-1 font-['Inter',sans-serif] text-[16px] leading-[19px] font-normal text-[#1B3D6D] transition duration-300 hover:border-[#D7C181] focus:border-[#D7C181]"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/historias"
                                className="border-b-2 border-transparent pb-1 font-['Inter',sans-serif] text-[16px] leading-[19px] font-normal text-[#1B3D6D] transition duration-300 hover:border-[#D7C181] focus:border-[#D7C181]"
                            >
                                Historias
                            </Link>
                            <Link
                                href="/#productos"
                                className="border-b-2 border-transparent pb-1 font-['Inter',sans-serif] text-[16px] leading-[19px] font-normal text-[#1B3D6D] transition duration-300 hover:border-[#D7C181] focus:border-[#D7C181]"
                            >
                                Productos
                            </Link>
                        </nav>

                        {/* Icons */}
                        <div className="flex items-center gap-[24px]">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="flex h-10 w-10 items-center justify-center bg-[rgba(229,229,229,0.2)] text-[#1B3D6D] transition duration-300 hover:bg-[#eae4d3]"
                                >
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="text-xl"
                                    />
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex h-10 w-10 items-center justify-center bg-[rgba(229,229,229,0.2)] text-[#1B3D6D] transition duration-300 hover:bg-[#eae4d3]"
                                >
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="text-xl"
                                    />
                                </Link>
                            )}
                            <button className="flex h-10 w-10 items-center justify-center bg-[rgba(229,229,229,0.2)] text-[#1B3D6D] transition duration-300 hover:bg-[#eae4d3]">
                                <FontAwesomeIcon
                                    icon={faCartShopping}
                                    className="text-xl"
                                />
                            </button>
                        </div>
                    </div>

                    {/* Icons mobile */}
                    <div className="flex items-center gap-2 md:hidden">
                        {auth?.user ? (
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
                    className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <nav className="flex flex-col border-t border-[#e8e4d9] bg-white px-5 py-4">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center border-b border-[#f0ece3] py-4 font-['Inter',sans-serif] text-[15px] font-medium text-[#1B3D6D]"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/historias"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center border-b border-[#f0ece3] py-4 font-['Inter',sans-serif] text-[15px] font-semibold text-[#1B3D6D]"
                        >
                            Historias
                        </Link>
                        <Link
                            href="/#productos"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center border-b border-[#f0ece3] py-4 font-['Inter',sans-serif] text-[15px] font-medium text-[#1B3D6D]"
                        >
                            Productos
                        </Link>
                        {auth?.user ? (
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

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="flex w-full flex-col items-center border-t border-[#9E9E9E] bg-[#242424] px-3 py-14 lg:px-[133px] lg:py-[56px]">
                <div className="mb-[30px] flex w-full max-w-[1440px] flex-col items-center justify-between gap-9 px-3 md:flex-row md:items-start md:gap-[82px] lg:gap-[80px]">
                    {/* Col 1: Logo & Socials */}
                    <div className="flex w-full shrink-0 flex-col items-center gap-[51px] md:w-[172px] md:items-start">
                        <img
                            src="/images/logo-white.png"
                            alt="Historias por Correo"
                            className="h-[97px] w-[172px] object-contain brightness-0 invert"
                        />
                        <div className="flex w-[172px] flex-row justify-between gap-[24px]">
                            <a
                                href="#"
                                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white text-[#242424] transition hover:opacity-80"
                            >
                                <i className="fa-brands fa-facebook-f text-[18px]"></i>
                            </a>
                            <a
                                href="#"
                                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#f2f2f2] text-[#242424] transition hover:opacity-80"
                            >
                                <i className="fa-brands fa-instagram text-[18px]"></i>
                            </a>
                            <a
                                href="#"
                                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#f2f2f2] text-[#242424] transition hover:opacity-80"
                            >
                                <i className="fa-brands fa-youtube text-[14px]"></i>
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
                                <i className="fa-solid fa-location-dot mt-[2px] w-[24px] text-center text-[18px] text-[#f2f2f2] md:mt-1"></i>
                                <span className="w-full max-w-[344px] font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white">
                                    91331 Wiegand Harbors, East Nelson
                                    84959-3167
                                </span>
                            </div>
                            <div className="flex flex-row items-center gap-[8px]">
                                <i className="fa-solid fa-phone w-[24px] text-center text-[16px] text-white"></i>
                                <span className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white">
                                    1-615-883-6913 x15624
                                </span>
                            </div>
                            <div className="flex flex-row items-center gap-[8px]">
                                <i className="fa-solid fa-envelope w-[24px] text-center text-[16px] text-[#f2f2f2]"></i>
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
                                href="/historias"
                                className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white transition hover:underline"
                            >
                                Historias
                            </Link>
                            <Link
                                href="/#productos"
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

                <div className="mt-8 w-full max-w-[460px] text-center font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white md:max-w-none">
                    © 2026 Historias por correo. Reservados todos los derechos
                </div>
            </footer>
        </div>
    );
}
