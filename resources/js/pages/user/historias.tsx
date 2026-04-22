import { Head } from '@inertiajs/react';
import { useState } from 'react';
import CatalogoHeroSection from '@/components/tienda/CatalogoHeroSection';
import CtaSection from '@/components/tienda/CtaSection';
import FeaturedStoriesSection from '@/components/tienda/FeaturedStoriesSection';
import FilterBarSection from '@/components/tienda/FilterBarSection';
import GridStoriesSection from '@/components/tienda/GridStoriesSection';
import ClienteLayout from '@/layouts/cliente-layout';

export default function Historias() {
    const [activeCategory, setActiveCategory] = useState('Todas');

    const categories = [
        'Todas',
        'Aventura',
        'Misterio',
        'Romance Histórico',
        'Bélico',
    ];

    const gridStories = [
        {
            title: 'El Enigma del Galeón',
            desc: 'Una aventura de piratería y tesoros olvidados en las cristalinas aguas...',
            price: 'Desde $24,90',
            img: '/images/cards/cards-1.png',
        },
        {
            title: 'Cartas desde Versalles',
            desc: 'Intrigas palaciegas y secretos de estado en la fastuosa corte del Rey...',
            price: 'Desde $24,90',
            img: '/images/cards/cards-2.png',
        },
        {
            title: 'El Secreto de la Alhambra',
            desc: 'Un romance prohibido entre los muros geométricos del último...',
            price: 'Desde $24,90',
            img: '/images/cards/cards-3.png',
        },
        {
            title: 'Cartas desde Versalles',
            desc: 'Intrigas palaciegas y secretos de estado en la fastuosa corte del Rey...',
            price: 'Desde $24,90',
            img: '/images/cards/cards-4.png',
        },
        {
            title: 'El Enigma del Galeón',
            desc: 'Una aventura de piratería y tesoros olvidados en las cristalinas aguas...',
            price: 'Desde $24,90',
            img: '/images/cards/cards-5.png',
        },
        {
            title: 'El Enigma del Galeón',
            desc: 'Una aventura de piratería y tesoros olvidados en las cristalinas aguas...',
            price: 'Desde $24,90',
            img: '/images/cards/cards-6.png',
        },
    ];

    const destacadasStories = [
        {
            title: 'Secretos que Solo el Viento Conoce',
            desc: 'Cada una de estas historias es un fragmento de una vida en el mar. Son diarios de a bordo ocultos en sobres lacrados, mensajes que han...',
            price: 'Desde $24,90',
            img: '/images/sliders/slider-1.png',
        },
        {
            title: 'Secretos que Solo el Viento Conoce',
            desc: 'Cada una de estas historias es un fragmento de una vida en el mar. Son diarios de a bordo ocultos en sobres lacrados, mensajes que han...',
            price: 'Desde $24,90',
            img: '/images/sliders/slider-2.jpg',
        },
    ];

    return (
        <ClienteLayout>
            <Head>
                {[
                    <title key="title">Historias | Historias por Correo</title>,
                    <link
                        key="preconnect"
                        rel="preconnect"
                        href="https://fonts.bunny.net"
                    />,
                    <link
                        key="fonts"
                        href="https://fonts.bunny.net/css?family=playfair-display:400,600,700,700i|inter:400,500,600,700|cormorant-garamond:400,700,700i|roboto:400,500"
                        rel="stylesheet"
                    />,
                    <link
                        key="fa"
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                    />,
                ]}
            </Head>

            {/* 2. Hero Section */}
            <CatalogoHeroSection />

            {/* 3. Filter Bar */}
            <FilterBarSection
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

            {/* 4. Historias Grid List */}
            <GridStoriesSection stories={gridStories} />

            {/* 5. Historias Destacadas */}
            <FeaturedStoriesSection stories={destacadasStories} />

            {/* 6. Cierre CTA */}
            <CtaSection
                title="¿Buscas un regalo especial?"
                description="Nuestras historias son el regalo perfecto para los amantes de la lectura y las historias. Sorprende a esa persona especial y regálale una historia"
                buttonText="Encontrar una historia para regalar"
                buttonLink="#"
            />
        </ClienteLayout>
    );
}
