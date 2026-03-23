import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { home } from '@/routes';

export default function AuthCustomLayout({
    children,
    title,
    description,
}: {
    children: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex min-h-screen w-full flex-col font-montserrat">
            {/* Top Bar (Rectangle 18142) */}
            <header className="fixed top-0 z-50 flex h-[74px] w-full items-center bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.1)]">
                <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center px-6 md:justify-start md:px-10 lg:px-[237px]">
                    <Link href={home()}>
                        {/* Mobile Logo */}
                        <img
                            src="/images/logo-letras-sin-fondo.png"
                            alt="Historias por Correo"
                            className="h-[24px] w-[216px] md:hidden"
                        />
                        {/* Desktop Logo */}
                        <img
                            src="/images/logo-principal.png"
                            alt="Historias por Correo"
                            className="hidden h-auto w-[110px] md:block"
                        />
                    </Link>
                </div>
            </header>

            {/* Background (Rectangle 18141) */}
            <main className="mt-[74px] flex min-h-[calc(100vh-74px)] w-full flex-col items-center justify-center bg-[#F4F4F6] px-4 py-8 md:py-12">
                {/* Card (Rectangle 18140) */}
                <div className="flex w-full max-w-[677px] flex-col items-center rounded-[25px] border border-white bg-white px-6 py-10 shadow-[2px_10px_20px_rgba(0,0,0,0.06)] md:px-20 md:py-[50px]">
                    {(title || description) && (
                        <div className="mb-6 text-center md:mb-10">
                            {title && (
                                <h1 className="text-[26px] leading-tight font-medium text-[#31374F] md:text-[28px] md:leading-[40px]">
                                    {title}
                                </h1>
                            )}
                            {description && (
                                <p className="mt-2 text-[15px] leading-relaxed font-normal text-[#31374F] md:text-[16px] md:leading-[24px]">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex w-full max-w-[463px] flex-col gap-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
