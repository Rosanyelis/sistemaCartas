import React, { useState, useCallback } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faFileExcel,
    faChevronDown,
    faFilter,
} from '@fortawesome/free-solid-svg-icons';
import ListPagination from '@/components/panel/ListPagination';
import type { PaginatedData } from '@/types/pagination';
import { clientes as adminClientesIndex } from '@/routes/admin';
import { exportMethod as clientesExport } from '@/routes/admin/clientes';

interface Client {
    id: number;
    name: string;
    email: string;
    direction: string | null;
    phone: string | null;
    suscripciones_exists: boolean;
}

interface Props {
    clientes: PaginatedData<Client>;
    filters: {
        search?: string;
    };
}

export default function Clients({ clientes, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const applyFilters = useCallback(
        (params: Record<string, string>) => {
            router.get(
                adminClientesIndex.url({
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

    const goToPage = (page: number) => {
        router.get(
            adminClientesIndex.url({
                query: { ...filters, page: String(page) },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const {
        data: clientList,
        current_page,
        last_page,
        from,
        to,
        total,
    } = clientes;

    return (
        <UserLayout title="Clientes">
            <Head title="Gestión de Clientes" />

            <div className="flex flex-col gap-6 px-4 py-6 font-['Inter'] md:px-8">
                {/* Header Section */}
                <div className="mb-2 flex flex-col items-center gap-1 text-center md:mb-0 md:items-start md:text-left">
                    <h1 className="text-[25px] font-bold text-[#1B3D6D] md:text-2xl">
                        Clientes
                    </h1>
                    <p className="text-[13.5px] text-[#1B3D6D] md:text-sm md:text-[#7B7B7B]">
                        Aquí puedes revisar y gestionar la información de los
                        clientes registrados
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
                            placeholder="Filtrar por nombre de cliente o correo"
                            className="block w-full rounded-[4px] border border-[#DFE4EA] bg-white py-[10px] pr-3 pl-[34px] text-[13px] text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-all outline-none placeholder:text-[#1B3D6D]/60 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15 md:rounded-md md:border-[#E5E7EB] md:py-2.5 md:pl-10 md:text-sm md:text-gray-900 md:shadow-none md:placeholder:text-[#A0A0A0]"
                        />
                    </div>

                    <div className="relative flex w-full flex-col items-center gap-3 md:flex-row lg:w-auto">
                        <button
                            onClick={() => {
                                window.location.href = clientesExport.url({
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
                                        Nombre
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Correo
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Dirección
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Teléfono
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        <div className="flex items-center gap-2">
                                            ¿Tiene suscripción?{' '}
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                className="text-[10px] opacity-50"
                                            />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {clientList.length > 0 ? (
                                    clientList.map((client) => (
                                        <tr
                                            key={client.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4 text-sm font-semibold text-[#1B3D6D]">
                                                #{client.id}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {client.name}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {client.email}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {client.direction || '-'}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {client.phone || '-'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded px-[10px] py-[3px] text-[11.5px] font-medium tracking-wide ${client.suscripciones_exists ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#FEE2E2] text-[#EF4444]'}`}
                                                >
                                                    {client.suscripciones_exists
                                                        ? 'Sí'
                                                        : 'No'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-10 text-center text-sm text-[#7B7B7B]"
                                        >
                                            No se encontraron clientes que
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
                            {clientList.length > 0 ? (
                                clientList.map((client) => (
                                    <div
                                        key={client.id}
                                        className="flex flex-col gap-1.5 px-5 py-4"
                                    >
                                        <div className="mb-0.5 flex items-center justify-between bg-white">
                                            <span className="text-[13px] text-[#4B5563]">
                                                #{client.id}
                                            </span>
                                            <span
                                                className={`inline-flex min-w-[34px] items-center justify-center rounded px-[10px] py-[3px] text-[11.5px] font-medium tracking-wide ${client.suscripciones_exists ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#FEE2E2] text-[#EF4444]'}`}
                                            >
                                                {client.suscripciones_exists
                                                    ? 'Sí'
                                                    : 'No'}
                                            </span>
                                        </div>

                                        <div className="flex w-full items-center justify-between">
                                            <span className="text-[13px] text-[#4B5563]">
                                                {client.name}
                                            </span>
                                            <span className="truncate pl-2 text-right text-[13px] text-[#4B5563]">
                                                {client.email}
                                            </span>
                                        </div>

                                        <div className="flex w-full items-center justify-between">
                                            <span className="truncate pr-2 text-[13px] text-[#4B5563]">
                                                {client.direction || '-'}
                                            </span>
                                            <span className="text-[13px] whitespace-nowrap text-[#4B5563]">
                                                {client.phone || '-'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-[13px] text-[#7B7B7B]">
                                    No se encontraron clientes que coincidan con
                                    la búsqueda.
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
