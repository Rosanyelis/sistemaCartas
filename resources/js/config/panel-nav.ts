import {
    PanelNavAudiosIcon,
    PanelNavClientesIcon,
    PanelNavHistoriasIcon,
    PanelNavOrdenesIcon,
    PanelNavPanelIcon,
    PanelNavPerfilIcon,
    PanelNavProductosIcon,
    PanelNavStoreIcon,
    PanelNavSuscripcionesIcon,
} from '@/components/panel/panel-nav-icons';
import type { IconComponent } from '@/components/ui/icon';
import {
    audios as adminAudios,
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

export type PanelRole = 'admin' | 'cliente';

export type PanelNavItem = {
    name: string;
    icon: IconComponent;
    href: string;
    active: boolean;
};

export function getPanelNav(role: PanelRole, currentUrl: string): PanelNavItem[] {
    return role === 'admin' ? getAdminPanelNav(currentUrl) : getClientePanelNav(currentUrl);
}

/**
 * Navegación lateral del panel administrativo (URLs desde Wayfinder).
 */
export function getAdminPanelNav(currentUrl: string): PanelNavItem[] {
    const d = adminDashboard.definition.url;
    const o = ordenes.definition.url;
    const s = adminSuscripciones.definition.url;
    const c = clientes.definition.url;
    const h = adminHistorias.definition.url;
    const a = adminAudios.definition.url;
    const p = adminProductos.definition.url;

    return [
        {
            name: 'Panel',
            icon: PanelNavPanelIcon,
            href: adminDashboard.url(),
            active: currentUrl === d,
        },
        {
            name: 'Ordenes',
            icon: PanelNavOrdenesIcon,
            href: ordenes.url(),
            active:
                currentUrl.startsWith(o) ||
                currentUrl.startsWith(adminOrdersLegacy.definition.url),
        },
        {
            name: 'Suscripciones',
            icon: PanelNavSuscripcionesIcon,
            href: adminSuscripciones.url(),
            active:
                currentUrl.startsWith(s) ||
                currentUrl.startsWith(adminSubscriptionsLegacy.definition.url),
        },
        {
            name: 'Clientes',
            icon: PanelNavClientesIcon,
            href: clientes.url(),
            active:
                currentUrl.startsWith(c) ||
                currentUrl.startsWith(adminClientsLegacy.definition.url),
        },
        {
            name: 'Historias',
            icon: PanelNavHistoriasIcon,
            href: adminHistorias.url(),
            active:
                currentUrl.startsWith(h) ||
                currentUrl.startsWith(adminStoriesLegacy.definition.url),
        },
        {
            name: 'Audios',
            icon: PanelNavAudiosIcon,
            href: adminAudios.url(),
            active: currentUrl.startsWith(a),
        },
        {
            name: 'Productos',
            icon: PanelNavProductosIcon,
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
            icon: PanelNavStoreIcon,
            href: '/',
            active: currentUrl === '/' || currentUrl === '',
        },
        {
            name: 'Ordenes',
            icon: PanelNavOrdenesIcon,
            href: orders.url(),
            active: currentUrl.startsWith(ou),
        },
        {
            name: 'Suscripciones',
            icon: PanelNavSuscripcionesIcon,
            href: subscriptions.url(),
            active: currentUrl.startsWith(su),
        },
        {
            name: 'Perfil',
            icon: PanelNavPerfilIcon,
            href: profile.url(),
            active: currentUrl.startsWith(pr),
        },
    ];
}
