import { useCallback } from 'react';
import { getUserInitials, type GetInitialsFn } from '@/lib/user-initials';

export type { GetInitialsFn };

export function useInitials(): GetInitialsFn {
    return useCallback(
        (fullName: string): string => getUserInitials(fullName),
        [],
    );
}
