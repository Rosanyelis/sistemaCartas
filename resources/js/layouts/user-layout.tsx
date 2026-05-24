import { getPanelNav } from '@/config/panel-nav';
import type { User } from '@/types/auth';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import PanelShell from '@/layouts/panel-shell';

interface UserLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function UserLayout({ children, title }: UserLayoutProps) {
    const { url, props } = usePage<{ auth: { user: User } }>();
    const { auth } = props;
    const isAdmin = auth.user.role === 'admin';
    const menuItems = getPanelNav(isAdmin ? 'admin' : 'cliente', url);

    return (
        <PanelShell title={title} navItems={menuItems} isAdmin={isAdmin} user={auth.user}>
            {children}
        </PanelShell>
    );
}
