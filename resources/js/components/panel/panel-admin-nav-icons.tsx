import { Monitor, PackageOpen, ScrollText, UserPlus, Users } from 'lucide-react';
import { ShoppingCartPlusIcon } from '@/components/panel/panel-client-nav-icons';
import type { IconComponent } from '@/components/ui/icon';

const ADMIN_NAV_STROKE = 1.75;

type AdminNavIconProps = {
    className?: string;
    strokeWidth?: number;
};

function withAdminStroke(Icon: IconComponent): IconComponent {
    return function AdminNavIcon({ className, strokeWidth = ADMIN_NAV_STROKE }: AdminNavIconProps) {
        return <Icon className={className} strokeWidth={strokeWidth} />;
    };
}

/** Monitor/pantalla sobre base — Panel (Figma menú admin). */
export const AdminPanelIcon = withAdminStroke(Monitor);

/** Carrito outline con + en el cesto — Órdenes (mismo patrón que menú cliente). */
export const AdminOrdenesIcon: IconComponent = ShoppingCartPlusIcon;

/** Usuario con + a la derecha — Suscripciones. */
export const AdminSuscripcionesIcon = withAdminStroke(UserPlus);

/** Grupo de siluetas — Clientes. */
export const AdminClientesIcon = withAdminStroke(Users);

/** Pergamino/scroll enrollado — Historias. */
export const AdminHistoriasIcon = withAdminStroke(ScrollText);

/** Caja abierta vista superior — Productos. */
export const AdminProductosIcon = withAdminStroke(PackageOpen);
