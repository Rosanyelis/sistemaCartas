import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faBook,
    faBoxOpen,
    faCartShopping,
    faHouse,
    faStore,
    faUser,
    faUserGroup,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';

export type PanelNavItem = {
    name: string;
    icon: IconDefinition;
    href: string;
    active: boolean;
};

/**
 * Navegación lateral del panel administrativo (mismas URLs que las rutas nombradas en español).
 */
export function getAdminPanelNav(currentUrl: string): PanelNavItem[] {
    return [
        {
            name: 'Panel',
            icon: faHouse,
            href: '/admin/dashboard',
            active: currentUrl === '/admin/dashboard',
        },
        {
            name: 'Ordenes',
            icon: faCartShopping,
            href: '/admin/ordenes',
            active:
                currentUrl.startsWith('/admin/ordenes') ||
                currentUrl.startsWith('/admin/orders'),
        },
        {
            name: 'Suscripciones',
            icon: faUsers,
            href: '/admin/suscripciones',
            active:
                currentUrl.startsWith('/admin/suscripciones') ||
                currentUrl.startsWith('/admin/subscriptions'),
        },
        {
            name: 'Clientes',
            icon: faUserGroup,
            href: '/admin/clientes',
            active:
                currentUrl.startsWith('/admin/clientes') ||
                currentUrl.startsWith('/admin/clients'),
        },
        {
            name: 'Historias',
            icon: faBook,
            href: '/admin/historias',
            active:
                currentUrl.startsWith('/admin/historias') ||
                currentUrl.startsWith('/admin/stories'),
        },
        {
            name: 'Productos',
            icon: faBoxOpen,
            href: '/admin/productos',
            active:
                currentUrl.startsWith('/admin/productos') ||
                currentUrl.startsWith('/admin/products'),
        },
    ];
}

/**
 * Navegación lateral del área de cliente autenticado.
 */
export function getClientePanelNav(currentUrl: string): PanelNavItem[] {
    return [
        {
            name: 'Ir a tienda',
            icon: faStore,
            href: '/',
            active: currentUrl === '/' || currentUrl === '',
        },
        {
            name: 'Ordenes',
            icon: faCartShopping,
            href: '/user/orders',
            active: currentUrl.startsWith('/user/orders'),
        },
        {
            name: 'Suscripciones',
            icon: faUsers,
            href: '/user/subscriptions',
            active: currentUrl.startsWith('/user/subscriptions'),
        },
        {
            name: 'Perfil',
            icon: faUser,
            href: '/user/profile',
            active: currentUrl.startsWith('/user/profile'),
        },
    ];
}
