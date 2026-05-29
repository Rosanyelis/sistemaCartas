import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export type CatalogGridPaginationData = {
    current_page: number;
    last_page: number;
    prev_page_url?: string | null;
    next_page_url?: string | null;
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
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&hellip;/g, '…')
        .replace(/&amp;/g, '&')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function isNavigationLink(label: string): boolean {
    const lab = stripHtmlTags(label).replace(/«|»/g, '').trim();

    return lab === 'Previous' || lab === 'Next';
}

function findNavUrl(
    links: CatalogGridPaginationData['links'],
    direction: 'prev' | 'next',
): string | null {
    const link = links.find((item) => {
        const lab = stripHtmlTags(item.label).toLowerCase();

        if (direction === 'prev') {
            return lab.includes('previous') || lab === '«';
        }

        return lab.includes('next') || lab === '»';
    });

    return link?.url ?? null;
}

function resolveNavUrls(pagination: CatalogGridPaginationData): {
    prev: string | null;
    next: string | null;
} {
    return {
        prev:
            pagination.prev_page_url ??
            findNavUrl(pagination.links, 'prev'),
        next:
            pagination.next_page_url ??
            findNavUrl(pagination.links, 'next'),
    };
}

const numberLinks = (pagination: CatalogGridPaginationData) =>
    pagination.links.filter((link) => !isNavigationLink(link.label));

export default function CatalogGridPagination({
    pagination,
    inertiaOnly,
    ariaLabel,
    className,
}: CatalogGridPaginationProps) {
    if (pagination.last_page <= 1) {
        return null;
    }

    const { prev, next } = resolveNavUrls(pagination);
    const pages = numberLinks(pagination);

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
                {pages.map((link, idx) => {
                    const labelText = stripHtmlTags(link.label);

                    if (link.url) {
                        return (
                            <Link
                                key={`${link.label}-${idx}`}
                                href={link.url}
                                preserveScroll
                                preserveState
                                only={inertiaOnly}
                                className={cn(
                                    'flex h-10 min-w-[2.25rem] shrink-0 items-center justify-center rounded-lg px-2 transition-colors',
                                    link.active
                                        ? 'bg-[#1B3D6D] font-semibold text-white'
                                        : 'text-[#637381] hover:text-[#1B3D6D]',
                                )}
                                aria-current={link.active ? 'page' : undefined}
                            >
                                {labelText}
                            </Link>
                        );
                    }

                    return (
                        <span
                            key={`${link.label}-${idx}`}
                            className="shrink-0 px-1.5 text-[#637381] select-none"
                        >
                            {labelText}
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
