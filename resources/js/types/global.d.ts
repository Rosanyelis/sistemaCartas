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
            /** Métodos de pago resumidos; solo se rellena en rutas de la tienda (carrito) si hay sesión */
            paymentMethods?: Array<{
                id: number;
                titular: string | null;
                detalles: string | null;
                is_default: boolean;
                tipo_nombre: string | null;
            }>;
            [key: string]: unknown;
        };
    }
}
