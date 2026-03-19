import { Head } from '@inertiajs/react';
import { useState } from 'react';
import CtaSection from '@/components/CtaSection';
import FilterBarSection from '@/components/FilterBarSection';
import GridProductsSection from '@/components/GridProductsSection';
import ProductosHeroSection from '@/components/ProductosHeroSection';
import ClienteLayout from '@/layouts/cliente-layout';

export default function Productos() {
    const [activeCategory, setActiveCategory] = useState('Todas');

    const categories = [
        'Todas',
        'Escritura',
        'Papelería',
        'Accesorios',
        'Sellos de Lacre',
    ];

    const products = [
        {
            name: 'Sello de Lacre Artesanal',
            desc: 'Un sello de latón grabado a mano con mango de madera de nogal, ideal para sellar tus cartas con elegancia clásica.',
            price: '$24,90',
            img: '/images/products/product-1.png',
        },
        {
            name: 'Pluma Estilográfica Vintage',
            desc: 'Inspirada en los diseños de los años 40, con plumín de acero inoxidable para una escritura fluida y pausada.',
            price: '$24,90',
            img: '/images/products/product-2.png',
        },
        {
            name: 'Papel de Hilo Prensado',
            desc: '25 pliegos de papel de alta calidad con textura artesanal, perfecto para conservar tus pensamientos más valiosos.',
            price: '$24,90',
            img: '/images/products/product-3.png',
        },
        {
            name: 'Kit de Lacre Real',
            desc: 'Set completo con sello de latón personalizado, cuchara de fundición y tres barras de cera borgoña.',
            price: '$24,90',
            img: '/images/products/product-4.png',
        },
        {
            name: 'Sobres Artesanales',
            desc: 'Paquete de 10 sobres con bordes rasgados a mano y forro interior de seda color azul marino.',
            price: '$24,90',
            img: '/images/products/product-5.png',
        },
        {
            name: 'Abrecartas de Bronce',
            desc: 'Pieza de escritorio fundida en bronce con motivo de pluma de ave. Un clásico esencial.',
            price: '$24,90',
            img: '/images/products/product-6.png',
        },
        {
            name: 'Pluma Estilográfica Vintage',
            desc: 'Inspirada en los diseños de los años 40, con plumín de acero inoxidable para una escritura fluida y pausada.',
            price: '$24,90',
            img: '/images/products/product-1.png',
        },
        {
            name: 'Sello de Lacre Artesanal',
            desc: 'Un sello de latón grabado a mano con mango de madera de nogal, ideal para sellar tus cartas con elegancia clásica.',
            price: '$24,90',
            img: '/images/products/product-3.png',
        },
    ];

    return (
        <ClienteLayout>
            <Head>
                <title>Catálogo de Objetos | Historias por Correo</title>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=playfair-display:400,600,700,700i|inter:400,500,600,700|cormorant-garamond:400,700,700i|roboto:400,500"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
            </Head>

            {/* 2. Hero Section */}
            <ProductosHeroSection />

            {/* 3. Filter Bar */}
            <FilterBarSection
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

            {/* 4. Products Grid List */}
            <GridProductsSection products={products} />

            {/* 5. Cierre CTA */}
            <CtaSection
                title="Todos los objetos esconden una gran historia"
                description="Si ya regalaste una historia a ese ser especial, regálale un objeto que le permita revivir cada historia"
                buttonText="Encontrar objeto para regalar"
                buttonLink="#"
            />
        </ClienteLayout>
    );
}
