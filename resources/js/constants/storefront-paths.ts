/**
 * Rutas públicas de la tienda (alineadas con routes/web.php).
 * Archivo versionado para que `npm run build` no falle si `resources/js/routes`
 * aún no existe en el entorno (Wayfinder en .gitignore).
 */
export const STOREFRONT_PATHS = {
    home: '/',
    historias: '/historias',
    productos: '/productos',
    terminosYCondiciones: '/terminos-y-condiciones',
    avisoDePrivacidad: '/aviso-de-privacidad',
} as const;
