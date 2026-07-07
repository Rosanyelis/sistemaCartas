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
} from '@fortawesome/free-solid-svg-icons';
import ListPagination from '@/components/panel/ListPagination';
import type { PaginatedData } from '@/types/pagination';
import { suscripciones as adminSuscripcionesIndex } from '@/routes/admin';
import { exportMethod as suscripcionesExport } from '@/routes/admin/suscripciones';

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
    estado_label: string;
    estado_color: 'success' | 'warning' | 'danger';
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
            if (
                dateMenuRef.current &&
                !dateMenuRef.current.contains(event.target as Node)
            ) {
                setIsDateMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const applyFilters = useCallback(
        (params: Record<string, string>) => {
            router.get(
                adminSuscripcionesIndex.url({
                    query: { ...filters, ...params, page: '1' },
                }),
                {},
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
            adminSuscripcionesIndex.url({
                query: { ...filters, page: String(page) },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatDateLabel = (date: string) =>
        date.split('-').reverse().join('/');

    const subscriptionStatusBadgeClass = (
        tone: 'success' | 'danger' | 'warning',
        compact = false,
    ): string => {
        if (tone === 'success') {
            return compact
                ? 'bg-[#D1F4E0] text-[#12A05B]'
                : 'bg-[#E8F8F0] text-[#10B981]';
        }

        if (tone === 'danger') {
            return compact
                ? 'bg-[#FEE2E2] text-[#EF4444]'
                : 'bg-[#FEE2E2] text-[#EF4444]';
        }

        return compact
            ? 'bg-[#FEF3C7] text-[#D97706]'
            : 'bg-[#FEF3C7] text-[#D97706]';
    };

    const {
        data: subList,
        current_page,
        last_page,
        from,
        to,
        total,
    } = suscripciones;

    return (
        <UserLayout title="Suscripciones">
            <Head title="Gestión de Suscripciones" />

            <div className="flex flex-col gap-6 px-4 py-6 font-['Inter'] md:px-8">
                {/* Header Section */}
                <div className="mb-2 flex flex-col items-center gap-1 text-center md:mb-0 md:items-start md:text-left">
                    <h1 className="text-[25px] font-bold text-[#1B3D6D] md:text-2xl">
                        Suscripciones
                    </h1>
                    <p className="text-[13.5px] text-[#1B3D6D] md:text-sm md:text-[#7B7B7B]">
                        Aquí puedes revisar y gestionar todas las suscripciones
                        de la plataforma
                    </p>
                </div>

                {/* Filters/Actions Bar */}
                <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-xl lg:flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="text-[13px] text-[#1B3D6D] opacity-60 md:text-sm md:text-[#A0A0A0] md:opacity-100"
                            />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Buscar por número de órden o producto"
                            className="block w-full rounded-[4px] border border-[#DFE4EA] bg-white py-[10px] pr-3 pl-[34px] text-[13px] text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-all outline-none placeholder:text-[#1B3D6D]/60 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15 md:rounded-md md:border-[#E5E7EB] md:py-2.5 md:pl-10 md:text-sm md:text-gray-900 md:shadow-none md:placeholder:text-[#A0A0A0]"
                        />
                    </div>

                    <div
                        className="relative flex w-full flex-col items-center gap-3 md:flex-row lg:w-auto"
                        ref={dateMenuRef}
                    >
                        <div
                            onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-[#DFE4EA] bg-white px-4 py-[10px] text-[13px] text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-gray-50 md:w-auto md:justify-start md:rounded-md md:border-[#E5E7EB] md:py-2.5 md:text-sm md:text-[#4B5563]"
                        >
                            <span className="font-medium opacity-80 md:font-medium md:opacity-100">
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
                                className={`ml-1 text-[10px] text-[#1B3D6D] opacity-60 transition-transform md:text-xs md:text-[#A0A0A0] md:opacity-100 ${isDateMenuOpen ? 'rotate-180' : ''}`}
                            />
                        </div>

                        {/* Dropdown del calendario */}
                        {isDateMenuOpen && (
                            <div className="absolute top-full right-0 z-10 mt-2 w-full rounded-md border border-[#E5E7EB] bg-white p-4 shadow-lg md:w-72 lg:right-auto lg:left-0">
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-[#7B7B7B]">
                                            Desde:
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) =>
                                                setStartDate(e.target.value)
                                            }
                                            className="w-full rounded border border-[#E5E7EB] p-2 text-sm text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-[#7B7B7B]">
                                            Hasta:
                                        </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) =>
                                                setEndDate(e.target.value)
                                            }
                                            className="w-full rounded border border-[#E5E7EB] p-2 text-sm text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]"
                                        />
                                    </div>
                                    <div className="mt-2 flex justify-end gap-2">
                                        <button
                                            onClick={handleDateClear}
                                            className="rounded px-3 py-1.5 text-xs font-medium text-[#7B7B7B] transition-colors hover:bg-gray-100"
                                        >
                                            Limpiar
                                        </button>
                                        <button
                                            onClick={handleDateApply}
                                            className="rounded bg-[#1B3D6D] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1B3D6D]/90"
                                        >
                                            Aplicar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                window.location.href = suscripcionesExport.url({
                                    query: Object.fromEntries(
                                        new URLSearchParams(
                                            filters as Record<string, string>,
                                        ),
                                    ),
                                });
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#1B3D6D] bg-white px-5 py-[10px] text-[14px] font-bold text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#F8F9FA] md:w-auto md:justify-start md:rounded-md md:px-4 md:py-2.5 md:text-sm md:font-semibold md:shadow-sm"
                        >
                            <span>Exportar a excel</span>
                            <FontAwesomeIcon
                                icon={faFileExcel}
                                className="text-[12px] opacity-80 md:text-[14px] md:opacity-100"
                            />
                        </button>
                    </div>
                </div>

                {/* Main Content Container */}
                <div className="flex w-full flex-col overflow-hidden bg-transparent md:rounded-lg md:bg-white md:shadow-[0px_0px_15px_rgba(36,16,167,0.08)]">
                    {/* Desktop Table View */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[1000px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        <div className="flex items-center gap-2">
                                            Nº{' '}
                                            <FontAwesomeIcon
                                                icon={faChevronDown}
                                                className="text-[10px] opacity-50"
                                            />
                                        </div>
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Historia
                                    </th>
                                    <th className="px-5 py-4 text-center text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Cantidad
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Suscripción
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        F. adquisición
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        F. finalización
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Próximo cobro
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Nombre
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Dirección
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        <div className="flex items-center gap-2">
                                            Estado{' '}
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                className="text-[10px] opacity-50"
                                            />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {subList.length > 0 ? (
                                    subList.map((sub) => (
                                        <tr
                                            key={sub.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4 text-sm font-semibold text-[#1B3D6D]">
                                                #{sub.id}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {sub.historia?.nombre ?? '-'}
                                            </td>
                                            <td className="px-5 py-4 text-center text-sm text-[#4B5563]">
                                                {sub.cantidad}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {sub.tipo}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {formatDate(
                                                    sub.fecha_adquisicion,
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {formatDate(
                                                    sub.fecha_finalizacion,
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {formatDate(sub.proximo_cobro)}
                                            </td>
                                            <td className="px-5 py-4 text-sm font-medium text-[#111827]">
                                                {sub.user?.name ?? '-'}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#7B7B7B]">
                                                {sub.user?.direction ?? '-'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${subscriptionStatusBadgeClass(sub.estado_color)}`}
                                                >
                                                    {sub.estado_label}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={10}
                                            className="px-5 py-10 text-center text-sm text-[#7B7B7B]"
                                        >
                                            No se encontraron suscripciones que
                                            coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="mb-4 block flex flex-col rounded-[10px] bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.04)] md:hidden">
                        <div className="flex w-full flex-col divide-y divide-[#F3F4F6]">
                            {subList.length > 0 ? (
                                subList.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="flex flex-col gap-3 px-5 py-[18px]"
                                    >
                                        <div className="flex items-center justify-between bg-white">
                                            <span className="text-[13.5px] font-medium text-[#4B5563]">
                                                #{sub.id}
                                            </span>
                                            <span
                                                className={`inline-flex items-center rounded px-[10px] py-[3px] text-[11.5px] font-medium tracking-wide ${subscriptionStatusBadgeClass(sub.estado_color, true)}`}
                                            >
                                                {sub.estado_label}
                                            </span>
                                        </div>
                                        <div className="-mt-1 text-[13.5px] font-medium text-[#111827]">
                                            {sub.historia?.nombre ?? '-'}
                                        </div>
                                        <div className="mt-[-2px] flex items-center justify-between">
                                            <span className="text-[13px] text-[#4B5563]">
                                                Suscripción:{' '}
                                                <span className="text-[#111827]">
                                                    {sub.tipo}
                                                </span>
                                            </span>
                                            <span className="text-[13px] font-medium text-[#111827]">
                                                Cantidad: {sub.cantidad}
                                            </span>
                                        </div>

                                        <div className="mt-2 grid grid-cols-3 gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] text-[#A0A0A0]">
                                                    F. adquisición
                                                </span>
                                                <span className="mt-0.5 text-[12px] font-medium text-[#4B5563]">
                                                    {formatDate(
                                                        sub.fecha_adquisicion,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-center text-center">
                                                <span className="text-[11px] text-[#A0A0A0]">
                                                    F. finalización
                                                </span>
                                                <span className="mt-0.5 text-[12px] font-medium text-[#4B5563]">
                                                    {formatDate(
                                                        sub.fecha_finalizacion,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end text-right">
                                                <span className="text-[11px] text-[#A0A0A0]">
                                                    Próximo cobro
                                                </span>
                                                <span className="mt-0.5 text-[12px] font-medium text-[#4B5563]">
                                                    {formatDate(
                                                        sub.proximo_cobro,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] text-[#A0A0A0]">
                                                    Cliente
                                                </span>
                                                <span className="mt-0.5 text-[12px] font-medium text-[#4B5563]">
                                                    {sub.user?.name ?? '-'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end text-right">
                                                <span className="text-[11px] text-[#A0A0A0]">
                                                    Dirección
                                                </span>
                                                <span className="mt-0.5 w-full max-w-[150px] truncate text-[12px] leading-tight font-medium text-[#4B5563]">
                                                    {sub.user?.direction ?? '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-[13px] text-[#7B7B7B]">
                                    No se encontraron suscripciones que
                                    coincidan con la búsqueda.
                                </div>
                            )}
                        </div>
                    </div>

                    <ListPagination
                        currentPage={current_page}
                        lastPage={last_page}
                        from={from}
                        to={to}
                        total={total}
                        onPageChange={goToPage}
                        variant="admin"
                        className="mt-2 justify-center bg-transparent md:mt-0 md:justify-between md:bg-white md:py-4"
                    />
                </div>
            </div>
        </UserLayout>
    );
}
