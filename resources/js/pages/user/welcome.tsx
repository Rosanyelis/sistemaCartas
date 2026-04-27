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

type WelcomePageProps = {
    /** Desde BD (destacadas activas); si falta la clave, se usan datos de referencia. */
    stories?: Story[];
    products?: Product[];
    testimonials?: Testimonial[];
};

export default function Welcome({
    stories: storiesFromServer,
    products = defaultProducts,
    testimonials = defaultTestimonials,
}: WelcomePageProps) {
    const stories = storiesFromServer ?? defaultStories;

    return (
        <ClienteLayout>
            <Head>
                <title>Historias por Correo</title>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
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
