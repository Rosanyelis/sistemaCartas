import { Icon } from '@/components/ui/icon';
import type { PanelNavItem } from '@/config/panel-nav';
import { Link } from '@inertiajs/react';
import { PanelNavPowerIcon } from '@/components/panel/panel-nav-icons';

export type PanelSidebarProps = {
    items: PanelNavItem[];
    isOpen: boolean;
    onLogoutClick: () => void;
};

const navItemBase =
    'flex w-full items-center rounded-[4px] text-left transition-colors duration-200';

function navItemClass(isOpen: boolean, active: boolean): string {
    const layout = isOpen ? 'gap-4 px-4 py-2' : 'justify-center px-0 py-2';
    const state = active
        ? 'bg-[rgba(245,245,255,0.9)] text-[#1B3D6D] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)]'
        : 'text-white hover:bg-white/8';

    return `${navItemBase} ${layout} ${state}`;
}

const labelClass = (isOpen: boolean) =>
    `font-['Inter'] text-[16px] leading-[22px] font-normal whitespace-nowrap transition-all duration-300 ${
        isOpen ? 'w-auto opacity-100' : 'pointer-events-none w-0 translate-x-4 opacity-0'
    }`;

/**
 * Sidebar unificado admin/cliente según Figma 15519:10196 (NfblilJds13pHlU1YbWXLp).
 */
export function PanelSidebar({ items, isOpen, onLogoutClick }: PanelSidebarProps) {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#1B3D6D] transition-all duration-300 ${
                isOpen
                    ? 'w-[245px] translate-x-0 shadow-[0px_0px_10px_rgba(36,16,167,0.15)]'
                    : 'w-[245px] -translate-x-full md:w-[72px] md:translate-x-0 md:shadow-none'
            }`}
        >
            <div
                className={`flex h-full flex-col transition-all duration-300 ${isOpen ? 'p-6' : 'px-3 py-6'}`}
            >
                <div
                    className={`flex shrink-0 justify-center transition-all duration-300 ${
                        isOpen
                            ? 'mb-3 opacity-100'
                            : 'pointer-events-none mb-0 h-0 scale-50 opacity-0'
                    }`}
                >
                    <Link href="/" className="block">
                        <img
                            src="/images/logo-principal.png"
                            alt="Historias por correo"
                            className="h-[86px] w-[150px] max-w-full object-contain brightness-0 invert"
                        />
                    </Link>
                </div>

                {isOpen ? <div className="mb-3 h-[0.5px] w-full shrink-0 bg-[#F2F2F2]" /> : null}

                <nav className="flex min-h-0 flex-1 flex-col gap-3">
                    <div className="flex flex-1 flex-col gap-3">
                        {items.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={navItemClass(isOpen, item.active)}
                            >
                                <span className="flex size-6 shrink-0 items-center justify-center">
                                    <Icon iconNode={item.icon} className="size-6" />
                                </span>
                                <span className={labelClass(isOpen)}>{item.name}</span>
                            </Link>
                        ))}

                        <div className="h-[0.5px] w-full shrink-0 bg-[#F2F2F2]" />

                        <button
                            type="button"
                            onClick={onLogoutClick}
                            className={`${navItemClass(isOpen, false)} text-white`}
                        >
                            <span className="flex size-6 shrink-0 items-center justify-center">
                                <Icon iconNode={PanelNavPowerIcon} className="size-6" />
                            </span>
                            <span className={labelClass(isOpen)}>Cerrar sesión</span>
                        </button>
                    </div>

                    
                </nav>

                <div
                    className={`mt-6 hidden w-full text-center font-['Inter'] text-[8.5px] leading-normal text-white transition-all duration-300 md:block ${
                        isOpen ? 'opacity-100' : 'pointer-events-none scale-75 opacity-0'
                    }`}
                >
                    <p className="text-[10px]">© Historias por correo <br/> Todos los derechos reservados</p>
                </div>
            </div>
        </aside>
    );
}
