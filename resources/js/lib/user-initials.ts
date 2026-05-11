export type GetInitialsFn = (fullName: string) => string;

/**
 * Iniciales para avatar sustituto (p. ej. «Ana García López» → «AG»).
 */
export function getUserInitials(fullName: string): string {
    const names = fullName.trim().split(/\s+/).filter(Boolean);

    if (names.length === 0) {
        return '?';
    }

    if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
    }

    const firstInitial = names[0].charAt(0);
    const lastInitial = names[names.length - 1].charAt(0);

    return `${firstInitial}${lastInitial}`.toUpperCase();
}
