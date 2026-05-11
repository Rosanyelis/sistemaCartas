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
import {
    clientes,
    clients as adminClientsLegacy,
    dashboard as adminDashboard,
    historias as adminHistorias,
    ordenes,
    orders as adminOrdersLegacy,
    productos as adminProductos,
    products as adminProductsLegacy,
    stories as adminStoriesLegacy,
    subscriptions as adminSubscriptionsLegacy,
    suscripciones as adminSuscripciones,
} from '@/routes/admin';
import { orders, profile, subscriptions } from '@/routes/user';

export type PanelNavItem = {
    name: string;
    icon: IconDefinition;
    href: string;
    active: boolean;
};

/**
 * Navegación lateral del panel administrativo (URLs desde Wayfinder).
 */
export function getAdminPanelNav(currentUrl: string): PanelNavItem[] {
    const d = adminDashboard.definition.url;
    const o = ordenes.definition.url;
    const s = adminSuscripciones.definition.url;
    const c = clientes.definition.url;
    const h = adminHistorias.definition.url;
    const p = adminProductos.definition.url;

    return [
        {
            name: 'Panel',
            icon: faHouse,
            href: adminDashboard.url(),
            active: currentUrl === d,
        },
        {
            name: 'Ordenes',
            icon: faCartShopping,
            href: ordenes.url(),
            active:
                currentUrl.startsWith(o) ||
                currentUrl.startsWith(adminOrdersLegacy.definition.url),
        },
        {
            name: 'Suscripciones',
            icon: faUsers,
            href: adminSuscripciones.url(),
            active:
                currentUrl.startsWith(s) ||
                currentUrl.startsWith(adminSubscriptionsLegacy.definition.url),
        },
        {
            name: 'Clientes',
            icon: faUserGroup,
            href: clientes.url(),
            active:
                currentUrl.startsWith(c) ||
                currentUrl.startsWith(adminClientsLegacy.definition.url),
        },
        {
            name: 'Historias',
            icon: faBook,
            href: adminHistorias.url(),
            active:
                currentUrl.startsWith(h) ||
                currentUrl.startsWith(adminStoriesLegacy.definition.url),
        },
        {
            name: 'Productos',
            icon: faBoxOpen,
            href: adminProductos.url(),
            active:
                currentUrl.startsWith(p) ||
                currentUrl.startsWith(adminProductsLegacy.definition.url),
        },
    ];
}

/**
 * Navegación lateral del área de cliente autenticado.
 */
export function getClientePanelNav(currentUrl: string): PanelNavItem[] {
    const ou = orders.definition.url;
    const su = subscriptions.definition.url;
    const pr = profile.definition.url;

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
            href: orders.url(),
            active: currentUrl.startsWith(ou),
        },
        {
            name: 'Suscripciones',
            icon: faUsers,
            href: subscriptions.url(),
            active: currentUrl.startsWith(su),
        },
        {
            name: 'Perfil',
            icon: faUser,
            href: profile.url(),
            active: currentUrl.startsWith(pr),
        },
    ];
}
