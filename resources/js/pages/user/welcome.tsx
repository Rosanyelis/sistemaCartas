import { Head } from '@inertiajs/react';
import AboutSection from '@/components/tienda/AboutSection';
import CtaSection from '@/components/tienda/CtaSection';
import HeroSection from '@/components/tienda/HeroSection';
import HowItWorksSection from '@/components/tienda/HowItWorksSection';
import ProductsSection from '@/components/tienda/ProductsSection';
import StoriesSection from '@/components/tienda/StoriesSection';
import TestimonialsSection from '@/components/tienda/TestimonialsSection';
import {
    defaultStories,
    defaultProducts,
    defaultTestimonials,
} from '@/constants/welcome';
import ClienteLayout from '@/layouts/cliente-layout';
import type { Story, Product, Testimonial } from '@/types/welcome';

export default function Welcome({
    canRegister = true,
    stories = defaultStories,
    products = defaultProducts,
    testimonials = defaultTestimonials,
}: {
    canRegister?: boolean;
    stories?: Story[];
    products?: Product[];
    testimonials?: Testimonial[];
}) {
    return (
        <ClienteLayout>
            <Head>
                {[
                    <title key="title">Historias por Correo</title>,
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
            <HeroSection />

            {/* 3. ¿Qué es Historias por Correo? */}
            <AboutSection />

            {/* 4. Historias (Slider) */}
            <StoriesSection stories={stories} />

            {/* 5. ¿Cómo funciona? */}
            <HowItWorksSection />

            {/* 6. Objetos que acompañan */}
            <ProductsSection products={products} />

            {/* 7. Testimonios */}
            <TestimonialsSection
                title="Lo que dicen nuestros lectores"
                testimonials={testimonials}
            />

            {/* 8. CTA Final */}
            <CtaSection
                title="Algunas historias merecen seguir llegando"
                buttonText="Explorar historias"
                buttonLink="#historias"
            />
        </ClienteLayout>
    );
}
