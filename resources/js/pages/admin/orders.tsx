import {
    faChevronDown,
    faMagnifyingGlass,
    faSort,
    faFilter,
    faFileExcel,
    faChevronRight,
    faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import UserLayout from '@/layouts/user-layout';

interface StoreOrderItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: string;
    line_total: string;
}

interface StoreOrderUser {
    id: number;
    name: string;
    email: string;
    direction: string | null;
}

interface StoreOrder {
    id: number;
    user: StoreOrderUser | null;
    items: StoreOrderItem[];
    status: string;
    total: string;
    created_at: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface AdminOrdersProps {
    auth: {
        user: {
            name: string;
        };
    };
    ordenes: PaginatedData<StoreOrder>;
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function AdminOrders({ ordenes, filters }: AdminOrdersProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const applyFilters = useCallback(
        (params: Record<string, string>) => {
            router.get(
                '/admin/ordenes',
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

    const goToPage = (page: number) => {
        router.get(
            '/admin/ordenes',
            { ...filters, page: String(page) },
            { preserveState: true, preserveScroll: true },
        );
    };

    const statusLabel = (status: string) => {
        const map: Record<string, { label: string; color: 'success' | 'danger' | 'warning' }> = {
            completed: { label: 'Completado', color: 'success' },
            failed: { label: 'Rechazado', color: 'danger' },
            pending: { label: 'Pendiente', color: 'warning' },
        };
        return map[status] || { label: status, color: 'warning' };
    };

    const { data: orders, current_page, last_page, from, to, total } = ordenes;

    return (
        <UserLayout title="Órdenes">
            <div className="flex w-full flex-col gap-6 px-4 py-4 font-['Inter'] md:px-8">
                {/* Header Section */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold text-[#1B3D6D] md:text-2xl">
                        Órdenes
                    </h1>
                    <span className="text-[13px] font-medium text-[#1B3D6D] opacity-80">
                        Aquí puedes revisar y gestionar todas las órdenes creadas en la plataforma
                    </span>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="relative w-full md:w-[400px]">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1B3D6D] opacity-60">
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className="size-3.5"
                            />
                        </span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Busca por numero de orden, nombre o correo..."
                            className="h-10 w-full rounded-md border border-[#DFE4EA] bg-white pl-10 pr-4 text-[13px] text-[#1B3D6D] transition-all outline-none placeholder:text-[#1B3D6D]/40 focus:ring-1 focus:ring-[#1B3D6D]/15"
                        />
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:items-center">
                        {/* Date Filter */}
                        <div className="relative w-full md:w-[260px]">
                            <div
                                onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                                className={`flex h-10 cursor-pointer items-center justify-between border bg-white px-4 transition-all hover:bg-gray-50 focus:outline-none ${isDateMenuOpen ? 'rounded-t-md border-[#DFE4EA]' : 'rounded-md border-[#DFE4EA]'}`}
                            >
                                <span className="text-[13px] font-medium text-[#1B3D6D] opacity-80">
                                    {startDate && endDate ? `${startDate} - ${endDate}` : 'Seleccionar fechas'}
                                </span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`size-3 text-[#1B3D6D] opacity-60 transition-transform duration-200 ${isDateMenuOpen ? 'rotate-180' : ''}`}
                                />
                            </div>
                            {isDateMenuOpen && (
                                <div className="absolute left-0 right-0 z-10 rounded-b-md border border-t-0 border-[#DFE4EA] bg-white p-3 shadow-md">
                                    <div className="flex flex-col gap-2">
                                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded border border-[#E5E7EB] px-2 py-1 text-xs" />
                                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded border border-[#E5E7EB] px-2 py-1 text-xs" />
                                        <button onClick={handleDateApply} className="rounded bg-[#1B3D6D] px-3 py-1 text-xs text-white">Aplicar</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => {
                                const params = new URLSearchParams(filters as any).toString();
                                window.location.href = `/admin/ordenes/export?${params}`;
                            }}
                            className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#DFE4EA] bg-white px-5 text-[14px] font-semibold text-[#1B3D6D] transition hover:bg-gray-50 md:w-auto shadow-sm"
                        >
                            Exportar a excel
                            <FontAwesomeIcon icon={faFileExcel} className="size-[14px] opacity-70" />
                        </button>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="flex flex-col w-full min-w-0 bg-white shadow-[0px_0px_15px_rgba(36,16,167,0.08)] rounded-md">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-[#F2F2F2]">
                                    <th className="whitespace-nowrap px-6 py-5 text-left text-[12px] font-bold text-[#111928]">
                                        <div className="flex items-center gap-2">
                                            Nº
                                            <FontAwesomeIcon icon={faSort} className="text-[#A0A0A0] size-3" />
                                        </div>
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-5 text-left text-[12px] font-bold text-[#111928]">
                                        Productos
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-5 text-left text-[12px] font-bold text-[#111928]">
                                        Cantidad
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-5 text-left text-[12px] font-bold text-[#111928]">
                                        <div className="flex items-center gap-2">
                                            Precio
                                            <FontAwesomeIcon icon={faFilter} className="text-[#A0A0A0] size-3" />
                                        </div>
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-5 text-left text-[12px] font-bold text-[#111928]">
                                        Cliente
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-5 text-left text-[12px] font-bold text-[#111928]">
                                        Dirección
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-5 text-left text-[12px] font-bold text-[#111928]">
                                        <div className="flex items-center gap-2">
                                            Estado
                                            <FontAwesomeIcon icon={faFilter} className="text-[#A0A0A0] size-3" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order, idx) => {
                                        const st = statusLabel(order.status);
                                        const firstItem = order.items[0];
                                        return (
                                            <tr
                                                key={order.id}
                                                className={`transition duration-150 hover:bg-gray-50/40 ${idx !== orders.length - 1 ? 'border-b border-[#F2F2F2]/60' : ''}`}
                                            >
                                                <td className="px-6 py-4 text-[13px] font-medium text-[#7B7B7B]">
                                                    #{order.id}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                                    {firstItem?.product_name ?? '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                                    {order.items.reduce((sum, i) => sum + i.quantity, 0).toString().padStart(2, '0')}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                                    ${Number(order.total).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                                    {order.user?.name ?? '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                                    {order.user?.direction ?? '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`rounded-[4px] px-3 py-1 text-[11px] font-semibold ${st.color === 'success' ? 'bg-[#DAF8E6] text-[#1A8245]' : st.color === 'danger' ? 'bg-[#FEEBEB] text-[#E10E0E]' : 'bg-[#FEF3C7] text-[#D97706]'}`}
                                                    >
                                                        {st.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-sm text-[#7B7B7B]">
                                            No se encontraron órdenes que coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between border-t border-[#F2F2F2] px-6 py-4 sm:flex-row">
                        <span className="mb-4 text-[13px] font-medium text-[#7B7B7B] sm:mb-0">
                            {from && to ? `Mostrando ${from} a ${to} de ${total} registros` : 'Sin registros'}
                        </span>
                        
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(current_page - 1)}
                                disabled={current_page === 1}
                                className={`flex h-7 w-7 items-center justify-center ${current_page === 1 ? 'text-[#D1D5DB] cursor-not-allowed' : 'text-[#A0A0A0] hover:text-[#1B3D6D]'}`}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} className="size-3" />
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
                                            className={`flex h-7 w-7 items-center justify-center rounded-[2px] text-[13px] ${
                                                current_page === page
                                                    ? 'bg-[#1B3D6D] font-semibold text-white shadow-sm'
                                                    : 'text-[#7B7B7B] hover:bg-[#F2F2F2]'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (page === current_page - 2 || page === current_page + 2) {
                                    return <span key={page} className="flex h-7 w-7 items-end justify-center text-[13px] text-[#7B7B7B] pb-1">...</span>;
                                }
                                return null;
                            })}

                            <button
                                onClick={() => goToPage(current_page + 1)}
                                disabled={current_page === last_page}
                                className={`flex h-7 w-7 items-center justify-center rounded-[2px] ml-1 ${current_page === last_page ? 'text-[#D1D5DB] cursor-not-allowed' : 'bg-[#F2F2F2] text-[#7B7B7B] hover:bg-[#E5E5E5]'}`}
                            >
                                <FontAwesomeIcon icon={faChevronRight} className="size-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
