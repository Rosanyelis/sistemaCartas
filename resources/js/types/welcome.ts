export interface Story {
    id?: number;
    title: string;
    desc: string;
    price: string;
    img: string;
}

export interface Product {
    id?: number;
    /** Slug en catálogo de referencia; enlaza a la ficha de detalle */
    slug: string;
    name: string;
    price: string;
    desc: string;
    img: string;
    /** Precio unitario (servidor); el cobro PayPal se recalcula en backend */
    unit_price: number;
}

export interface Testimonial {
    id?: number;
    text: string;
    author: string;
    city: string;
    img: string;
}
