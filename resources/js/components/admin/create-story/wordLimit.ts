/**
 * Cuenta palabras como en el backend: colapsa espacios Unicode y omite HTML.
 * Debe mantenerse alineado con `App\Rules\MaxWords::countWords`.
 */
export function countWords(text: string): number {
    const stripped = text.replace(/<[^>]*>/g, '');
    const normalized = stripped.replace(/\s+/gu, ' ').trim();
    if (!normalized) {
        return 0;
    }
    return normalized.split(/\s+/).length;
}

/** Recorta al máximo de palabras (útil al pegar texto largo). */
export function clampToMaxWords(text: string, maxWords: number): string {
    if (countWords(text) <= maxWords) {
        return text;
    }
    const normalized = text.replace(/\s+/gu, ' ').trim();
    const parts = normalized.split(/\s+/);
    return parts.slice(0, maxWords).join(' ');
}
