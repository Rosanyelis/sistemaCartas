import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CtaSection from '@/components/tienda/CtaSection';
import FilterBarSection from '@/components/tienda/FilterBarSection';
import GridProductsSection from '@/components/tienda/GridProductsSection';
import ProductosHeroSection from '@/components/tienda/ProductosHeroSection';
import ClienteLayout from '@/layouts/cliente-layout';
import type { Product } from '@/types/welcome';

type ProductosPageProps = {
    products: Product[];
};

export default function Productos() {
    const { products } = usePage<ProductosPageProps>().props;
    const [activeCategory, setActiveCategory] = useState('Todas');

    const categories = [
        'Todas',
        'Escritura',
        'Papelería',
        'Accesorios',
        'Sellos de Lacre',
    ];

    return (
        <ClienteLayout>
            <Head>
                {[
                    <title key="title">
                        Catálogo de Objetos | Historias por Correo
                    </title>,
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

            <ProductosHeroSection />

            <FilterBarSection
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

            <GridProductsSection products={products} />

            <CtaSection
                title="Todos los objetos esconden una gran historia"
                description="Si ya regalaste una historia a ese ser especial, regálale un objeto que le permita revivir cada historia"
                buttonText="Encontrar objeto para regalar"
                buttonLink="#"
            />
        </ClienteLayout>
    );
}
