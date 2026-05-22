import { Store, User, UserPlus } from 'lucide-react';
import {
    AdminClientesIcon,
    AdminHistoriasIcon,
    AdminOrdenesIcon,
    AdminPanelIcon,
    AdminProductosIcon,
    AdminSuscripcionesIcon,
} from '@/components/panel/panel-admin-nav-icons';
import { ShoppingCartPlusIcon } from '@/components/panel/panel-client-nav-icons';
import type { IconComponent } from '@/components/ui/icon';
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
    icon: IconComponent;
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
            icon: AdminPanelIcon,
            href: adminDashboard.url(),
            active: currentUrl === d,
        },
        {
            name: 'Ordenes',
            icon: AdminOrdenesIcon,
            href: ordenes.url(),
            active:
                currentUrl.startsWith(o) ||
                currentUrl.startsWith(adminOrdersLegacy.definition.url),
        },
        {
            name: 'Suscripciones',
            icon: AdminSuscripcionesIcon,
            href: adminSuscripciones.url(),
            active:
                currentUrl.startsWith(s) ||
                currentUrl.startsWith(adminSubscriptionsLegacy.definition.url),
        },
        {
            name: 'Clientes',
            icon: AdminClientesIcon,
            href: clientes.url(),
            active:
                currentUrl.startsWith(c) ||
                currentUrl.startsWith(adminClientsLegacy.definition.url),
        },
        {
            name: 'Historias',
            icon: AdminHistoriasIcon,
            href: adminHistorias.url(),
            active:
                currentUrl.startsWith(h) ||
                currentUrl.startsWith(adminStoriesLegacy.definition.url),
        },
        {
            name: 'Productos',
            icon: AdminProductosIcon,
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
            icon: Store,
            href: '/',
            active: currentUrl === '/' || currentUrl === '',
        },
        {
            name: 'Ordenes',
            icon: ShoppingCartPlusIcon,
            href: orders.url(),
            active: currentUrl.startsWith(ou),
        },
        {
            name: 'Suscripciones',
            icon: UserPlus,
            href: subscriptions.url(),
            active: currentUrl.startsWith(su),
        },
        {
            name: 'Perfil',
            icon: User,
            href: profile.url(),
            active: currentUrl.startsWith(pr),
        },
    ];
}
