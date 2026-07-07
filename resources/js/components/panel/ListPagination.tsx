import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';

export type ListPaginationProps = {
    currentPage: number;
    lastPage: number;
    from: number | null;
    to: number | null;
    total: number;
    onPageChange: (page: number) => void;
    variant?: 'admin' | 'cliente';
    className?: string;
};

function getVisiblePageNumbers(
    currentPage: number,
    lastPage: number,
): (number | 'ellipsis')[] {
    if (lastPage <= 1) {
        return [1];
    }

    const pages: (number | 'ellipsis')[] = [];

    for (let page = 1; page <= lastPage; page++) {
        if (
            page === 1 ||
            page === lastPage ||
            (page >= currentPage - 1 && page <= currentPage + 1)
        ) {
            pages.push(page);
        } else if (page === currentPage - 2 || page === currentPage + 2) {
            pages.push('ellipsis');
        }
    }

    return pages.filter(
        (item, index, array) =>
            item !== 'ellipsis' || array[index - 1] !== 'ellipsis',
    );
}

export default function ListPagination({
    currentPage,
    lastPage,
    from,
    to,
    total,
    onPageChange,
    variant = 'admin',
    className,
}: ListPaginationProps) {
    const normalizedLastPage = Math.max(1, lastPage);
    const normalizedCurrentPage = Math.min(
        Math.max(1, currentPage),
        normalizedLastPage,
    );
    const hasRecords = total > 0 && from != null && to != null;
    const navigationDisabled = total === 0;
    const prevDisabled = navigationDisabled || normalizedCurrentPage === 1;
    const nextDisabled =
        navigationDisabled || normalizedCurrentPage === normalizedLastPage;

    const pageNumbers = getVisiblePageNumbers(
        normalizedCurrentPage,
        normalizedLastPage,
    );

    const desktopText = hasRecords ? (
        <>
            Mostrando{' '}
            <span className="font-semibold text-[#111827]">{from}</span> a{' '}
            <span className="font-semibold text-[#111827]">{to}</span> de{' '}
            <span className="font-semibold text-[#111827]">{total}</span>{' '}
            registros
        </>
    ) : (
        'Sin registros'
    );

    const mobileText = hasRecords
        ? `Mostrando ${from} de ${total} registros`
        : total === 0
          ? 'Sin registros'
          : `0 de ${total}`;

    const isAdmin = variant === 'admin';

    const wrapperClass = cn(
        'flex flex-col items-center justify-between gap-4',
        isAdmin
            ? 'border-t border-transparent md:flex-row md:justify-between md:border-[#F3F4F6] md:px-5 md:py-4'
            : 'mt-auto gap-4 bg-white pt-6 md:flex-row md:gap-4',
        className,
    );

    const textClass = cn(
        'w-full text-center font-medium text-[#7B7B7B] md:w-auto md:text-left',
        isAdmin
            ? 'text-[13px] font-bold text-[#9CA3AF] md:font-normal md:text-[#7B7B7B]'
            : "font-['Inter'] text-[14px] md:text-[13px] md:font-semibold",
    );

    const pageButtonClass = (active: boolean) =>
        cn(
            'flex items-center justify-center rounded-md text-[13px] transition-colors',
            isAdmin ? 'size-8' : 'size-8 rounded md:size-8',
            active
                ? 'bg-[#1B3D6D] font-semibold text-white'
                : isAdmin
                  ? 'text-[#7B7B7B] hover:bg-gray-100'
                  : 'text-[#637381] hover:bg-gray-100',
        );

    const navButtonClass = (disabled: boolean) =>
        cn(
            'flex items-center justify-center transition-colors',
            isAdmin ? 'size-8 rounded-md' : 'size-8 rounded',
            disabled
                ? isAdmin
                    ? 'cursor-not-allowed text-[#D1D5DB]'
                    : 'cursor-not-allowed text-[#637381] opacity-30 hover:bg-transparent'
                : isAdmin
                  ? 'text-[#7B7B7B] hover:bg-gray-100'
                  : 'text-[#637381] hover:bg-gray-100',
        );

    return (
        <div className={wrapperClass}>
            <div className={textClass}>
                <span className="hidden md:inline">{desktopText}</span>
                <span className="md:hidden">{mobileText}</span>
            </div>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() =>
                        onPageChange(Math.max(1, normalizedCurrentPage - 1))
                    }
                    disabled={prevDisabled}
                    aria-label="Página anterior"
                    className={navButtonClass(prevDisabled)}
                >
                    <FontAwesomeIcon
                        icon={isAdmin ? faChevronLeft : faChevronDown}
                        className={cn(
                            'text-xs',
                            !isAdmin && 'size-3 rotate-90',
                        )}
                    />
                </button>

                {pageNumbers.map((page, index) =>
                    page === 'ellipsis' ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-1 text-[13px] text-[#A0A0A0]"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(page)}
                            disabled={navigationDisabled}
                            aria-label={`Página ${page}`}
                            aria-current={
                                normalizedCurrentPage === page
                                    ? 'page'
                                    : undefined
                            }
                            className={pageButtonClass(
                                normalizedCurrentPage === page,
                            )}
                        >
                            {page}
                        </button>
                    ),
                )}

                <button
                    type="button"
                    onClick={() =>
                        onPageChange(
                            Math.min(
                                normalizedLastPage,
                                normalizedCurrentPage + 1,
                            ),
                        )
                    }
                    disabled={nextDisabled}
                    aria-label="Página siguiente"
                    className={navButtonClass(nextDisabled)}
                >
                    <FontAwesomeIcon
                        icon={isAdmin ? faChevronRight : faChevronDown}
                        className={cn(
                            'text-xs',
                            !isAdmin && 'size-3 -rotate-90',
                        )}
                    />
                </button>
            </div>
        </div>
    );
}
