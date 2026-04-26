import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            /** Presente en páginas que comparten config de checkout PayPal */
            paypal?: {
                clientId: string;
                currency: string;
                enabled: boolean;
            };
            flash?: {
                success?: string | null;
                error?: string | null;
                warning?: string | null;
            };
            [key: string]: unknown;
        };
    }
}
