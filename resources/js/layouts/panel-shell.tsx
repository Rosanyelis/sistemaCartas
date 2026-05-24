import { faBars, faTriangleExclamation, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { appFontLinks } from '@/components/AppFontLinks';
import { FlashToasts } from '@/components/FlashToasts';
import { PanelSidebar } from '@/components/panel/PanelSidebar';
import type { PanelNavItem } from '@/config/panel-nav';
import type { User } from '@/types/auth';
import { Head, Link, router } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { logout } from '@/routes';
import { getUserInitials } from '@/lib/user-initials';

export type PanelShellProps = {
    children: ReactNode;
    title?: string;
    navItems: PanelNavItem[];
    isAdmin: boolean;
    user: User;
};

/**
 * Marca común del panel (sidebar, cabecera, modal de cierre de sesión) para admin y cliente.
 */
export default function PanelShell({
    children,
    title,
    navItems,
    isAdmin,
    user,
}: PanelShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(
        typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
    );
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const clienteAvatarSrc = (
        user.avatar_url ??
        user.avatar ??
        ''
    ).trim();

    return (
        <div className="flex min-h-screen bg-[#F5F6F7] font-['Inter',sans-serif]">
            <Head title={title}>
                {appFontLinks()}
            </Head>
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden"
                />
            )}
            <PanelSidebar
                items={navItems}
                isOpen={isSidebarOpen}
                onLogoutClick={() => setIsLogoutModalOpen(true)}
            />
            <div
                className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-[245px]' : 'ml-0 md:ml-[72px]'}`}
            >
                <div className="sticky top-0 z-30 shrink-0 bg-[#F5F6F7] px-3 pb-2 pt-1.5 md:static md:bg-transparent md:px-5 md:pb-0 md:pt-1.5">
                    <header className="flex h-[52px] items-center justify-between rounded-[4px] bg-white px-4 shadow-[0px_0px_15px_rgba(36,16,167,0.1)] md:px-5">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-1.5 text-[#1B3D6D] transition hover:opacity-80"
                        >
                            <FontAwesomeIcon icon={faBars} className="size-4" />
                        </button>

                        <div className="flex flex-1 items-center justify-center md:hidden">
                            <span className="text-[12px] font-bold tracking-[0.05em] text-[#1B3D6D] uppercase">
                                HISTORIAS POR CORREO
                            </span>
                            <img
                                src="/images/logo-principal.png"
                                alt="Logo"
                                className="ml-2 h-5 w-auto object-contain opacity-40 invert filter"
                                style={{ filter: 'brightness(0) invert(0.8)' }}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            {isAdmin ? (
                                <div className="hidden items-center justify-center rounded border border-[#E5E7EB] px-2 py-1.5 md:flex">
                                    <span className="mr-2 text-[14px] font-medium text-[#1B3D6D]">
                                        Usuario Admin
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <div className="hidden text-right sm:block">
                                        <p className="font-['Inter'] text-[12px] leading-tight font-semibold text-[#1B3D6D]">
                                            {user.name}
                                        </p>
                                        <p className="font-['Inter'] text-[10px] font-normal text-[#7B7B7B]">
                                            Usuario
                                        </p>
                                    </div>
                                    <div className="relative">
                                        {clienteAvatarSrc ? (
                                            <img
                                                src={clienteAvatarSrc}
                                                alt=""
                                                className="size-[32px] rounded-full border-2 border-white object-cover shadow-sm"
                                            />
                                        ) : (
                                            <div
                                                className="flex size-[32px] items-center justify-center rounded-full border-2 border-white bg-[#E2E8F0] text-[11px] font-bold tracking-tight text-[#1B3D6D] shadow-sm"
                                                aria-hidden
                                            >
                                                {getUserInitials(user.name)}
                                            </div>
                                        )}
                                        <div className="absolute -top-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-[#22AD5C]" />
                                    </div>
                                </>
                            )}
                            {isAdmin && (
                                <div className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#E5E7EB] text-[#1B3D6D] md:hidden">
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="text-[14px]"
                                    />
                                </div>
                            )}
                        </div>
                    </header>
                </div>

                <main className="min-w-0 flex-1 overflow-x-hidden px-2 pb-6 pt-0 md:px-3 md:pb-8 md:pt-1">
                    {children}
                </main>
            </div>
            {isLogoutModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 animate-in bg-black/40 duration-300 fade-in"
                        onClick={() => setIsLogoutModalOpen(false)}
                    />
                    <div className="relative w-full max-w-[490px] animate-in rounded-[16px] bg-white p-[30px] text-center shadow-[0px_0px_20px_rgba(36,16,167,0.15)] duration-300 zoom-in">
                        <div className="flex flex-col items-center gap-[35px]">
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F2F2F2]">
                                    <FontAwesomeIcon
                                        icon={faTriangleExclamation}
                                        className="h-[40px] w-[40px] text-[#1B3D6D]"
                                        style={{
                                            fill: 'none',
                                            stroke: 'currentColor',
                                            strokeWidth: '32px',
                                        }}
                                    />
                                </div>

                                <h3 className="font-['Inter'] text-[25px] leading-[30px] font-semibold text-[#111928]">
                                    ¿Estás seguro de que deseas cerrar tu sesión?
                                </h3>

                                <div className="h-[3px] w-[90px] rounded-[2px] bg-[#1B3D6D]" />

                                <p className="font-['Inter'] text-[16px] leading-[19px] text-[#7B7B7B]">
                                    Si cierras sesión, te llevará de vuelta a la página de inicio
                                </p>
                            </div>

                            <div className="flex w-full gap-[18px]">
                                <button
                                    type="button"
                                    onClick={() => router.post(logout().url)}
                                    className="flex h-[47px] flex-1 items-center justify-center rounded-[2px] bg-brand-blue px-5 py-[14px] text-[16px] font-semibold text-white transition-all hover:bg-brand-blue/90"
                                >
                                    Continuar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className="flex h-[47px] flex-1 items-center justify-center rounded-[2px] border border-[#1B3D6D] bg-white px-5 py-[14px] text-[16px] font-semibold text-[#1B3D6D] transition-all hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <FlashToasts />
        </div>
    );
}
