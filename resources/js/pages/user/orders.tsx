import {
    faChevronDown,
    faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import UserLayout from '@/layouts/user-layout';

interface Order {
    id: string;
    fecha: string;
    producto: string;
    imagen: string;
    precio: string;
    cantidad: number;
    estado: string;
    estado_color: 'success' | 'danger';
}

interface OrdersProps {
    auth: {
        user: {
            name: string;
        };
    };
    ordenes: Order[];
}

export default function Orders({ auth, ordenes }: OrdersProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const itemsPerPage = 5;

    // Filter logic
    const filteredOrders = useMemo(() => {
        return ordenes.filter((order) => {
            const matchesSearch =
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.producto.toLowerCase().includes(searchTerm.toLowerCase());

            const orderDate = order.fecha;
            const matchesDate =
                (!startDate || orderDate >= startDate) &&
                (!endDate || orderDate <= endDate);

            return matchesSearch && matchesDate;
        });
    }, [ordenes, searchTerm, startDate, endDate]);

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredOrders, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    return (
        <UserLayout title="Mis Órdenes">
            <div className="flex w-full flex-col gap-5">
                {/* Welcome Message */}
                <div className="mb-2 flex flex-col gap-1.5 md:mb-0">
                    <h1 className="font-['Inter'] text-[24px] font-bold leading-tight text-[#1B3D6D] md:text-[20px]">¡Hola, {auth.user.name.split(' ')[0]} bienvenido! 👋</h1>
                    <p className="font-['Inter'] text-[15px] font-medium text-[#7B7B7B] md:text-[13px]">Estas son tus órdenes del día...</p>
                </div>

                {/* Card with table */}
                <div className="flex min-h-[480px] flex-col overflow-hidden rounded-[12px] bg-white p-4 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] border-t-[4px] border-[#F5F6F7] md:rounded-[4px] md:border-none md:px-5 md:py-4">
                    {/* Filters bar */}
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
                                placeholder="Buscar por órden o producto..."
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
                                                        setCurrentPage(1);
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
                                                        setCurrentPage(1);
                                                    }}
                                                    className="h-8 w-full rounded border border-[#DFE4EA] px-2 text-[11px] text-[#1B3D6D] outline-none focus:ring-1 focus:ring-[#1B3D6D]/15"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-[#F2F2F2] pt-3">
                                            <button
                                                onClick={() => {
                                                    setStartDate('');
                                                    setEndDate('');
                                                    setIsDateMenuOpen(false);
                                                    setCurrentPage(1);
                                                }}
                                                className="text-[11px] font-semibold text-[#E10E0E] hover:underline"
                                            >
                                                Limpiar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setIsDateMenuOpen(false)
                                                }
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

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
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
                                {paginatedOrders.length > 0 ? (
                                    paginatedOrders.map((order, idx) => (
                                        <tr
                                            key={idx}
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
                                                    className={`rounded-[4px] px-4 py-1.5 text-[13px] font-normal ${order.estado_color === 'success' ? 'bg-[#DAF8E6] text-[#1A8245]' : 'bg-[#FEEBEB] text-[#E10E0E]'}`}
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
                                            className="py-20 text-center font-['Inter'] text-[14px] text-[#7B7B7B]"
                                        >
                                            No se encontraron órdenes que
                                            coincidan con tu búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile List View */}
                    <div className="md:hidden flex flex-col gap-0">
                        {paginatedOrders.length > 0 ? (
                            paginatedOrders.map((order, idx) => (
                                <div
                                    key={idx}
                                    className={`py-5 flex gap-4 ${idx !== paginatedOrders.length - 1 ? 'border-b border-[#F2F2F2]' : ''}`}
                                >
                                    <div className="size-[84px] shrink-0 rounded-[6px] overflow-hidden bg-gray-100 shadow-sm">
                                        <img
                                            src={order.imagen}
                                            alt={order.producto}
                                            className="size-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-0.5">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-[13px] font-bold text-[#111928]">
                                                {order.id}
                                            </span>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-[4px] text-[10px] font-semibold ${order.estado_color === 'success' ? 'bg-[#DAF8E6] text-[#1A8245]' : 'bg-[#FEEBEB] text-[#E10E0E]'}`}
                                            >
                                                {order.estado}
                                            </span>
                                        </div>
                                        <p className="text-[12px] font-medium text-[#7B7B7B] mb-2">
                                            {order.producto}
                                        </p>
                                        <div className="flex justify-between items-center">
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
                            <div className="py-20 text-center font-['Inter'] text-[14px] text-[#7B7B7B]">
                                No se encontraron órdenes que coincidan con tu
                                búsqueda.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-auto flex flex-col items-center justify-between gap-4 bg-white pt-6 md:flex-row">
                        <p className="w-full text-center font-['Inter'] text-[14px] font-medium text-[#7B7B7B] md:w-auto md:text-left md:text-[13px] md:font-semibold">
                            Mostrando{' '}
                            {filteredOrders.length > 0
                                ? (currentPage - 1) * itemsPerPage + 1
                                : 0}{' '}
                            a{' '}
                            {Math.min(
                                currentPage * itemsPerPage,
                                filteredOrders.length,
                            )}{' '}
                            de {filteredOrders.length} registros
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                disabled={currentPage === 1}
                                className="flex size-8 items-center justify-center rounded text-[#637381] hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="size-3 rotate-90"
                                />
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`flex size-8 items-center justify-center rounded text-[13px] transition-colors ${currentPage === page ? 'bg-[#1B3D6D] text-white' : 'text-[#637381] hover:bg-gray-100'}`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages),
                                    )
                                }
                                disabled={
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
                                className="flex size-8 items-center justify-center rounded text-[#637381] hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="size-3 -rotate-90"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
