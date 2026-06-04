import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export type CatalogGridPaginationData = {
    current_page: number;
    last_page: number;
    prev_page_url?: string | null;
    next_page_url?: string | null;
    first_page_url?: string | null;
    path?: string;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export type CatalogGridPaginationProps = {
    pagination: CatalogGridPaginationData;
    /** Props `only` de Inertia al cambiar página */
    inertiaOnly: string[];
    ariaLabel: string;
    className?: string;
};

function stripHtmlTags(html: string): string {
    return html
        .replace(/&laquo;/g, '')
        .replace(/&raquo;/g, '')
        .replace(/&hellip;/g, '')
        .replace(/&amp;/g, '&')
        .replace(/<[^>]*>/g, '')
        .trim();
}

/**
 * URL de página sin usar el texto visible del enlace (evita "pagination.previous", etc.).
 */
function resolvePageUrl(
    pagination: CatalogGridPaginationData,
    page: number,
): string | null {
    if (page < 1 || page > pagination.last_page) {
        return null;
    }

    const fromLinks = pagination.links.find((item) => {
        if (!item.url) {
            return false;
        }

        const n = Number.parseInt(stripHtmlTags(item.label), 10);

        return Number.isFinite(n) && n === page;
    });

    if (fromLinks?.url) {
        return fromLinks.url;
    }

    const template =
        pagination.links.find((item) => item.url)?.url ??
        pagination.first_page_url ??
        null;

    if (!template) {
        return null;
    }

    try {
        const target = new URL(template, 'http://local');
        target.searchParams.set('page', String(page));

        return `${target.pathname}${target.search}`;
    } catch {
        return null;
    }
}

function pageNumbers(lastPage: number): number[] {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
}

export default function CatalogGridPagination({
    pagination,
    inertiaOnly,
    ariaLabel,
    className,
}: CatalogGridPaginationProps) {
    if (pagination.last_page <= 1) {
        return null;
    }

    const prev = pagination.prev_page_url ?? null;
    const next = pagination.next_page_url ?? null;
    const pages = pageNumbers(pagination.last_page);

    return (
        <nav
            className={cn(
                'mt-[30px] flex w-full max-w-[640px] items-center justify-between gap-4 sm:gap-8',
                className,
            )}
            aria-label={ariaLabel}
        >
            {prev ? (
                <Link
                    href={prev}
                    preserveScroll
                    preserveState
                    only={inertiaOnly}
                    className="flex shrink-0 items-center justify-center p-2 text-[#637381] transition-colors hover:text-[#1B3D6D]"
                    aria-label="Página anterior"
                >
                    <i className="fa-solid fa-chevron-left text-sm" aria-hidden />
                </Link>
            ) : (
                <span
                    className="flex shrink-0 cursor-not-allowed items-center justify-center p-2 text-[#C4C4C4]"
                    aria-hidden
                >
                    <i className="fa-solid fa-chevron-left text-sm" />
                </span>
            )}

            <div className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto scrollbar-hide font-['Inter',sans-serif] text-[15px] font-normal sm:gap-3 sm:text-[16px]">
                {pages.map((page) => {
                    const url = resolvePageUrl(pagination, page);
                    const isActive = page === pagination.current_page;

                    if (url && !isActive) {
                        return (
                            <Link
                                key={page}
                                href={url}
                                preserveScroll
                                preserveState
                                only={inertiaOnly}
                                className="flex h-10 min-w-[2.25rem] shrink-0 items-center justify-center rounded-lg px-2 text-[#637381] transition-colors hover:text-[#1B3D6D]"
                            >
                                {page}
                            </Link>
                        );
                    }

                    return (
                        <span
                            key={page}
                            className={cn(
                                'flex h-10 min-w-[2.25rem] shrink-0 items-center justify-center rounded-lg px-2',
                                isActive
                                    ? 'bg-[#1B3D6D] font-semibold text-white'
                                    : 'text-[#637381] select-none',
                            )}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {page}
                        </span>
                    );
                })}
            </div>

            {next ? (
                <Link
                    href={next}
                    preserveScroll
                    preserveState
                    only={inertiaOnly}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#1B3D6D] transition-colors hover:bg-[#E8EAED]"
                    aria-label="Página siguiente"
                >
                    <i className="fa-solid fa-chevron-right text-sm" aria-hidden />
                </Link>
            ) : (
                <span
                    className="flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-lg bg-[#F3F4F6] text-[#C4C4C4]"
                    aria-hidden
                >
                    <i className="fa-solid fa-chevron-right text-sm" />
                </span>
            )}
        </nav>
    );
}
