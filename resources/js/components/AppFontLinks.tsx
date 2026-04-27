import type { ReactElement } from 'react';

/**
 * Carga global de familias alineada con la tienda (Bunny) para Inter, Playfair y Cormorant.
 * Usar en layouts raíz (p. ej. user-layout, cliente-layout), no duplicar en cada página.
 */
export function appFontLinks(): ReactElement[] {
    return [
        <link key="fonts-preconnect" rel="preconnect" href="https://fonts.bunny.net" />,
        <link
            key="fonts-family"
            href="https://fonts.bunny.net/css?family=playfair-display:400,600,700,700i|inter:400,500,600,700|cormorant-garamond:400,700,700i|roboto:400,500"
            rel="stylesheet"
        />,
    ];
}
