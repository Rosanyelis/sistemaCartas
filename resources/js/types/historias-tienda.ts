import type { Story } from '@/types/welcome';

/** Paginador serializado por Laravel para Inertia */
export type LaravelPaginator<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};

export type HistoriasTiendaPageProps = {
    historias: LaravelPaginator<Story>;
    destacadas: Story[];
    categorias: string[];
    filters: {
        categoria: string;
        search: string;
    };
};
