/**
 * Línea del carrito (productos; suscripciones se ampliará en fases futuras con kind).
 */
export type CartLine = {
    slug: string;
    name: string;
    subtitle: string;
    price: number;
    image: string;
    quantity: number;
    badge: string;
};
