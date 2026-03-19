import type { Story, Product, Testimonial } from '@/types/welcome';

export const defaultStories: Story[] = [
    {
        title: 'Secretos que Solo el Viento Conoce',
        desc: 'Cada una de estas historias es un fragmento de una vida en el mar. Son diarios de a bordo ocultos en sobres lacrados, mensajes que han cruzado tormentas y calmas...',
        price: 'Desde $24,90',
        img: '/images/sliders/slider-1.png',
    },
    {
        title: 'Memorias de un Viajero Perdido',
        desc: 'Descubre el mundo a través de los ojos de un explorador que documentó cada rincón del planeta en cartas escritas a mano bajo la luz de las estrellas.',
        price: 'Desde $24,90',
        img: '/images/sliders/slider-2.jpg',
    },
    {
        title: 'Amor en Tiempos de Guerra',
        desc: 'La correspondencia secreta entre dos amantes separados por el frente de batalla, donde cada carta era una promesa de supervivencia y esperanza.',
        price: 'Desde $24,90',
        img: '/images/sliders/slider-3.png',
    },
];

export const defaultProducts: Product[] = [
    {
        name: 'Sello de Lacre Artesanal',
        price: '$24,90',
        desc: 'Un sello de latón grabado a mano con mango de madera de nogal, ideal para sellar tus cartas con elegancia clásica.',
        img: '/images/wax_seal.png',
    },
    {
        name: 'Pluma Estilográfica Vintage',
        price: '$45,90',
        desc: 'Inspirada en los diseños de los años 40, con plumín de acero inoxidable para una escritura fluida y pausada.',
        img: '/images/fountain_pen.png',
    },
    {
        name: 'Papel de Hilo Prensado',
        price: '$18,50',
        desc: '25 pliegos de papel de alta calidad con textura artesanal, perfecto para conservar tus pensamientos más valiosos.',
        img: '/images/pressed_paper.png',
    },
];

export const defaultTestimonials: Testimonial[] = [
    {
        text: 'Recibir una carta física después de tanto tiempo es una experiencia mágica. Las historias me transportan a otra época.',
        author: 'Elena R.',
        city: 'Madrid',
        img: '/images/person_holding_letter.png',
    },
    {
        text: 'La calidad del papel y la narrativa son excepcionales. Se ha convertido en mi momento favorito del mes.',
        author: 'Sabo Masties',
        city: 'Madrid',
        img: '/images/person_holding_letter.png',
    },
    {
        text: 'Un regalo perfecto para los amantes de la lectura y la historia. La atención al detalle es increíble.',
        author: 'Sofía G.',
        city: 'Valencia',
        img: '/images/person_holding_letter.png',
    },
];
