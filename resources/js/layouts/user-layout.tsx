import { faBars, faCartShopping, faPowerOff, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

    const menuItems = [
        { name: 'Ordenes', icon: faCartShopping, href: '/orders', active: true },
        { name: 'Suscripciones', icon: faUsers, href: '/subscriptions', active: false },
        { name: 'Perfil', icon: faUser, href: '/profile', active: false },
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
                className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#1B3D6D] transition-all duration-300
                    ${isSidebarOpen
                        ? 'w-[245px] translate-x-0 shadow-[0px_0px_25px_rgba(0,0,0,0.3)]'
                        : 'w-[245px] -translate-x-full md:w-[72px] md:translate-x-0 md:shadow-none'
                    }`}
            >
                <div className={`flex flex-col h-full py-6 transition-all duration-300 ${isSidebarOpen ? 'px-5' : 'px-3'}`}>
                    {/* Logo */}
                    <div className={`mb-8 flex justify-center transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 scale-50 pointer-events-none h-0'}`}>
                        <Link href="/">
                            <img src="/images/logo-principal.png" alt="Logo" className="h-[58px] w-[110px] object-contain brightness-0 invert" />
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
                                <span className="flex items-center justify-center size-5 shrink-0">
                                    <FontAwesomeIcon icon={item.icon} className={isSidebarOpen ? 'size-4' : 'size-5'} />
                                </span>
                                <span className={`text-[14px] font-medium font-['Inter'] whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'w-0 opacity-0 pointer-events-none translate-x-4' : 'w-auto opacity-100'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Divider */}
                    <div className="my-6 h-[0.5px] bg-[#F2F2F2] opacity-50" />

                    {/* Logout */}
                    <button
                        onClick={() => router.post(logout())}
                        className={`flex items-center rounded-[4px] text-white hover:bg-[rgba(255,255,255,0.1)] transition-all w-full text-left ${isSidebarOpen ? 'gap-4 px-4 py-3' : 'justify-center px-0 py-4'}`}
                    >
                        <span className="flex items-center justify-center size-6 shrink-0">
                            <FontAwesomeIcon icon={faPowerOff} className={isSidebarOpen ? 'size-5' : 'size-6'} />
                        </span>
                        <span className={`text-[16px] font-normal font-['Inter'] whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'w-0 opacity-0 pointer-events-none translate-x-4' : 'w-auto opacity-100'}`}>
                            Cerrar sesión
                        </span>
                    </button>

                    {/* Footer Copyright */}
                    <div className={`mt-auto pt-6 text-[8.5px] text-white font-['Inter'] text-center space-y-1 transition-all duration-300 ${!isSidebarOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100'}`}>
                        <p>© Historias por correo</p>
                        <div className="h-2 w-px bg-white mx-auto opacity-50" />
                        <p>Todos los derechos reservados</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-[245px]' : 'ml-0 md:ml-[72px]'}`}>
                {/* Topbar sticky header */}
                <div className="px-5 pt-1.5 h-[62px]">
                  <header className="h-[52px] bg-white shadow-[0px_0px_15px_rgba(36,16,167,0.1)] rounded-[4px] flex items-center justify-between px-5">
                      <button
                          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                          className="text-[#1B3D6D] hover:opacity-80 transition p-1.5"
                      >
                          <FontAwesomeIcon icon={faBars} className="size-4" />
                      </button>

                      {/* Logo Mobile */}
                      <div className="flex md:hidden items-center gap-1.5 translate-x-1">
                          <span className="text-[11px] font-bold text-[#1B3D6D] tracking-[0.1em] uppercase whitespace-nowrap">Historias por correo</span>
                          <img src="/images/logo-principal.png" alt="Logo" className="h-4 w-auto object-contain opacity-40" />
                      </div>

                      <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                              <p className="text-[12px] font-semibold text-[#1B3D6D] font-['Inter'] leading-tight">{auth.user.name}</p>
                              <p className="text-[10px] font-normal text-[#7B7B7B] font-['Inter']">Usuario</p>
                          </div>
                          <div className="relative">
                              <img 
                                  src={auth.user.avatar || "/images/avatar-placeholder.jpg"} 
                                  alt="Profile" 
                                  className="size-[32px] rounded-full object-cover border-2 border-white shadow-sm" 
                              />
                              <div className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-[#22AD5C] border-2 border-white" />
                          </div>
                      </div>
                  </header>
                </div>

                <main className="flex-1 p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
