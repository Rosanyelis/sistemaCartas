import React, { useMemo, useState, useEffect, useRef } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
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

interface Subscription {
    id: string;
    historia: string;
    cantidad: string;
    tipo: string;
    fecha_adquisicion: string; // Formato DD/MM/YYYY en los datos simulados
    fecha_finalizacion: string;
    proximo_cobro: string;
    cliente_nombre: string;
    cliente_direccion: string;
    estado: string;
    estado_color: string;
}

interface Props {
    subscriptions: Subscription[];
}

export default function Subscriptions({ subscriptions }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Date filter state
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const dateMenuRef = useRef<HTMLDivElement>(null);
    
    const itemsPerPage = 8;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dateMenuRef.current && !dateMenuRef.current.contains(event.target as Node)) {
                setIsDateMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const parseDateStr = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/');
        return new Date(Number(year), Number(month) - 1, Number(day));
    };

    // Lógica de filtrado
    const filteredSubscriptions = useMemo(() => {
        return subscriptions.filter((sub) => {
            const matchesSearch =
                sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.historia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.cliente_direccion.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesDate = true;
            if (startDate || endDate) {
                const subDate = parseDateStr(sub.fecha_adquisicion);
                
                if (startDate) {
                    const [sy, sm, sd] = startDate.split('-');
                    const startLocal = new Date(Number(sy), Number(sm) - 1, Number(sd));
                    if (subDate < startLocal) matchesDate = false;
                }
                
                if (endDate) {
                    const [ey, em, ed] = endDate.split('-');
                    const endLocal = new Date(Number(ey), Number(em) - 1, Number(ed));
                    if (subDate > endLocal) matchesDate = false;
                }
            }

            return matchesSearch && matchesDate;
        });
    }, [subscriptions, searchTerm, startDate, endDate]);

    // Lógica de paginación
    const totalRecords = filteredSubscriptions.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
    
    // Si la pagina actual excede el total (p.ej tras filtrar), ajustamos
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }

    const paginatedSubscriptions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredSubscriptions.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredSubscriptions, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const formatDateLabel = (date: string) => date.split('-').reverse().join('/');


    return (
        <UserLayout title="Suscripciones">
            <Head title="Gestión de Suscripciones" />

            <div className="flex flex-col gap-6 px-4 py-6 font-['Inter'] md:px-8">
                {/* Header Section */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-[#1B3D6D]">
                        Suscripciones
                    </h1>
                    <p className="text-sm text-[#7B7B7B]">
                        Aquí puedes revisar y gestionar todas las suscripciones de la plataforma
                    </p>
                </div>

                {/* Filters/Actions Bar */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-xl">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} className="text-[#A0A0A0] text-sm" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Busca por numero de suscripción, nombre del cliente o correo"
                            className="block w-full rounded-md border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-3 text-sm placeholder-[#A0A0A0] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 relative" ref={dateMenuRef}>
                        <div 
                            onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                            className="flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#4B5563] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-[#A0A0A0]" />
                            <span className="font-medium text-[13px]">
                                {startDate && endDate 
                                    ? `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}` 
                                    : startDate 
                                        ? `Desde ${formatDateLabel(startDate)}` 
                                        : endDate 
                                            ? `Hasta ${formatDateLabel(endDate)}` 
                                            : 'Filtrar por fechas'}
                            </span>
                            <FontAwesomeIcon 
                                icon={faChevronDown} 
                                className={`text-[#A0A0A0] ml-1 text-xs transition-transform ${isDateMenuOpen ? 'rotate-180' : ''}`} 
                            />
                        </div>

                        {/* Dropdown del calendario */}
                        {isDateMenuOpen && (
                            <div className="absolute top-full right-0 lg:left-0 lg:right-auto mt-2 z-10 w-72 rounded-md border border-[#E5E7EB] bg-white p-4 shadow-lg">
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-[#7B7B7B]">Desde (Fecha de adquisición):</label>
                                        <input 
                                            type="date" 
                                            value={startDate} 
                                            onChange={(e) => {setStartDate(e.target.value); setCurrentPage(1);}}
                                            className="w-full rounded border border-[#E5E7EB] p-2 text-sm text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]" 
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-[#7B7B7B]">Hasta (Fecha de adquisición):</label>
                                        <input 
                                            type="date" 
                                            value={endDate} 
                                            onChange={(e) => {setEndDate(e.target.value); setCurrentPage(1);}}
                                            className="w-full rounded border border-[#E5E7EB] p-2 text-sm text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]" 
                                        />
                                    </div>
                                    <div className="mt-2 flex justify-end gap-2">
                                        <button 
                                            onClick={() => {setStartDate(''); setEndDate(''); setCurrentPage(1);}}
                                            className="rounded px-3 py-1.5 text-xs text-[#7B7B7B] font-medium hover:bg-gray-100 transition-colors"
                                        >
                                            Limpiar
                                        </button>
                                        <button 
                                            onClick={() => setIsDateMenuOpen(false)}
                                            className="rounded bg-[#1B3D6D] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1B3D6D]/90 transition-colors"
                                        >
                                            Aplicar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button className="flex items-center gap-2 rounded-md border border-[#1B3D6D] bg-white px-4 py-2.5 text-sm font-semibold text-[#1B3D6D] shadow-sm hover:bg-blue-50 transition-colors">
                            <span>Exportar a excel</span>
                            <FontAwesomeIcon icon={faFileExcel} />
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-lg bg-white shadow-[0px_0px_15px_rgba(36,16,167,0.08)]">
                    <div className="overflow-x-auto">
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
                                {paginatedSubscriptions.length > 0 ? (
                                    paginatedSubscriptions.map((sub, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4 text-sm font-semibold text-[#1B3D6D]">{sub.id}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{sub.historia}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563] text-center">{sub.cantidad}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{sub.tipo}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{sub.fecha_adquisicion}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{sub.fecha_finalizacion}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{sub.proximo_cobro}</td>
                                            <td className="px-5 py-4 text-sm font-medium text-[#111827]">{sub.cliente_nombre}</td>
                                            <td className="px-5 py-4 text-sm text-[#7B7B7B]">{sub.cliente_direccion}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                                                    ${sub.estado === 'Activa' ? 'bg-[#E8F8F0] text-[#10B981]' : 
                                                    sub.estado === 'Inactiva' ? 'bg-[#FEE2E2] text-[#EF4444]' : 
                                                    'bg-[#FEF3C7] text-[#D97706]'}`}>
                                                    {sub.estado}
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

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-[#F3F4F6] px-5 py-4 bg-white">
                        <div className="text-sm text-[#7B7B7B]">
                            Mostrando <span className="font-semibold text-[#111827]">
                                {totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                            </span> a <span className="font-semibold text-[#111827]">
                                {Math.min(currentPage * itemsPerPage, totalRecords)}
                            </span> de <span className="font-semibold text-[#111827]">{totalRecords}</span> registros
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`flex items-center justify-center size-8 rounded-md transition-colors ${currentPage === 1 ? 'text-[#D1D5DB] cursor-not-allowed' : 'hover:bg-gray-100 text-[#7B7B7B]'}`}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                // Lógica simple para mostrar páginas con elipsis
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`flex items-center justify-center size-8 rounded-md transition-colors ${
                                                currentPage === page 
                                                    ? 'bg-[#1B3D6D] text-white font-semibold' 
                                                    : 'hover:bg-gray-100 text-[#7B7B7B]'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                ) {
                                    return <span key={page} className="px-1 text-[#A0A0A0]">...</span>;
                                }
                                return null;
                            })}

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`flex items-center justify-center size-8 rounded-md transition-colors ${currentPage === totalPages ? 'text-[#D1D5DB] cursor-not-allowed' : 'hover:bg-gray-100 text-[#7B7B7B]'}`}
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
