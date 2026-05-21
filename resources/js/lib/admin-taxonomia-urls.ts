/**
 * URLs de taxonomía admin (`routes/web.php`).
 * No importar `@/routes/admin/taxonomia/*`: esos archivos están en `.gitignore`
 * y el build en deploy falla si Wayfinder no los genera antes de `vite build`.
 */

type TaxonomiaListQuery = {
    page?: number;
    per_page?: number;
    producto_categoria_id?: number;
};

function withQuery(base: string, query?: TaxonomiaListQuery): string {
    if (!query) {
        return base;
    }

    const params = new URLSearchParams();

    if (query.page !== undefined) {
        params.set('page', String(query.page));
    }

    if (query.per_page !== undefined) {
        params.set('per_page', String(query.per_page));
    }

    if (query.producto_categoria_id !== undefined) {
        params.set('producto_categoria_id', String(query.producto_categoria_id));
    }

    const qs = params.toString();

    return qs ? `${base}?${qs}` : base;
}

export const adminTaxonomiaUrls = {
    historiaCategorias: {
        index: (query?: TaxonomiaListQuery) =>
            withQuery('/admin/taxonomia/historia-categorias', query),
        store: () => '/admin/taxonomia/historia-categorias',
        destroy: (id: number) => `/admin/taxonomia/historia-categorias/${id}`,
    },
    productoCategorias: {
        index: (query?: TaxonomiaListQuery) =>
            withQuery('/admin/taxonomia/producto-categorias', query),
        store: () => '/admin/taxonomia/producto-categorias',
        destroy: (id: number) => `/admin/taxonomia/producto-categorias/${id}`,
    },
    productoSubcategorias: {
        index: (query?: TaxonomiaListQuery) =>
            withQuery('/admin/taxonomia/producto-subcategorias', query),
        store: () => '/admin/taxonomia/producto-subcategorias',
        destroy: (id: number) => `/admin/taxonomia/producto-subcategorias/${id}`,
    },
} as const;
