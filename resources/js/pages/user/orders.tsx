import {
    faChevronDown,
    faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import UserLayout from '@/layouts/user-layout';
import type {
    PedidoLineaCliente,
    PedidoLineaEstadoColor,
    PedidoLineasPaginadas,
} from '@/types/user-orders';

type OrdersPageFilters = {
    search: string | null;
    start_date: string | null;
    end_date: string | null;
};

type OrdersPageProps = {
    auth: {
        user: {
            name: string;
        };
    };
    ordenes: PedidoLineasPaginadas;
    filters: OrdersPageFilters;
};

function statusBadgeClass(color: PedidoLineaEstadoColor): string {
    if (color === 'success') {
        return 'bg-[#DAF8E6] text-[#1A8245]';
    }
    if (color === 'danger') {
        return 'bg-[#FEEBEB] text-[#E10E0E]';
    }

    return 'bg-[#FFF4E0] text-[#B35C00]';
}

export default function Orders({ auth, ordenes, filters }: OrdersPageProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search ?? '');
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
    const [startDate, setStartDate] = useState(filters.start_date ?? '');
    const [endDate, setEndDate] = useState(filters.end_date ?? '');

    const { data: rows, current_page, last_page, from, to, total } = ordenes;

    useEffect(() => {
        setSearchTerm(filters.search ?? '');
    }, [filters.search]);

    useEffect(() => {
        setStartDate(filters.start_date ?? '');
    }, [filters.start_date]);

    useEffect(() => {
        setEndDate(filters.end_date ?? '');
    }, [filters.end_date]);

    const buildQuery = (overrides: {
        search?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
    } = {}): Record<string, string> => {
        const s = (overrides.search !== undefined ? overrides.search : searchTerm).trim();
        const sd = overrides.startDate !== undefined ? overrides.startDate : startDate;
        const ed = overrides.endDate !== undefined ? overrides.endDate : endDate;
        const params: Record<string, string> = {};
        if (s !== '') {
            params.search = s;
        }
        if (sd) {
            params.start_date = sd;
        }
        if (ed) {
            params.end_date = ed;
        }
        const p = overrides.page;
        if (p !== undefined && p > 1) {
            params.page = String(p);
        }

        return params;
    };

    const applyToServer = (
        overrides: {
            search?: string;
            startDate?: string;
            endDate?: string;
            page?: number;
        } = {},
    ) => {
        router.get('/user/orders', buildQuery(overrides), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setSearchTerm(v);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyToServer({ page: 1 });
        }
    };

    const goToPage = (page: number) => {
        router.get('/user/orders', buildQuery({ page }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDateApply = () => {
        applyToServer({ page: 1 });
        setIsDateMenuOpen(false);
    };

    const handleDateClear = () => {
        setStartDate('');
        setEndDate('');
        setIsDateMenuOpen(false);
        router.get('/user/orders', buildQuery({ startDate: '', endDate: '' }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasFilter =
        (filters.search && filters.search.trim() !== '') ||
        filters.start_date ||
        filters.end_date;

    const emptyMessage = () => {
        if (total === 0 && !hasFilter) {
            return 'Aún no tienes compras registradas. Cuando completes un pago, aparecerá aquí.';
        }

        return 'No se encontraron órdenes que coincidan con tu búsqueda.';
    };

    const lineKey = (row: PedidoLineaCliente) => `${row.order_id}-${row.item_id}`;

    return (
        <UserLayout title="Mis Órdenes">
            <div className="flex w-full flex-col gap-5 font-['Inter',sans-serif]">
                <div className="mb-2 flex flex-col gap-1.5 md:mb-0">
                    <h1 className="font-['Playfair_Display',serif] text-[24px] font-bold leading-tight text-[#1B3D6D] md:text-[22px]">
                        ¡Hola, {auth.user.name.split(' ')[0]} bienvenido! 👋
                    </h1>
                    <p className="text-[15px] font-medium text-[#7B7B7B] md:text-[13px]">
                        Estas son tus compras (detalle por producto)…
                    </p>
                </div>

                <div className="flex min-h-[480px] flex-col overflow-hidden rounded-[12px] border-t-[4px] border-[#F5F6F7] bg-white p-4 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:rounded-[4px] md:border-none md:px-5 md:py-4">
                    <div className="mb-6 flex w-full flex-col items-center justify-between gap-3 md:flex-row">
                        <div className="relative w-full md:max-w-[280px]">
                            <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[#1B3D6D] opacity-50">
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className="size-3.5"
                                />
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Buscar por n.º de orden o producto…"
                                className="h-9 w-full rounded-md border border-[#DFE4EA] bg-white pr-4 pl-10 text-[12px] text-[#1B3D6D] transition-all outline-none placeholder:text-[#1B3D6D]/50 focus:ring-1 focus:ring-[#1B3D6D]/15"
                            />
                        </div>

                        <div className="flex w-full items-center gap-4 md:w-auto">
                            <div className="relative w-full md:w-[260px]">
                                <div
                                    onClick={() =>
                                        setIsDateMenuOpen(!isDateMenuOpen)
                                    }
                                    className={`flex h-9 cursor-pointer items-center justify-between border bg-white px-4 drop-shadow-sm transition-all hover:bg-gray-50 ${isDateMenuOpen ? 'rounded-t-[4px] border-[#1B3D6D] ring-1 ring-[#1B3D6D]/10' : 'rounded-[4px] border-[#DFE4EA]'}`}
                                >
                                    <span className="text-[12px] font-medium text-[#1B3D6D]">
                                        {startDate && endDate
                                            ? `${startDate.split('-').reverse().join('/')} - ${endDate.split('-').reverse().join('/')}`
                                            : startDate
                                              ? `Desde ${startDate.split('-').reverse().join('/')}`
                                              : endDate
                                                ? `Hasta ${endDate.split('-').reverse().join('/')}`
                                                : 'Filtrar por fecha'}
                                    </span>
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`size-2.5 text-[#1B3D6D] transition-transform duration-200 ${isDateMenuOpen ? 'rotate-180' : ''}`}
                                    />
                                </div>

                                {isDateMenuOpen && (
                                    <div className="absolute top-full right-0 z-[60] mt-0.5 flex w-[280px] animate-in flex-col gap-4 rounded-b-[4px] border border-t-0 border-[#1B3D6D] bg-white p-4 shadow-xl duration-200 fade-in slide-in-from-top-1">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold tracking-wider text-[#7B7B7B] uppercase">
                                                    Inicio
                                                </label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => {
                                                        setStartDate(
                                                            e.target.value,
                                                        );
                                                    }}
                                                    className="h-8 w-full rounded border border-[#DFE4EA] px-2 text-[11px] text-[#1B3D6D] outline-none focus:ring-1 focus:ring-[#1B3D6D]/15"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold tracking-wider text-[#7B7B7B] uppercase">
                                                    Fin
                                                </label>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => {
                                                        setEndDate(
                                                            e.target.value,
                                                        );
                                                    }}
                                                    className="h-8 w-full rounded border border-[#DFE4EA] px-2 text-[11px] text-[#1B3D6D] outline-none focus:ring-1 focus:ring-[#1B3D6D]/15"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-[#F2F2F2] pt-3">
                                            <button
                                                type="button"
                                                onClick={handleDateClear}
                                                className="text-[11px] font-semibold text-[#E10E0E] hover:underline"
                                            >
                                                Limpiar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDateApply}
                                                className="rounded bg-[#1B3D6D] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:opacity-90"
                                            >
                                                Aplicar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <p className="mb-2 text-[11px] text-[#9CA3AF]">
                        <span className="font-semibold text-[#7B7B7B]">
                            Precio
                        </span>
                        : total de la línea (incl. cantidad).
                    </p>

                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#F5F6F7]">
                                    <th className="rounded-tl-[4px] border-b border-[#F2F2F2] px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Nro. de órden
                                    </th>
                                    <th className="border-b border-[#F2F2F2] px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Fecha
                                    </th>
                                    <th className="border-b border-[#F2F2F2] px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Producto
                                    </th>
                                    <th className="border-b border-[#F2F2F2] px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Precio
                                    </th>
                                    <th className="border-b border-[#F2F2F2] px-4 py-4 text-center text-[11px] font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Cantidad
                                    </th>
                                    <th className="rounded-tr-[4px] border-b border-[#F2F2F2] px-4 py-4 text-center text-[11px] font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length > 0 ? (
                                    rows.map((order) => (
                                        <tr
                                            key={lineKey(order)}
                                            className="transition duration-150 hover:bg-gray-50/40"
                                        >
                                            <td className="border-b border-[#F2F2F2] px-4 py-4 text-[12px] font-medium text-[#111928]">
                                                {order.id}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-4 py-4 text-[12px] whitespace-nowrap text-[#7B7B7B]">
                                                {order.fecha
                                                    .split('-')
                                                    .reverse()
                                                    .join('/')}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-4 py-1.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex size-[42px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-gray-100">
                                                        <img
                                                            src={order.imagen}
                                                            alt={order.producto}
                                                            className="size-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-[12px] font-medium text-[#111928]">
                                                        {order.producto}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-4 py-4 text-[12px] text-[#111928]">
                                                {order.precio}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-4 py-4 text-center text-[12px] text-[#111928]">
                                                {order.cantidad}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-4 py-4 text-center">
                                                <span
                                                    className={`rounded-[4px] px-4 py-1.5 text-[13px] font-normal ${statusBadgeClass(order.estado_color)}`}
                                                >
                                                    {order.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-20 text-center text-[14px] text-[#7B7B7B]"
                                        >
                                            {emptyMessage()}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-0 md:hidden">
                        {rows.length > 0 ? (
                            rows.map((order, idx) => (
                                <div
                                    key={lineKey(order)}
                                    className={`flex gap-4 py-5 ${idx !== rows.length - 1 ? 'border-b border-[#F2F2F2]' : ''}`}
                                >
                                    <div className="size-[84px] shrink-0 overflow-hidden rounded-[6px] bg-gray-100 shadow-sm">
                                        <img
                                            src={order.imagen}
                                            alt={order.producto}
                                            className="size-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between py-0.5">
                                        <div className="mb-1 flex items-baseline justify-between">
                                            <span className="text-[13px] font-bold text-[#111928]">
                                                {order.id}
                                            </span>
                                            <span
                                                className={`rounded-[4px] px-2.5 py-0.5 text-[10px] font-semibold ${statusBadgeClass(order.estado_color)}`}
                                            >
                                                {order.estado}
                                            </span>
                                        </div>
                                        <p className="mb-2 text-[12px] font-medium text-[#7B7B7B]">
                                            {order.producto}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[14px] font-bold text-[#1B3D6D]">
                                                {order.precio}
                                            </span>
                                            <span className="text-[11px] text-[#7B7B7B]">
                                                Cantidad: {order.cantidad}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center text-[14px] text-[#7B7B7B]">
                                {emptyMessage()}
                            </div>
                        )}
                    </div>

                    {last_page > 0 && total > 0 ? (
                        <div className="mt-auto flex flex-col items-center justify-between gap-4 bg-white pt-6 md:flex-row">
                            <p className="w-full text-center text-[14px] font-medium text-[#7B7B7B] md:w-auto md:text-left md:text-[13px] md:font-semibold">
                                {from != null && to != null
                                    ? `Mostrando ${from} a ${to} de ${total} registros`
                                    : 'Sin registros'}
                            </p>
                            {last_page > 1 ? (
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            goToPage(
                                                Math.max(1, current_page - 1),
                                            )
                                        }
                                        disabled={current_page === 1}
                                        className="flex size-8 items-center justify-center rounded text-[#637381] hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                                    >
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className="size-3 rotate-90"
                                        />
                                    </button>

                                    {Array.from(
                                        { length: last_page },
                                        (_, i) => i + 1,
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => goToPage(page)}
                                            className={`flex size-8 items-center justify-center rounded text-[13px] transition-colors ${current_page === page ? 'bg-[#1B3D6D] text-white' : 'text-[#637381] hover:bg-gray-100'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            goToPage(
                                                Math.min(
                                                    last_page,
                                                    current_page + 1,
                                                ),
                                            )
                                        }
                                        disabled={
                                            current_page === last_page ||
                                            last_page === 0
                                        }
                                        className="flex size-8 items-center justify-center rounded text-[#637381] hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                                    >
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className="size-3 -rotate-90"
                                        />
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </UserLayout>
    );
}
