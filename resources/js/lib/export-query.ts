/**
 * Omite claves vacías, null o undefined para evitar filtros inválidos en exportaciones (p. ej. categoria_id=null).
 */
export function buildExportQuery(filters: Record<string, unknown>): Record<string, string> {
    const query: Record<string, string> = {};

    for (const [key, value] of Object.entries(filters)) {
        if (value === null || value === undefined || value === '') {
            continue;
        }

        query[key] = String(value);
    }

    return query;
}
