/**
 * Producto físico / catálogo (pago único vía PayPal Orders).
 */
export type CartLineProduct = {
    kind: 'product';
    slug: string;
    name: string;
    subtitle: string;
    price: number;
    image: string;
    quantity: number;
    badge: string;
};

/**
 * Suscripción a historia (cobro recurrente vía PayPal Subscriptions; no forma parte del PayPal Order de productos).
 */
export type CartLineHistoriaSuscripcion = {
    kind: 'historia_suscripcion';
    slug: string;
    name: string;
    subtitle: string;
    price: number;
    image: string;
    quantity: 1;
    badge: string;
    duracion_meses: number;
};

export type CartLine = CartLineProduct | CartLineHistoriaSuscripcion;

export function cartLineKey(line: CartLine): string {
    return `${line.kind}:${line.slug}`;
}
