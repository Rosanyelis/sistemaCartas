import { Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { historiasCatalogoUrl } from '@/lib/historias-catalogo-url';

interface HistoriasFilterBarSectionProps {
    categories: string[];
    filters: {
        categoria: string;
        search: string;
    };
}

const SEARCH_DEBOUNCE_MS = 350;

/**
 * Solo la categoría fuerza remount: al cambiar de pestaña se reinicia el estado
 * del buscador desde el servidor. La búsqueda se sincroniza por debounce sin
 * desmontar el input mientras se escribe.
 */
export default function HistoriasFilterBarSection(
    props: HistoriasFilterBarSectionProps,
) {
    return (
        <HistoriasFilterBarSectionInner
            key={props.filters.categoria}
            {...props}
        />
    );
}

function HistoriasFilterBarSectionInner({
    categories,
    filters,
}: HistoriasFilterBarSectionProps) {
    const [searchDraft, setSearchDraft] = useState(filters.search);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- alinear el input con la query del servidor (enlaces, historial)
        setSearchDraft(filters.search);
    }, [filters.search]);

    useEffect(() => {
        return () => {
            if (debounceRef.current !== null) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const runSearch = useCallback(
        (raw: string): void => {
            const q = raw.trim();

            router.get(
                '/historias',
                {
                    categoria:
                        filters.categoria === 'Todas'
                            ? undefined
                            : filters.categoria,
                    search: q === '' ? undefined : q,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['historias', 'destacadas', 'categorias', 'filters'],
                },
            );
        },
        [filters.categoria],
    );

    function onSearchChange(value: string): void {
        setSearchDraft(value);

        if (debounceRef.current !== null) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            debounceRef.current = null;
            runSearch(value);
        }, SEARCH_DEBOUNCE_MS);
    }

    return (
        <section className="flex w-full items-center justify-between border-b border-[#F2F2F2] bg-white px-[20px] py-[16px] lg:px-[72px]">
            <div className="mx-auto flex w-full max-w-[1296px] flex-col items-center justify-between gap-4 lg:flex-row lg:gap-[98px]">
                <div
                    className="order-1 flex w-full shrink-0 items-center gap-[10px] rounded-[6px] border border-[#DFE4EA] bg-white px-5 py-3 lg:order-2 lg:max-w-[350px]"
                    role="search"
                >
                    <i className="fa-solid fa-search text-[#1B3D6D]"></i>
                    <input
                        type="search"
                        name="search"
                        value={searchDraft}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar historia..."
                        autoComplete="off"
                        className="m-0 w-full flex-1 border-none bg-transparent p-0 font-['Inter',sans-serif] text-[16px] text-[#1B3D6D] placeholder-[#1B3D6D]/70 outline-none focus:ring-0"
                    />
                </div>

                <div className="scrollbar-hide order-2 flex w-full flex-row items-center gap-4 overflow-x-auto py-2 lg:order-1 lg:w-auto">
                    <i className="fa-solid fa-filter flex h-6 w-6 shrink-0 items-center justify-center text-[#1B3D6D]"></i>
                    <div className="flex shrink-0 items-center gap-2 lg:gap-1">
                        {categories.map((cat) => {
                            const href = historiasCatalogoUrl({
                                categoria: cat,
                                search: filters.search,
                            });
                            const isActive = filters.categoria === cat;

                            return (
                                <Link
                                    key={cat}
                                    href={href}
                                    preserveScroll
                                    preserveState
                                    only={[
                                        'historias',
                                        'destacadas',
                                        'categorias',
                                        'filters',
                                    ]}
                                    className={`flex h-[32px] items-center justify-center rounded-[4px] px-[14px] py-[6px] transition lg:h-[22px] lg:rounded-[2px] lg:px-[10px] lg:py-[3px] ${
                                        isActive
                                            ? 'bg-[#1B3D6D] text-white'
                                            : 'bg-[rgba(27,61,109,0.1)] text-[#1B3D6D] hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="font-['Inter',sans-serif] text-[14px] leading-[1.2] font-medium whitespace-nowrap lg:text-[13px] lg:leading-[16px] lg:font-normal">
                                        {cat}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
