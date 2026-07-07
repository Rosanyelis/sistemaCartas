import {
    faChevronDown,
    faMagnifyingGlass,
    faSort,
    faFilter,
    faFileExcel,
} from '@fortawesome/free-solid-svg-icons';
import ListPagination from '@/components/panel/ListPagination';
import type { PaginatedData } from '@/types/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router } from '@inertiajs/react';
import { useState, useCallback, useEffect, useRef } from 'react';
import UserLayout from '@/layouts/user-layout';
import { ordenes as adminOrdenesIndex } from '@/routes/admin';
import { exportMethod as ordenesExport } from '@/routes/admin/ordenes';

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

interface PaginatedOrdenes<T> extends PaginatedData<T> {
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface AdminOrdersProps {
    auth: {
        user: {
            name: string;
        };
    };
    ordenes: PaginatedOrdenes<StoreOrder>;
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

type OrderStatusTone = 'success' | 'danger' | 'warning';

function statusLabel(status: string): { label: string; tone: OrderStatusTone } {
    const key = status.toLowerCase();
    const map: Record<string, { label: string; tone: OrderStatusTone }> = {
        paid: { label: 'Completado', tone: 'success' },
        completed: { label: 'Completado', tone: 'success' },
        pending_payment: { label: 'Pendiente de pago', tone: 'warning' },
        pending: { label: 'Pendiente de pago', tone: 'warning' },
        capture_failed: { label: 'Rechazado', tone: 'danger' },
        failed: { label: 'Rechazado', tone: 'danger' },
        cancelled: { label: 'Rechazado', tone: 'danger' },
        canceled: { label: 'Rechazado', tone: 'danger' },
    };

    return map[key] ?? { label: status || 'Sin estado', tone: 'warning' };
}

function orderStatusBadgeClass(tone: OrderStatusTone, compact = false): string {
    if (tone === 'success') {
        return compact
            ? 'bg-[#DAF8E6] text-[#1A8245]'
            : 'bg-[#DAF8E6] text-[#1A8245]';
    }

    if (tone === 'danger') {
        return compact
            ? 'bg-[#FEEBEB] text-[#E10E0E]'
            : 'bg-[#FEEBEB] text-[#E10E0E]';
    }

    return compact
        ? 'bg-[#FEF3C7] text-[#D97706]'
        : 'bg-[#FEF3C7] text-[#D97706]';
}

function formatDateLabel(date: string): string {
    return date.split('-').reverse().join('/');
}

function orderTotalQuantity(order: StoreOrder): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

type AdminOrderMobileCardProps = {
    order: StoreOrder;
};

function AdminOrderMobileCard({ order }: AdminOrderMobileCardProps) {
    const st = statusLabel(order.status);
    const firstItem = order.items[0];
    const quantity = orderTotalQuantity(order);

    return (
        <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <span className="text-[13px] font-normal text-[#111928]">
                        #{order.id}
                    </span>
                    <span
                        className={`inline-flex items-center rounded px-[10px] py-[3px] text-[11.5px] font-medium ${orderStatusBadgeClass(st.tone, true)}`}
                    >
                        {st.label}
                    </span>
                </div>
                <p className="text-[13px] font-normal text-[#111928]">
                    {firstItem?.product_name ?? '-'}
                </p>
                <div className="flex items-center justify-between text-[13px] font-normal text-[#111928]">
                    <span>Precio: ${Number(order.total).toFixed(2)}</span>
                    <span>Cantidad: {quantity}</span>
                </div>
            </div>

            <div className="flex items-start justify-between gap-3 text-[13px]">
                <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-[#7B7B7B]">Cliente</span>
                    <span className="font-normal text-[#111928]">
                        {order.user?.name ?? '-'}
                    </span>
                </div>
                <div className="flex min-w-0 flex-col items-end gap-1 text-right">
                    <span className="text-[#7B7B7B]">Dirección</span>
                    <span className="max-w-[150px] truncate font-normal text-[#111928]">
                        {order.user?.direction ?? '-'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function AdminOrders({ ordenes, filters }: AdminOrdersProps) {
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
                adminOrdenesIndex.url({
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
        setIsDateMenuOpen(false);
    };

    const goToPage = (page: number) => {
        router.get(
            adminOrdenesIndex.url({
                query: { ...filters, page: String(page) },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const { data: orders, current_page, last_page, from, to, total } = ordenes;

    const dateFilterLabel =
        startDate && endDate
            ? `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}`
            : startDate
              ? `Desde ${formatDateLabel(startDate)}`
              : endDate
                ? `Hasta ${formatDateLabel(endDate)}`
                : 'Seleccionar fechas';

    return (
        <UserLayout title="Órdenes">
            <div className="flex w-full flex-col gap-6 px-4 py-4 font-['Inter'] md:px-8 md:py-6">
                {/* Header Section */}
                <div className="mb-2 flex flex-col items-center gap-0.5 text-center md:mb-0 md:items-start md:text-left">
                    <h1 className="text-[25px] font-bold text-[#1B3D6D] md:text-2xl">
                        Órdenes
                    </h1>
                    <span className="text-[16px] leading-[22px] font-normal text-[#1B3D6D] md:text-[13px] md:font-medium md:opacity-80">
                        Aquí puedes revisar y gestionar todas las órdenes
                        creadas en la plataforma
                    </span>
                </div>

                {/* Filters and Search */}
                <div className="flex w-full flex-col justify-between gap-3 lg:flex-row lg:items-center">
                    <div className="relative w-full lg:max-w-xl lg:flex-1">
                        <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[#1B3D6D] opacity-60">
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
                            className="h-10 w-full rounded-[4px] border border-[#DFE4EA] bg-white pr-4 pl-10 text-[13px] text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-all outline-none placeholder:text-[#1B3D6D]/40 focus:ring-1 focus:ring-[#1B3D6D]/15 md:rounded-md md:shadow-none"
                        />
                    </div>

                    <div
                        className="relative flex w-full flex-col items-center gap-3 lg:w-auto lg:flex-row"
                        ref={dateMenuRef}
                    >
                        <div
                            onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-[#DFE4EA] bg-white px-4 text-[13px] font-medium text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-all hover:bg-gray-50 md:w-auto md:justify-between md:rounded-md md:shadow-sm"
                        >
                            <span className="opacity-80">
                                {dateFilterLabel}
                            </span>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className={`size-3 opacity-60 transition-transform duration-200 ${isDateMenuOpen ? 'rotate-180' : ''}`}
                            />
                        </div>

                        {isDateMenuOpen && (
                            <div className="absolute top-full right-0 z-10 mt-2 w-full rounded-md border border-[#E5E7EB] bg-white p-4 shadow-lg md:w-72">
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
                                            type="button"
                                            onClick={handleDateClear}
                                            className="rounded px-3 py-1.5 text-xs font-medium text-[#7B7B7B] transition-colors hover:bg-gray-100"
                                        >
                                            Limpiar
                                        </button>
                                        <button
                                            type="button"
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
                            type="button"
                            onClick={() => {
                                window.location.href = ordenesExport.url({
                                    query: Object.fromEntries(
                                        new URLSearchParams(
                                            filters as Record<string, string>,
                                        ),
                                    ),
                                });
                            }}
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-[4px] border border-[#1B3D6D] bg-white px-5 text-[16px] font-semibold text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition hover:bg-[#F8F9FA] md:w-auto md:rounded-md md:text-[14px] md:shadow-sm"
                        >
                            Exportar a excel
                            <FontAwesomeIcon
                                icon={faFileExcel}
                                className="size-[14px] opacity-70"
                            />
                        </button>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex w-full min-w-0 flex-col overflow-hidden bg-transparent md:rounded-lg md:bg-white md:shadow-[0px_0px_15px_rgba(36,16,167,0.08)]">
                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[900px] border-collapse">
                            <thead>
                                <tr className="border-b border-[#F2F2F2] bg-[#FAFAFA]">
                                    <th className="px-6 py-5 text-left text-[12px] font-bold whitespace-nowrap text-[#111928]">
                                        <div className="flex items-center gap-2">
                                            Nº
                                            <FontAwesomeIcon
                                                icon={faSort}
                                                className="size-3 text-[#A0A0A0]"
                                            />
                                        </div>
                                    </th>
                                    <th className="px-6 py-5 text-left text-[12px] font-bold whitespace-nowrap text-[#111928]">
                                        Productos
                                    </th>
                                    <th className="px-6 py-5 text-left text-[12px] font-bold whitespace-nowrap text-[#111928]">
                                        Cantidad
                                    </th>
                                    <th className="px-6 py-5 text-left text-[12px] font-bold whitespace-nowrap text-[#111928]">
                                        <div className="flex items-center gap-2">
                                            Precio
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                className="size-3 text-[#A0A0A0]"
                                            />
                                        </div>
                                    </th>
                                    <th className="px-6 py-5 text-left text-[12px] font-bold whitespace-nowrap text-[#111928]">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-5 text-left text-[12px] font-bold whitespace-nowrap text-[#111928]">
                                        Dirección
                                    </th>
                                    <th className="px-6 py-5 text-left text-[12px] font-bold whitespace-nowrap text-[#111928]">
                                        <div className="flex items-center gap-2">
                                            Estado
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                className="size-3 text-[#A0A0A0]"
                                            />
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
                                                    {firstItem?.product_name ??
                                                        '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                                    {orderTotalQuantity(order)
                                                        .toString()
                                                        .padStart(2, '0')}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                                    $
                                                    {Number(
                                                        order.total,
                                                    ).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                                    {order.user?.name ?? '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                                    {order.user?.direction ??
                                                        '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`rounded-[4px] px-3 py-1 text-[11px] font-semibold ${orderStatusBadgeClass(st.tone)}`}
                                                    >
                                                        {st.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-10 text-center text-sm text-[#7B7B7B]"
                                        >
                                            No se encontraron órdenes que
                                            coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards — Figma 15913:13552 */}
                    <div className="mb-4 block w-full overflow-hidden rounded-[4px] bg-white shadow-[0px_0px_10px_rgba(36,16,167,0.15)] md:hidden">
                        <div className="flex w-full flex-col divide-y divide-[#F2F2F2]">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <AdminOrderMobileCard
                                        key={order.id}
                                        order={order}
                                    />
                                ))
                            ) : (
                                <p className="px-5 py-10 text-center text-[13px] text-[#7B7B7B]">
                                    No se encontraron órdenes que coincidan con
                                    la búsqueda.
                                </p>
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
                        className="mt-2 justify-center border-transparent bg-transparent px-4 py-4 md:mt-0 md:justify-between md:border-[#F2F2F2] md:bg-white md:px-6"
                    />
                </div>
            </div>
        </UserLayout>
    );
}
