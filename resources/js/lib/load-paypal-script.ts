let paypalSdkLoad: Promise<void> | null = null;

let lastClientId = '';
let lastCurrency = '';
let lastIntent: 'capture' | 'subscription' = 'capture';

function removePayPalScript(): void {
    document
        .querySelectorAll('script[data-sistema-cartas-paypal]')
        .forEach((el) => {
            el.remove();
        });
    if (typeof window !== 'undefined' && window.paypal) {
        delete window.paypal;
    }
    paypalSdkLoad = null;
}

/**
 * Carga el JS SDK de PayPal. `intent=subscription` para botones de suscripción;
 * `intent=capture` (por defecto) para PayPal Checkout de productos.
 */
export function loadPayPalScript(
    clientId: string,
    currency: string,
    intent: 'capture' | 'subscription' = 'capture',
): Promise<void> {
    if (typeof window === 'undefined') {
        return Promise.resolve();
    }

    if (
        window.paypal &&
        lastClientId === clientId &&
        lastCurrency === currency &&
        lastIntent === intent
    ) {
        return Promise.resolve();
    }

    if (
        lastClientId !== '' &&
        (lastClientId !== clientId ||
            lastCurrency !== currency ||
            lastIntent !== intent)
    ) {
        removePayPalScript();
    }

    lastClientId = clientId;
    lastCurrency = currency;
    lastIntent = intent;

    paypalSdkLoad = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.setAttribute('data-sistema-cartas-paypal', '1');
        const vault = intent === 'subscription' ? 'true' : 'false';
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}&intent=${encodeURIComponent(intent)}&vault=${vault}`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
            paypalSdkLoad = null;
            reject(new Error('No se pudo cargar el script de PayPal'));
        };
        document.body.appendChild(script);
    });

    return paypalSdkLoad;
}
