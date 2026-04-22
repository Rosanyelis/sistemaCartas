import React, { useState, useCallback } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faFileExcel,
    faChevronDown,
    faFilter,
    faChevronLeft,
    faChevronRight,
    faEllipsisV,
    faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface Client {
    id: number;
    name: string;
    email: string;
    direction: string | null;
    phone: string | null;
    suscripciones_exists: boolean;
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
    clientes: PaginatedData<Client>;
    filters: {
        search?: string;
    };
}

export default function Clients({ clientes, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [deleteClientId, setDeleteClientId] = useState<number | null>(null);

    const applyFilters = useCallback(
        (params: Record<string, string>) => {
            router.get(
                '/admin/clientes',
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

    const goToPage = (page: number) => {
        router.get(
            '/admin/clientes',
            { ...filters, page: String(page) },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteConfirm = () => {
        if (deleteClientId !== null) {
            router.delete(`/admin/clientes/${deleteClientId}`, {
                preserveScroll: true,
                onSuccess: () => setDeleteClientId(null)
            });
        }
    };

    const { data: clientList, current_page, last_page, from, to, total } = clientes;

    return (
        <UserLayout title="Clientes">
            <Head title="Gestión de Clientes" />

            <div className="flex flex-col gap-6 px-4 md:px-8 py-6 font-['Inter']">
                {/* Header Section */}
                <div className="flex flex-col gap-1 items-center text-center md:items-start md:text-left mb-2 md:mb-0">
                    <h1 className="text-[25px] md:text-2xl font-bold text-[#1B3D6D]">
                        Clientes
                    </h1>
                    <p className="text-[13.5px] md:text-sm text-[#1B3D6D] md:text-[#7B7B7B]">
                        Aquí puedes revisar y gestionar la información de los clientes registrados
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
                            placeholder="Filtrar por nombre de cliente o correo"
                            className="block w-full rounded-[4px] md:rounded-md border border-[#DFE4EA] md:border-[#E5E7EB] bg-white py-[10px] md:py-2.5 pl-[34px] md:pl-10 pr-3 text-[13px] md:text-sm text-[#1B3D6D] md:text-gray-900 placeholder:text-[#1B3D6D]/60 md:placeholder:text-[#A0A0A0] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15 outline-none transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.05)] md:shadow-none bg-white"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-3 relative w-full lg:w-auto">
                        <button 
                            onClick={() => {
                                const params = new URLSearchParams(filters as any).toString();
                                window.location.href = `/admin/clientes/export?${params}`;
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
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Nombre</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Correo</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Dirección</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Teléfono</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            ¿Tiene suscripción? <FontAwesomeIcon icon={faFilter} className="text-[10px] opacity-50" />
                                        </div>
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {clientList.length > 0 ? (
                                    clientList.map((client) => (
                                        <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4 text-sm font-semibold text-[#1B3D6D]">#{client.id}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{client.name}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{client.email}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{client.direction || '-'}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{client.phone || '-'}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-[10px] py-[3px] rounded text-[11.5px] font-medium tracking-wide
                                                    ${client.suscripciones_exists ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#FEE2E2] text-[#EF4444]'}`}>
                                                    {client.suscripciones_exists ? 'Sí' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center relative">
                                                <div className="relative inline-block text-left">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuId(openMenuId === client.id ? null : client.id);
                                                        }}
                                                        className="p-2 text-[#7B7B7B] hover:text-[#1B3D6D] transition-colors rounded-full hover:bg-gray-100 outline-none"
                                                    >
                                                        <FontAwesomeIcon icon={faEllipsisV} className="text-sm" />
                                                    </button>
                                                    {openMenuId === client.id && (
                                                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#E5E7EB] rounded-md shadow-lg z-20 py-1 text-left">
                                                            <button 
                                                                onClick={() => setDeleteClientId(client.id)}
                                                                className="w-full text-left px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                                                            >
                                                                <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-10 text-center text-sm text-[#7B7B7B]">
                                            No se encontraron clientes que coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="flex flex-col bg-white rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.04)] block md:hidden mb-4">
                        <div className="flex flex-col divide-y divide-[#F3F4F6] w-full">
                            {clientList.length > 0 ? (
                                clientList.map((client) => (
                                    <div key={client.id} className="flex flex-col py-4 px-5 gap-1.5">
                                        <div className="flex justify-between items-center bg-white mb-0.5">
                                            <span className="text-[13px] text-[#4B5563]">#{client.id}</span>
                                            <span className={`inline-flex items-center justify-center px-[10px] py-[3px] rounded text-[11.5px] font-medium tracking-wide min-w-[34px]
                                                ${client.suscripciones_exists ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#FEE2E2] text-[#EF4444]'}`}>
                                                {client.suscripciones_exists ? 'Sí' : 'No'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center w-full">
                                            <span className="text-[13px] text-[#4B5563]">{client.name}</span>
                                            <span className="text-[13px] text-[#4B5563] text-right truncate pl-2">{client.email}</span>
                                        </div>

                                        <div className="flex justify-between items-center w-full">
                                            <span className="text-[13px] text-[#4B5563] truncate pr-2">{client.direction || '-'}</span>
                                            <span className="text-[13px] text-[#4B5563] whitespace-nowrap">{client.phone || '-'}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-[13px] text-[#7B7B7B]">
                                    No se encontraron clientes que coincidan con la búsqueda.
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

            <ConfirmDialog 
                isOpen={deleteClientId !== null}
                onOpenChange={(open) => !open && setDeleteClientId(null)}
                title="Eliminar Cliente"
                description="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
                onConfirm={handleDeleteConfirm}
            />
        </UserLayout>
    );
}
