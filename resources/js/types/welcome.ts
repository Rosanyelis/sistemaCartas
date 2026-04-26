export interface Story {
    id: number;
    /** Slug de BD para enlazar a `historias.show` */
    slug: string;
    title: string;
    desc: string;
    price: string;
    img: string;
    categoria: string;
}

/** Tarjeta de catálogo público (`/productos`) y datos coherentes con el serializador de tienda. */
export interface Product {
    id?: number;
    /** Slug en BD; enlaza a `productos.show`. */
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
