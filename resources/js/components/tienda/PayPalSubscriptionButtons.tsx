import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { loadPayPalScript } from '@/lib/load-paypal-script';
import { postJson } from '@/lib/json-fetch';
import type { SharedPayPalProps } from '@/components/tienda/PayPalCheckoutButtons';

/**
 * Ruta nombrada `checkout.paypal.subscription.draft` en `routes/web.php`.
 * No importar `@/routes/checkout/paypal/subscription`: esos archivos están en
 * `.gitignore` y solo existen tras `php artisan wayfinder:generate`; en servidores
 * donde `npm run build` corre sin PHP disponible el build fallaba (ENOENT).
 */
const PAYPAL_SUBSCRIPTION_DRAFT_URL = '/checkout/paypal/subscription/draft';

/** Confirma fechas y estado en servidor tras onApprove (refuerzo si el webhook tarda). */
const PAYPAL_SUBSCRIPTION_SYNC_URL = '/checkout/paypal/subscription/sync';

type PayPalSubscriptionButtonsProps = {
    historiaSlug: string;
    /** Opcional: vincular la suscripción a una orden de productos de la misma sesión */
    storeOrderId?: number | null;
    onSuccess: () => void;
};

export default function PayPalSubscriptionButtons({
    historiaSlug,
    storeOrderId,
    onSuccess,
}: PayPalSubscriptionButtonsProps) {
    const { paypal: paypalFromProps } = usePage().props;
    const paypal =
        paypalFromProps ??
        ({ clientId: '', currency: 'USD', enabled: false } satisfies SharedPayPalProps['paypal']);
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    const depsKey = `${historiaSlug}|${storeOrderId ?? ''}`;

    useEffect(() => {
        setError(null);

        if (!paypal.enabled || !paypal.clientId) {
            setError(
                'Configura PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET en .env para activar el sandbox.',
            );

            return;
        }

        const el = containerRef.current;
        let cancelled = false;

        const run = async () => {
            try {
                await loadPayPalScript(
                    paypal.clientId,
                    paypal.currency,
                    'subscription',
                );
            } catch {
                if (!cancelled) {
                    setError('No se pudo cargar PayPal. Revisa tu conexión.');
                }

                return;
            }

            if (cancelled || !el || !window.paypal) {
                return;
            }

            el.innerHTML = '';

            const buttons = window.paypal.Buttons({
                style: { label: 'subscribe' },
                createSubscription: async () => {
                    const body: {
                        historia_slug: string;
                        store_order_id?: number;
                    } = { historia_slug: historiaSlug };
                    if (storeOrderId != null) {
                        body.store_order_id = storeOrderId;
                    }

                    const { ok, data } = await postJson<{
                        subscriptionID?: string;
                        message?: string;
                    }>(PAYPAL_SUBSCRIPTION_DRAFT_URL, body);

                    if (!ok || !data.subscriptionID) {
                        throw new Error(
                            data.message ?? 'No se pudo crear la suscripción',
                        );
                    }

                    return data.subscriptionID;
                },
                onApprove: async (data) => {
                    const subscriptionID =
                        data &&
                        typeof data === 'object' &&
                        'subscriptionID' in data &&
                        typeof (data as { subscriptionID?: unknown }).subscriptionID ===
                            'string'
                            ? (data as { subscriptionID: string }).subscriptionID
                            : undefined;

                    if (!subscriptionID) {
                        setError(
                            'PayPal no devolvió el identificador de la suscripción.',
                        );

                        return;
                    }

                    const { ok, data: body } = await postJson<{
                        message?: string;
                    }>(PAYPAL_SUBSCRIPTION_SYNC_URL, {
                        subscription_id: subscriptionID,
                    });

                    if (!ok) {
                        setError(
                            typeof body?.message === 'string'
                                ? body.message
                                : 'No se pudo confirmar la suscripción en el servidor. Si el pago se completó, espera un momento o revisa Mis suscripciones.',
                        );

                        return;
                    }

                    onSuccess();
                },
                onError: (err) => {
                    console.error(err);
                    setError('PayPal reportó un error al suscribirte.');
                },
            });

            await buttons.render(el);
        };

        void run();

        return () => {
            cancelled = true;
            if (el) {
                el.innerHTML = '';
            }
        };
    }, [
        depsKey,
        historiaSlug,
        onSuccess,
        paypal.clientId,
        paypal.currency,
        paypal.enabled,
        storeOrderId,
    ]);

    if (!paypal.enabled || !paypal.clientId) {
        return (
            <p className="rounded-[2px] border border-amber-200 bg-amber-50 p-3 font-['Inter',sans-serif] text-[13px] text-amber-900">
                {error ??
                    'Añade credenciales sandbox de PayPal en el archivo .env para activar suscripciones.'}
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {error && (
                <p className="rounded-[2px] border border-red-200 bg-red-50 p-2 font-['Inter',sans-serif] text-[12px] text-red-800">
                    {error}
                </p>
            )}
            <div ref={containerRef} className="min-h-[48px] w-full" />
        </div>
    );
}
