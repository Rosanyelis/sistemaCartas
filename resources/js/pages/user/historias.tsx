import { Head, usePage } from '@inertiajs/react';
import CatalogoHeroSection from '@/components/tienda/CatalogoHeroSection';
import CtaSection from '@/components/tienda/CtaSection';
import FeaturedStoriesSection from '@/components/tienda/FeaturedStoriesSection';
import GridStoriesSection from '@/components/tienda/GridStoriesSection';
import HistoriasFilterBarSection from '@/components/tienda/HistoriasFilterBarSection';
import ClienteLayout from '@/layouts/cliente-layout';
import type { HistoriasTiendaPageProps } from '@/types/historias-tienda';

export default function Historias() {
    const { historias, destacadas, categorias, filters } =
        usePage<HistoriasTiendaPageProps>().props;

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

            <CatalogoHeroSection />

            <HistoriasFilterBarSection
                categories={categorias}
                filters={filters}
            />

            <GridStoriesSection
                stories={historias.data}
                pagination={historias}
            />

            <FeaturedStoriesSection stories={destacadas} />

            <CtaSection
                title="¿Buscas un regalo especial?"
                description="Nuestras historias son el regalo perfecto para los amantes de la lectura y las historias. Sorprende a esa persona especial y regálale una historia"
                buttonText="Encontrar una historia para regalar"
                buttonLink="/historias"
            />
        </ClienteLayout>
    );
}
