import React, { useState, useCallback, useEffect, useRef } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faCalendarAlt,
    faFileExcel,
    faChevronDown,
    faFilter,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

interface SubscriptionUser {
    id: number;
    name: string;
    email: string;
    direction: string | null;
}

interface SubscriptionHistoria {
    id: number;
    nombre: string;
}

interface Subscription {
    id: number;
    user: SubscriptionUser | null;
    historia: SubscriptionHistoria | null;
    cantidad: number;
    tipo: string;
    fecha_adquisicion: string;
    fecha_finalizacion: string | null;
    proximo_cobro: string | null;
    estado: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Props {
    suscripciones: PaginatedData<Subscription>;
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function Subscriptions({ suscripciones, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const dateMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dateMenuRef.current && !dateMenuRef.current.contains(event.target as Node)) {
                setIsDateMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const applyFilters = useCallback(
        (params: Record<string, string>) => {
            router.get(
                '/admin/suscripciones',
                { ...filters, ...params, page: '1' },
                { preserveState: true, preserveScroll: true },
            );
        },
        [filters],
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        applyFilters({ search: val });
    };

    const handleDateApply = () => {
        applyFilters({ start_date: startDate, end_date: endDate });
        setIsDateMenuOpen(false);
    };

    const handleDateClear = () => {
        setStartDate('');
        setEndDate('');
        applyFilters({ start_date: '', end_date: '' });
    };

    const goToPage = (page: number) => {
        router.get(
            '/admin/suscripciones',
            { ...filters, page: String(page) },
            { preserveState: true, preserveScroll: true },
        );
    };

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatDateLabel = (date: string) => date.split('-').reverse().join('/');

    const { data: subList, current_page, last_page, from, to, total } = suscripciones;

    return (
        <UserLayout title="Suscripciones">
            <Head title="Gestión de Suscripciones" />

            <div className="flex flex-col gap-6 px-4 md:px-8 py-6 font-['Inter']">
                {/* Header Section */}
                <div className="flex flex-col gap-1 items-center text-center md:items-start md:text-left mb-2 md:mb-0">
                    <h1 className="text-[25px] md:text-2xl font-bold text-[#1B3D6D]">
                        Suscripciones
                    </h1>
                    <p className="text-[13.5px] md:text-sm text-[#1B3D6D] md:text-[#7B7B7B]">
                        Aquí puedes revisar y gestionar todas las suscripciones de la plataforma
                    </p>
                </div>

                {/* Filters/Actions Bar */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full">
                    <div className="relative w-full lg:flex-1 lg:max-w-xl">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} className="text-[#1B3D6D] md:text-[#A0A0A0] opacity-60 md:opacity-100 text-[13px] md:text-sm" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Buscar por número de órden o producto"
                            className="block w-full rounded-[4px] md:rounded-md border border-[#DFE4EA] md:border-[#E5E7EB] bg-white py-[10px] md:py-2.5 pl-[34px] md:pl-10 pr-3 text-[13px] md:text-sm text-[#1B3D6D] md:text-gray-900 placeholder:text-[#1B3D6D]/60 md:placeholder:text-[#A0A0A0] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15 outline-none transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.05)] md:shadow-none"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-3 relative w-full lg:w-auto" ref={dateMenuRef}>
                        <div 
                            onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                            className="flex w-full md:w-auto justify-center md:justify-start items-center gap-2 rounded-[4px] md:rounded-md border border-[#DFE4EA] md:border-[#E5E7EB] bg-white px-4 py-[10px] md:py-2.5 text-[13px] md:text-sm text-[#1B3D6D] md:text-[#4B5563] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-medium md:font-medium opacity-80 md:opacity-100">
                                {startDate && endDate 
                                    ? `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}` 
                                    : startDate 
                                        ? `Desde ${formatDateLabel(startDate)}` 
                                        : endDate 
                                            ? `Hasta ${formatDateLabel(endDate)}` 
                                            : 'Seleccionar fechas'}
                            </span>
                            <FontAwesomeIcon 
                                icon={faChevronDown} 
                                className={`text-[#1B3D6D] md:text-[#A0A0A0] opacity-60 md:opacity-100 ml-1 text-[10px] md:text-xs transition-transform ${isDateMenuOpen ? 'rotate-180' : ''}`} 
                            />
                        </div>

                        {/* Dropdown del calendario */}
                        {isDateMenuOpen && (
                            <div className="absolute top-full right-0 lg:left-0 lg:right-auto mt-2 z-10 w-full md:w-72 rounded-md border border-[#E5E7EB] bg-white p-4 shadow-lg">
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-[#7B7B7B]">Desde (Fecha de adquisición):</label>
                                        <input 
                                            type="date" 
                                            value={startDate} 
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full rounded border border-[#E5E7EB] p-2 text-sm text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]" 
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-[#7B7B7B]">Hasta (Fecha de adquisición):</label>
                                        <input 
                                            type="date" 
                                            value={endDate} 
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full rounded border border-[#E5E7EB] p-2 text-sm text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]" 
                                        />
                                    </div>
                                    <div className="mt-2 flex justify-end gap-2">
                                        <button 
                                            onClick={handleDateClear}
                                            className="rounded px-3 py-1.5 text-xs text-[#7B7B7B] font-medium hover:bg-gray-100 transition-colors"
                                        >
                                            Limpiar
                                        </button>
                                        <button 
                                            onClick={handleDateApply}
                                            className="rounded bg-[#1B3D6D] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1B3D6D]/90 transition-colors"
                                        >
                                            Aplicar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={() => {
                                const params = new URLSearchParams(filters as any).toString();
                                window.location.href = `/admin/suscripciones/export?${params}`;
                            }}
                            className="flex w-full md:w-auto justify-center md:justify-start items-center gap-2 rounded-[4px] md:rounded-md border border-[#1B3D6D] bg-white px-5 md:px-4 py-[10px] md:py-2.5 text-[14px] md:text-sm font-bold md:font-semibold text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] md:shadow-sm hover:bg-[#F8F9FA] transition-colors"
                        >
                            <span>Exportar a excel</span>
                            <FontAwesomeIcon icon={faFileExcel} className="text-[12px] md:text-[14px] opacity-80 md:opacity-100" />
                        </button>
                    </div>
                </div>

                {/* Main Content Container */}
                <div className="flex flex-col bg-transparent md:bg-white md:shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:rounded-lg overflow-hidden w-full">
                    
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            Nº <FontAwesomeIcon icon={faChevronDown} className="text-[10px] opacity-50" />
                                        </div>
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Historia</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider text-center">Cantidad</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Suscripción</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">F. adquisición</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">F. finalización</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Próximo cobro</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Nombre</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Dirección</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            Estado <FontAwesomeIcon icon={faFilter} className="text-[10px] opacity-50" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {subList.length > 0 ? (
                                    subList.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4 text-sm font-semibold text-[#1B3D6D]">#{sub.id}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{sub.historia?.nombre ?? '-'}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563] text-center">{sub.cantidad}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{sub.tipo}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{formatDate(sub.fecha_adquisicion)}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{formatDate(sub.fecha_finalizacion)}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{formatDate(sub.proximo_cobro)}</td>
                                            <td className="px-5 py-4 text-sm font-medium text-[#111827]">{sub.user?.name ?? '-'}</td>
                                            <td className="px-5 py-4 text-sm text-[#7B7B7B]">{sub.user?.direction ?? '-'}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                                                    ${sub.estado === 'activa' ? 'bg-[#E8F8F0] text-[#10B981]' : 
                                                    sub.estado === 'inactiva' ? 'bg-[#FEE2E2] text-[#EF4444]' : 
                                                    'bg-[#FEF3C7] text-[#D97706]'}`}>
                                                    {sub.estado.charAt(0).toUpperCase() + sub.estado.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="px-5 py-10 text-center text-sm text-[#7B7B7B]">
                                            No se encontraron suscripciones que coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="flex flex-col bg-white rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.04)] block md:hidden mb-4">
                        <div className="flex flex-col divide-y divide-[#F3F4F6] w-full">
                            {subList.length > 0 ? (
                                subList.map((sub) => (
                                    <div key={sub.id} className="flex flex-col py-[18px] px-5 gap-3">
                                        <div className="flex justify-between items-center bg-white">
                                            <span className="text-[13.5px] font-medium text-[#4B5563]">#{sub.id}</span>
                                            <span className={`inline-flex items-center px-[10px] py-[3px] rounded text-[11.5px] font-medium tracking-wide
                                                ${sub.estado === 'activa' ? 'bg-[#D1F4E0] text-[#12A05B]' : 
                                                sub.estado === 'inactiva' ? 'bg-[#FEE2E2] text-[#EF4444]' : 
                                                'bg-[#FEF3C7] text-[#D97706]'}`}>
                                                {sub.estado.charAt(0).toUpperCase() + sub.estado.slice(1)}
                                            </span>
                                        </div>
                                        <div className="-mt-1 text-[13.5px] font-medium text-[#111827]">
                                            {sub.historia?.nombre ?? '-'}
                                        </div>
                                        <div className="flex justify-between items-center mt-[-2px]">
                                            <span className="text-[13px] text-[#4B5563]">Suscripción: <span className="text-[#111827]">{sub.tipo}</span></span>
                                            <span className="text-[13px] text-[#111827] font-medium">Cantidad: {sub.cantidad}</span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] text-[#A0A0A0]">F. adquisición</span>
                                                <span className="text-[12px] text-[#4B5563] font-medium mt-0.5">{formatDate(sub.fecha_adquisicion)}</span>
                                            </div>
                                            <div className="flex flex-col items-center text-center">
                                                <span className="text-[11px] text-[#A0A0A0]">F. finalización</span>
                                                <span className="text-[12px] text-[#4B5563] font-medium mt-0.5">{formatDate(sub.fecha_finalizacion)}</span>
                                            </div>
                                            <div className="flex flex-col items-end text-right">
                                                <span className="text-[11px] text-[#A0A0A0]">Próximo cobro</span>
                                                <span className="text-[12px] text-[#4B5563] font-medium mt-0.5">{formatDate(sub.proximo_cobro)}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] text-[#A0A0A0]">Cliente</span>
                                                <span className="text-[12px] text-[#4B5563] font-medium mt-0.5">{sub.user?.name ?? '-'}</span>
                                            </div>
                                            <div className="flex flex-col text-right items-end">
                                                <span className="text-[11px] text-[#A0A0A0]">Dirección</span>
                                                <span className="text-[12px] text-[#4B5563] font-medium mt-0.5 truncate leading-tight w-full max-w-[150px]">{sub.user?.direction ?? '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-[13px] text-[#7B7B7B]">
                                    No se encontraron suscripciones que coincidan con la búsqueda.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shared Pagination */}
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-between border-t border-transparent md:border-[#F3F4F6] md:px-5 py-4 md:py-4 bg-transparent md:bg-white gap-4 md:gap-0 mt-2 md:mt-0">
                        <div className="text-[13px] font-bold md:font-normal text-[#9CA3AF] md:text-[#7B7B7B]">
                            <span className="hidden md:inline">
                                {from && to ? (
                                    <>Mostrando <span className="text-[#111827] font-semibold">{from}</span> a <span className="text-[#111827] font-semibold">{to}</span> de <span className="text-[#111827] font-semibold">{total}</span> registros</>
                                ) : 'Sin registros'}
                            </span>
                            <span className="md:hidden">
                                {from ? `Mostrando ${from} de ${total} registros` : 'Sin registros'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => goToPage(current_page - 1)}
                                disabled={current_page === 1}
                                className={`flex items-center justify-center size-8 rounded-md transition-colors ${current_page === 1 ? 'text-[#D1D5DB] cursor-not-allowed' : 'hover:bg-gray-100 text-[#7B7B7B]'}`}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                            </button>
                            
                            {Array.from({ length: last_page }, (_, i) => i + 1).map(page => {
                                if (
                                    page === 1 ||
                                    page === last_page ||
                                    (page >= current_page - 1 && page <= current_page + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`flex items-center justify-center size-8 rounded-md transition-colors ${
                                                current_page === page 
                                                    ? 'bg-[#1B3D6D] text-white font-semibold' 
                                                    : 'hover:bg-gray-100 text-[#7B7B7B]'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (page === current_page - 2 || page === current_page + 2) {
                                    return <span key={page} className="px-1 text-[#A0A0A0]">...</span>;
                                }
                                return null;
                            })}

                            <button 
                                onClick={() => goToPage(current_page + 1)}
                                disabled={current_page === last_page}
                                className={`flex items-center justify-center size-8 rounded-md transition-colors ${current_page === last_page ? 'text-[#D1D5DB] cursor-not-allowed' : 'hover:bg-gray-100 text-[#7B7B7B]'}`}
                            >
                                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
