import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

export type HistoriaSelectOption = {
    id: number;
    nombre: string;
};

interface SearchableHistoriaSelectProps {
    historias: HistoriaSelectOption[];
    value: string;
    onChange: (historiaId: string) => void;
    error?: string;
    placeholder?: string;
}

const inputClass = (hasError: boolean) =>
    `w-full rounded-[4px] border ${hasError ? 'border-red-500' : 'border-[#DFE4EA]'} bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all`;

export function SearchableHistoriaSelect({
    historias,
    value,
    onChange,
    error,
    placeholder = 'Seleccionar historia',
}: SearchableHistoriaSelectProps) {
    const listId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const historiasOrdenadas = useMemo(
        () => [...historias].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')),
        [historias],
    );

    const selected = historiasOrdenadas.find((h) => String(h.id) === value);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (term === '') {
            return historiasOrdenadas;
        }

        return historiasOrdenadas.filter((h) => h.nombre.toLowerCase().includes(term));
    }, [historiasOrdenadas, search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (historiaId: number) => {
        onChange(String(historiaId));
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className={`${inputClass(!!error)} flex items-center justify-between gap-2 text-left`}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className={selected ? 'text-gray-800' : 'text-[#A0A0A0]'}>
                    {selected?.nombre ?? placeholder}
                </span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-[10px] text-[#A0A0A0] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-30 mt-1 w-full rounded-[4px] border border-[#DFE4EA] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
                    <div className="border-b border-[#F3F4F6] p-2">
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#A0A0A0]"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar historia..."
                                className="w-full rounded-[4px] border border-[#DFE4EA] py-2 pl-8 pr-3 text-[13px] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15"
                                autoFocus
                            />
                        </div>
                    </div>
                    <ul
                        id={listId}
                        role="listbox"
                        className="max-h-48 overflow-y-auto py-1"
                    >
                        {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-[13px] text-[#7B7B7B]">
                                No se encontraron historias.
                            </li>
                        ) : (
                            filtered.map((historia) => {
                                const isSelected = String(historia.id) === value;

                                return (
                                    <li key={historia.id}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => handleSelect(historia.id)}
                                            className={`flex w-full items-center px-4 py-2.5 text-left text-[14px] transition-colors hover:bg-[#F9FAFB] ${
                                                isSelected
                                                    ? 'bg-[#1B3D6D]/10 font-semibold text-[#1B3D6D]'
                                                    : 'text-[#4B5563]'
                                            }`}
                                        >
                                            {historia.nombre}
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}

            {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
        </div>
    );
}
