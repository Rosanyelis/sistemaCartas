import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    capture as paypalCaptureRoute,
    order as paypalCreateOrderRoute,
} from '@/routes/checkout/paypal';
import { loadPayPalScript } from '@/lib/load-paypal-script';
import { postJson } from '@/lib/json-fetch';

export type SharedPayPalProps = {
    paypal: {
        clientId: string;
        currency: string;
        enabled: boolean;
    };
};

export type PayPalLine = {
    slug: string;
    quantity: number;
};

declare global {
    interface Window {
        paypal?: {
            Buttons: (config: {
                createOrder: () => Promise<string>;
                onApprove: (data: { orderID: string }) => Promise<void>;
                onError?: (err: unknown) => void;
            }) => {
                render: (container: HTMLElement) => Promise<void>;
            };
        };
    }
}

type PayPalCheckoutButtonsProps = {
    lines: PayPalLine[];
    onSuccess: () => void;
};

export default function PayPalCheckoutButtons({
    lines,
    onSuccess,
}: PayPalCheckoutButtonsProps) {
    const page = usePage();
    const paypal = (page.props as SharedPayPalProps).paypal;
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    const linesKey = lines.map((l) => `${l.slug}:${l.quantity}`).join('|');

    useEffect(() => {
        setError(null);

        if (!paypal.enabled || !paypal.clientId) {
            setError(
                'Configura PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET en .env para activar el sandbox.',
            );

            return;
        }

        if (lines.length === 0) {
            return;
        }

        const el = containerRef.current;
        let cancelled = false;

        const run = async () => {
            try {
                await loadPayPalScript(paypal.clientId, paypal.currency);
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
                createOrder: async () => {
                    const { ok, data } = await postJson<{
                        orderId?: string;
                        message?: string;
                    }>(paypalCreateOrderRoute.url(), { items: lines });

                    if (!ok || !data.orderId) {
                        throw new Error(
                            data.message ?? 'No se pudo crear la orden',
                        );
                    }

                    return data.orderId;
                },
                onApprove: async (data) => {
                    const { ok, data: cap } = await postJson<{
                        message?: string;
                        paypal_error?: string;
                        detail?: string;
                    }>(paypalCaptureRoute.url(), {
                        order_id: data.orderID,
                    });

                    if (!ok) {
                        const msg =
                            cap.message ??
                            'No se pudo completar el cobro con PayPal.';
                        setError(
                            cap.detail
                                ? `${msg} (${cap.detail})`
                                : msg,
                        );
                        throw new Error(msg);
                    }

                    onSuccess();
                },
                onError: (err) => {
                    console.error(err);
                    setError('PayPal reportó un error. Revisa la consola.');
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
    }, [linesKey, lines, onSuccess, paypal.clientId, paypal.currency, paypal.enabled]);

    if (!paypal.enabled || !paypal.clientId) {
        return (
            <p className="rounded-[2px] border border-amber-200 bg-amber-50 p-3 font-['Inter',sans-serif] text-[13px] text-amber-900">
                {error ??
                    'Añade credenciales sandbox de PayPal en el archivo .env para probar el cobro.'}
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
