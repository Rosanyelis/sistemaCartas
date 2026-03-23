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
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import UserLayout from '@/layouts/user-layout';

interface AdminOrder {
    id: string;
    producto: string;
    cantidad: string;
    precio: string;
    cliente: string;
    direccion: string;
    estado: string;
    estado_color: 'success' | 'danger';
}

interface AdminOrdersProps {
    auth: {
        user: {
            name: string;
        };
    };
    ordenes: AdminOrder[];
}

export default function AdminOrders({ auth, ordenes }: AdminOrdersProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(2); // In image, page 2 is active
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const itemsPerPage = 8;

    // Filter logic
    const filteredOrders = useMemo(() => {
        return ordenes.filter((order) => {
            const matchesSearch =
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.cliente.toLowerCase().includes(searchTerm.toLowerCase());

            // Add real date logic when API provides dates for admin orders
            // For now, it matches everything if no date is selected
            return matchesSearch;
        });
    }, [ordenes, searchTerm, startDate, endDate]);

    // Pagination logic
    const totalPages = 12; // Static based on image to match UI
    const paginatedOrders = useMemo(() => {
        const startIndex = 0; // In a static UI, we just show the array
        return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredOrders, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

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
                        {/* Static Date Select for UI matching */}
                        <div className="relative w-full md:w-[260px]">
                            <div
                                onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                                className={`flex h-10 cursor-pointer items-center justify-between border bg-white px-4 transition-all hover:bg-gray-50 focus:outline-none ${isDateMenuOpen ? 'rounded-t-md border-[#DFE4EA]' : 'rounded-md border-[#DFE4EA]'}`}
                            >
                                <span className="text-[13px] font-medium text-[#1B3D6D] opacity-80">
                                    01/04/2025 - 17/04/2025
                                </span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`size-3 text-[#1B3D6D] opacity-60 transition-transform duration-200 ${isDateMenuOpen ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </div>

                        <button className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#DFE4EA] bg-white px-5 text-[14px] font-semibold text-[#1B3D6D] transition hover:bg-gray-50 md:w-auto shadow-sm">
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
                                {paginatedOrders.map((order, idx) => (
                                    <tr
                                        key={idx}
                                        className={`transition duration-150 hover:bg-gray-50/40 ${idx !== paginatedOrders.length - 1 ? 'border-b border-[#F2F2F2]/60' : ''}`}
                                    >
                                        <td className="px-6 py-4 text-[13px] font-medium text-[#7B7B7B]">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                            {order.producto}
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                            {order.cantidad}
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                            {order.precio}
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                            {order.cliente}
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-[#7B7B7B]">
                                            {order.direccion}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-[4px] px-3 py-1 text-[11px] font-semibold ${order.estado_color === 'success' ? 'bg-[#DAF8E6] text-[#1A8245]' : 'bg-[#FEEBEB] text-[#E10E0E]'}`}
                                            >
                                                {order.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between border-t border-[#F2F2F2] px-6 py-4 sm:flex-row">
                        <span className="mb-4 text-[13px] font-medium text-[#7B7B7B] sm:mb-0">
                            Mostrando 1 de 10 registros
                        </span>
                        
                        {/* Custom Pagination match design */}
                        <div className="flex items-center gap-1">
                            <button className="flex h-7 w-7 items-center justify-center text-[#A0A0A0] hover:text-[#1B3D6D]">
                                <FontAwesomeIcon icon={faChevronLeft} className="size-3" />
                            </button>
                            
                            <button className="flex h-7 w-7 items-center justify-center rounded-[2px] text-[13px] text-[#7B7B7B] hover:bg-[#F2F2F2]">
                                1
                            </button>
                            <button className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-[#1B3D6D] text-[13px] font-semibold text-white shadow-sm">
                                2
                            </button>
                            <button className="flex h-7 w-7 items-center justify-center rounded-[2px] text-[13px] text-[#7B7B7B] hover:bg-[#F2F2F2]">
                                3
                            </button>
                            <button className="flex h-7 w-7 items-center justify-center rounded-[2px] text-[13px] text-[#7B7B7B] hover:bg-[#F2F2F2]">
                                4
                            </button>
                            <button className="flex h-7 w-7 items-center justify-center rounded-[2px] text-[13px] text-[#7B7B7B] hover:bg-[#F2F2F2]">
                                5
                            </button>
                            <span className="flex h-7 w-7 items-end justify-center text-[13px] text-[#7B7B7B] pb-1">
                                ...
                            </span>
                            <button className="flex h-7 w-7 items-center justify-center rounded-[2px] text-[13px] text-[#7B7B7B] hover:bg-[#F2F2F2]">
                                12
                            </button>

                            <button className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-[#F2F2F2] text-[#7B7B7B] hover:bg-[#E5E5E5] ml-1">
                                <FontAwesomeIcon icon={faChevronRight} className="size-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
