import type { Product } from '@/types/welcome';

/** Paginación Laravel/Inertia para el listado público de productos. */
export type ProductosPaginator = {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

export type ProductoFichaPublica = {
    slug: string;
    name: string;
    subtitle: string;
    description: string;
    description_is_html?: boolean;
    unit_price: number;
    old_price: number | null;
    category: string;
    images: string[];
    included: Array<{ title: string; desc: string; icon: string }>;
    video?: string | null;
    stock?: number;
    in_stock?: boolean;
};
