import {
    faBars,
    faCartShopping,
    faPowerOff,
    faUser,
    faUsers,
    faTriangleExclamation,
    faHouse,
    faBook,
    faBoxOpen,
    faUserGroup,
    faFileLines,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { logout } from '@/routes';

interface UserLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function UserLayout({ children, title }: UserLayoutProps) {
    const { auth } = usePage().props as any;
    const { url } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(
        typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
    );
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const isAdmin = auth.user.role === 'admin';

    const menuItems = isAdmin
        ? [
              {
                  name: 'Panel',
                  icon: faHouse,
                  href: '/dashboard',
                  active: url === '/dashboard',
              },
              {
                  name: 'Ordenes',
                  icon: faCartShopping,
                  href: '/orders',
                  active: url.startsWith('/orders'),
              },
              {
                  name: 'Suscripciones',
                  icon: faUsers,
                  href: '/subscriptions',
                  active: url.startsWith('/subscriptions'),
              },
              {
                  name: 'Clientes',
                  icon: faUserGroup,
                  href: '/clients',
                  active: url.startsWith('/clients'),
              },
              {
                  name: 'Historias',
                  icon: faBook,
                  href: '/admin/stories',
                  active: url.startsWith('/admin/stories'),
              },
              {
                  name: 'Productos',
                  icon: faBoxOpen,
                  href: '/admin/products',
                  active: url.startsWith('/admin/products'),
              },
          ]
        : [
              {
                  name: 'Ordenes',
                  icon: faCartShopping,
                  href: '/orders',
                  active: url.startsWith('/orders'),
              },
              {
                  name: 'Suscripciones',
                  icon: faUsers,
                  href: '/subscriptions',
                  active: url.startsWith('/subscriptions'),
              },
              {
                  name: 'Perfil',
                  icon: faUser,
                  href: '/profile',
                  active: url.startsWith('/profile'),
              },
          ];

    return (
        <div className="flex min-h-screen bg-[#F5F6F7]">
            <Head title={title} />
            {/* Overlay Mobile */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden"
                />
            )}
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-brand-blue transition-all duration-300 ${
                    isSidebarOpen
                        ? 'w-[245px] translate-x-0 shadow-[0px_0px_25px_rgba(0,0,0,0.3)]'
                        : 'w-[245px] -translate-x-full md:w-[72px] md:translate-x-0 md:shadow-none'
                }`}
            >
                <div
                    className={`flex h-full flex-col py-6 transition-all duration-300 ${isSidebarOpen ? 'px-5' : 'px-3'}`}
                >
                    {/* Logo */}
                    <div
                        className={`mb-8 flex justify-center transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'pointer-events-none h-0 scale-50 opacity-0'}`}
                    >
                        <Link href="/">
                            <img
                                src="/images/logo-principal.png"
                                alt="Logo"
                                className="h-[58px] w-[110px] object-contain brightness-0 invert"
                            />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center rounded-[4px] transition-all duration-200 ${isSidebarOpen ? 'gap-3 px-3.5 py-2.5' : 'justify-center px-0 py-3'} ${
                                    item.active
                                        ? 'bg-[rgba(245,245,255,0.85)] text-[#1B3D6D] shadow-sm'
                                        : 'text-white/90 hover:bg-[rgba(255,255,255,0.08)]'
                                }`}
                            >
                                <span className="flex size-5 shrink-0 items-center justify-center">
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className={
                                            isSidebarOpen ? 'size-4' : 'size-5'
                                        }
                                    />
                                </span>
                                <span
                                    className={`font-['Inter'] text-[14px] font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'pointer-events-none w-0 translate-x-4 opacity-0' : 'w-auto opacity-100'}`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Divider */}
                    <div className="my-6 h-[0.5px] bg-[#F2F2F2] opacity-50" />

                    {/* Logout */}
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className={`flex w-full items-center rounded-[4px] text-left text-white transition-all hover:bg-[rgba(255,255,255,0.1)] ${isSidebarOpen ? 'gap-4 px-4 py-3' : 'justify-center px-0 py-4'}`}
                    >
                        <span className="flex size-6 shrink-0 items-center justify-center">
                            <FontAwesomeIcon
                                icon={faPowerOff}
                                className={isSidebarOpen ? 'size-5' : 'size-6'}
                            />
                        </span>
                        <span
                            className={`font-['Inter'] text-[16px] font-normal whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'pointer-events-none w-0 translate-x-4 opacity-0' : 'w-auto opacity-100'}`}
                        >
                            Cerrar sesión
                        </span>
                    </button>

                    {/* Footer Copyright */}
                    <div
                        className={`mt-auto space-y-1 pt-6 text-center font-['Inter'] text-[8.5px] text-white transition-all duration-300 ${!isSidebarOpen ? 'pointer-events-none scale-75 opacity-0' : 'opacity-100'}`}
                    >
                        <p>© Historias por correo</p>
                        <div className="mx-auto h-2 w-px bg-white opacity-50" />
                        <p>Todos los derechos reservados</p>
                    </div>
                </div>
            </aside>
            {/* Main Content Area */}
            <div
                className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-[245px]' : 'ml-0 md:ml-[72px]'}`}
            >
                {/* Topbar: sticky en móvil para alinear con el diseño de referencia */}
                <div className="sticky top-0 z-30 shrink-0 bg-[#F5F6F7] px-3 pb-2 pt-1.5 md:static md:bg-transparent md:px-5 md:pb-0 md:pt-1.5">
                    <header className="flex h-[52px] items-center justify-between rounded-[4px] bg-white px-4 shadow-[0px_0px_15px_rgba(36,16,167,0.1)] md:px-5">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-1.5 text-[#1B3D6D] transition hover:opacity-80"
                        >
                            <FontAwesomeIcon icon={faBars} className="size-4" />
                        </button>

                        {/* Logo Mobile */}
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
                                            {auth.user.name}
                                        </p>
                                        <p className="font-['Inter'] text-[10px] font-normal text-[#7B7B7B]">
                                            Usuario
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <img
                                            src={
                                                auth.user.avatar ||
                                                '/images/avatar-placeholder.jpg'
                                            }
                                            alt="Profile"
                                            className="size-[32px] rounded-full border-2 border-white object-cover shadow-sm"
                                        />
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
            {/* Modal de Cerrar Sesión */}
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
                                    ¿Estás seguro de que deseas cerrar tu
                                    sesión?
                                </h3>

                                <div className="h-[3px] w-[90px] rounded-[2px] bg-[#1B3D6D]" />

                                <p className="font-['Inter'] text-[16px] leading-[19px] text-[#7B7B7B]">
                                    Si cierras sesión, te llevará de vuelta a la
                                    página de inicio
                                </p>
                            </div>

                            <div className="flex w-full gap-[18px]">
                                <button
                                    onClick={() => router.post(logout().url)}
                                    className="flex h-[47px] flex-1 items-center justify-center rounded-[2px] bg-brand-blue px-5 py-[14px] text-[16px] font-semibold text-white transition-all hover:bg-brand-blue/90"
                                >
                                    Continuar
                                </button>
                                <button
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
        </div>
    );
}
