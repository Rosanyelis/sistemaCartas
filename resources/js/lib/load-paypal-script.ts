let paypalSdkLoad: Promise<void> | null = null;

let lastClientId = '';
let lastCurrency = '';

/**
 * Carga el JS SDK de PayPal (una carga por sesión; suficiente para la demo).
 */
export function loadPayPalScript(
    clientId: string,
    currency: string,
): Promise<void> {
    if (typeof window === 'undefined') {
        return Promise.resolve();
    }

    if (window.paypal) {
        return Promise.resolve();
    }

    if (
        paypalSdkLoad &&
        lastClientId === clientId &&
        lastCurrency === currency
    ) {
        return paypalSdkLoad;
    }

    lastClientId = clientId;
    lastCurrency = currency;

    paypalSdkLoad = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}`;
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
