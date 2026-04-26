/**
 * URL del listado público de historias con filtros en query string.
 */
export function historiasCatalogoUrl(filters: {
    categoria: string;
    search: string;
}): string {
    const params = new URLSearchParams();

    if (filters.categoria && filters.categoria !== 'Todas') {
        params.set('categoria', filters.categoria);
    }

    const q = filters.search.trim();

    if (q !== '') {
        params.set('search', q);
    }

    const s = params.toString();

    return s === '' ? '/historias' : `/historias?${s}`;
}
