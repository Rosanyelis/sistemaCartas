export interface Story {
    id?: number;
    title: string;
    desc: string;
    price: string;
    img: string;
}

export interface Product {
    id?: number;
    slug: string;
    name: string;
    price: string;
    desc: string;
    img: string;
}

export interface Testimonial {
    id?: number;
    text: string;
    author: string;
    city: string;
    img: string;
}
