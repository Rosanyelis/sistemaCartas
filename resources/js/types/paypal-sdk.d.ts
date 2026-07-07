/**
 * Tipos mínimos del JS SDK de PayPal (Orders + Subscriptions).
 */
type PayPalOrderButtonsConfig = {
    createOrder: () => Promise<string>;
    onApprove: (data: { orderID: string }) => Promise<void>;
    onError?: (err: unknown) => void;
};

type PayPalSubscriptionButtonsConfig = {
    style?: { label?: string };
    createSubscription: (
        data: unknown,
        actions: {
            subscription: {
                create: (opts: { plan_id: string }) => Promise<string>;
            };
        },
    ) => Promise<string>;
    onApprove: (data: { subscriptionID: string }) => Promise<void>;
    onError?: (err: unknown) => void;
};

declare global {
    interface Window {
        paypal?: {
            Buttons: (
                config:
                    | PayPalOrderButtonsConfig
                    | PayPalSubscriptionButtonsConfig,
            ) => {
                render: (container: HTMLElement) => Promise<void>;
            };
        };
    }
}

export {};
