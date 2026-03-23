import {
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faMagnifyingGlass,
    faFilter,
    faCircleExclamation,
    faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import UserLayout from '@/layouts/user-layout';

interface Suscripcion {
    id: string;
    historia: string;
    cantidad: number;
    tipo: string;
    fecha_adquisicion: string;
    fecha_finalizacion: string;
    proximo_cobro: string;
    estado: string;
    estado_color: 'success' | 'warning' | 'danger';
}

interface SubscriptionsProps {
    suscripciones: Suscripcion[];
}

export default function Subscriptions({ suscripciones }: SubscriptionsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedSub, setSelectedSub] = useState<Suscripcion | null>(null);
    const itemsPerPage = 5;

    // Filter logic
    const filteredSuscripciones = useMemo(() => {
        return suscripciones.filter((sub) => {
            const matchesSearch =
                sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.historia.toLowerCase().includes(searchTerm.toLowerCase());

            const subDate = sub.fecha_adquisicion;
            const matchesDate =
                (!startDate || subDate >= startDate) &&
                (!endDate || subDate <= endDate);

            return matchesSearch && matchesDate;
        });
    }, [suscripciones, searchTerm, startDate, endDate]);

    // Pagination logic
    const totalPages = Math.ceil(filteredSuscripciones.length / itemsPerPage);
    const paginatedSuscripciones = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredSuscripciones.slice(
            startIndex,
            startIndex + itemsPerPage,
        );
    }, [filteredSuscripciones, currentPage]);

    const formatDateDisplay = (dateStr: string) => {
        const date = new Date(dateStr);
        const months = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];
        return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const openCancelModal = (sub: Suscripcion) => {
        setSelectedSub(sub);
        setIsCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        setIsCancelModalOpen(false);
        setSelectedSub(null);
    };

    return (
        <UserLayout title="Suscripciones">
            <Head title="Mis Suscripciones" />
            <div className="flex w-full flex-col gap-6">
                {/* Page Header */}
                <div className="flex flex-col gap-1.5 px-1 md:px-0">
                    <h1 className="font-['Inter'] text-[24px] leading-tight font-bold text-[#1B3D6D] md:text-[28px]">
                        Suscripciones
                    </h1>
                    <p className="font-['Inter'] text-[12px] font-normal text-[#1B3D6D] md:text-[14px]">
                        Aquí puedes revisar y gestionar todas las suscripciones
                        adquiridas en la plataforma
                    </p>
                </div>

                {/* Card Template */}
                <div className="flex flex-col overflow-hidden rounded-[12px] bg-white p-4 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:rounded-[4px] md:p-5">
                    {/* Filters bar */}
                    <div className="mb-6 flex w-full flex-col items-center justify-between gap-3 md:flex-row">
                        <div className="relative w-full md:max-w-[340px]">
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
                                placeholder="Buscar por número de órden o nombre de la historia"
                                className="h-[38px] w-full rounded-[4px] border border-[#DFE4EA] bg-white pr-4 pl-10 text-[12px] text-[#1B3D6D] transition-all outline-none placeholder:text-[#1B3D6D]/40 focus:ring-1 focus:ring-[#1B3D6D]/15"
                            />
                        </div>

                        <div className="flex w-full items-center gap-4 md:w-auto">
                            <div className="relative w-full md:w-[240px]">
                                <div
                                    onClick={() =>
                                        setIsDateMenuOpen(!isDateMenuOpen)
                                    }
                                    className={`flex h-[38px] cursor-pointer items-center justify-between border bg-white px-4 drop-shadow-sm transition-all hover:bg-gray-50 ${isDateMenuOpen ? 'rounded-t-[4px] border-[#1B3D6D] ring-1 ring-[#1B3D6D]/10' : 'rounded-[4px] border-[#DFE4EA]'}`}
                                >
                                    <span className="text-[12px] font-medium text-[#1B3D6D]">
                                        {startDate && endDate
                                            ? `${startDate.split('-').reverse().join('/')} - ${endDate.split('-').reverse().join('/')}`
                                            : startDate
                                              ? `Desde ${startDate.split('-').reverse().join('/')}`
                                              : endDate
                                                ? `Hasta ${endDate.split('-').reverse().join('/')}`
                                                : '01/04/2025 - 17/04/2025'}
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
                                                    className="h-8 w-full rounded border border-[#DFE4EA] px-2 text-[11px] text-[#1B3D6D] outline-none"
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
                                                    className="h-8 w-full rounded border border-[#DFE4EA] px-2 text-[11px] text-[#1B3D6D] outline-none"
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
                                                className="rounded bg-[#1B3D6D] px-3 py-1.5 text-[11px] font-semibold text-white"
                                            >
                                                Aplicar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#F5F6F7]">
                                    <th className="rounded-tl-[4px] border-b border-[#F2F2F2] px-3 py-4 text-left text-[11px] font-bold tracking-wider text-[#111928] uppercase">
                                        N°{' '}
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className="ml-1 size-2 opacity-30"
                                        />
                                    </th>
                                    <th className="border-b border-[#F2F2F2] px-3 py-4 text-left text-[11px] font-bold tracking-wider text-[#111928] uppercase">
                                        Historia
                                    </th>
                                    <th className="border-b border-[#F2F2F2] px-3 py-4 text-center text-[11px] font-bold tracking-wider text-[#111928] uppercase">
                                        Cantidad
                                    </th>
                                    <th className="border-b border-[#F2F2F2] px-3 py-4 text-left text-[11px] font-bold tracking-wider text-[#111928] uppercase">
                                        Suscripción
                                    </th>
                                    <th className="border-b border-[#F2F2F2] px-3 py-4 text-left text-[11px] font-bold tracking-wider text-[#111928] uppercase">
                                        Fecha de Adquisición
                                    </th>
                                    <th className="border-b border-[#F2F2F2] px-3 py-4 text-left text-[11px] font-bold tracking-wider text-[#111928] uppercase">
                                        Fecha de finalización
                                    </th>
                                    <th className="border-b border-[#F2F2F2] px-3 py-4 text-left text-[11px] font-bold tracking-wider text-[#111928] uppercase">
                                        Próximo cobro
                                    </th>
                                    <th className="border-b border-[#F2F2F2] px-3 py-4 text-center text-[11px] font-bold tracking-wider text-[#111928] uppercase">
                                        Estado{' '}
                                        <FontAwesomeIcon
                                            icon={faFilter}
                                            className="ml-1 size-2 opacity-30"
                                        />
                                    </th>
                                    <th className="rounded-tr-[4px] border-b border-[#F2F2F2] px-3 py-4 text-center text-[11px] font-bold tracking-wider text-[#111928] uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedSuscripciones.length > 0 ? (
                                    paginatedSuscripciones.map((sub, idx) => (
                                        <tr
                                            key={idx}
                                            className="transition duration-150 hover:bg-gray-50/40"
                                        >
                                            <td className="border-b border-[#F2F2F2] px-3 py-4 text-[12px] font-medium text-[#111928]">
                                                {sub.id}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-3 py-4 text-[12px] font-medium text-[#7B7B7B]">
                                                {sub.historia}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-3 py-4 text-center text-[12px] text-[#7B7B7B]">
                                                {sub.cantidad}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-3 py-4 text-[12px] text-[#7B7B7B]">
                                                {sub.tipo}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-3 py-4 text-[12px] text-[#7B7B7B]">
                                                {sub.fecha_adquisicion
                                                    .split('-')
                                                    .reverse()
                                                    .join('/')}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-3 py-4 text-[12px] text-[#7B7B7B]">
                                                {sub.fecha_finalizacion
                                                    .split('-')
                                                    .reverse()
                                                    .join('/')}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-3 py-4 text-[12px] text-[#7B7B7B]">
                                                {sub.proximo_cobro
                                                    .split('-')
                                                    .reverse()
                                                    .join('/')}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-3 py-4 text-center">
                                                <span
                                                    className={`rounded-[4px] px-2.5 py-1 text-[11px] font-semibold ${
                                                        sub.estado_color ===
                                                        'success'
                                                            ? 'bg-[#DAF8E6] text-[#1A8245]'
                                                            : sub.estado_color ===
                                                                'warning'
                                                              ? 'bg-[#FEF3E2] text-[#B45309]'
                                                              : 'bg-[#FEEBEB] text-[#E10E0E]'
                                                    }`}
                                                >
                                                    {sub.estado}
                                                </span>
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-3 py-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        openCancelModal(sub)
                                                    }
                                                    className="rounded-[4px] border border-[#1B3D6D] px-4 py-1.5 text-[10px] font-medium text-[#1B3D6D] transition-colors duration-200 hover:bg-[#1B3D6D] hover:text-white"
                                                >
                                                    Dar de baja
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="py-20 text-center text-[14px] text-[#7B7B7B]"
                                        >
                                            No se encontraron suscripciones.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="flex flex-col gap-0 md:hidden">
                        {paginatedSuscripciones.length > 0 ? (
                            paginatedSuscripciones.map((sub, idx) => (
                                <div
                                    key={idx}
                                    className={`relative flex flex-col gap-3 py-5 ${idx !== paginatedSuscripciones.length - 1 ? 'border-b border-[#F2F2F2]' : ''}`}
                                >
                                    {/* Row 1: ID, Status, Actions */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-[14px] font-bold text-[#111928] leading-none">
                                            {sub.id}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`rounded-[6px] px-3 py-1 text-[11px] font-semibold ${
                                                    sub.estado_color === 'success'
                                                        ? 'bg-[#DAF8E6] text-[#1A8245]'
                                                        : sub.estado_color === 'warning'
                                                        ? 'bg-[#FEF3E2] text-[#B45309]'
                                                        : 'bg-[#FEEBEB] text-[#E10E0E]'
                                                }`}
                                            >
                                                {sub.estado}
                                            </span>
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setActiveMenuId(activeMenuId === sub.id ? null : sub.id)}
                                                    className="flex size-8 items-center justify-center text-[#111928] opacity-60 hover:opacity-100"
                                                >
                                                    <FontAwesomeIcon icon={faEllipsisVertical} className="size-4" />
                                                </button>
                                                {activeMenuId === sub.id && (
                                                    <>
                                                        <div 
                                                            className="fixed inset-0 z-10" 
                                                            onClick={() => setActiveMenuId(null)} 
                                                        />
                                                        <div className="absolute right-0 top-full z-20 mt-1 w-[120px] rounded-[6px] bg-white p-1.5 shadow-[0px_4px_15px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-1 duration-150">
                                                            <button
                                                                onClick={() => {
                                                                    openCancelModal(sub);
                                                                    setActiveMenuId(null);
                                                                }}
                                                                className="w-full rounded-[4px] px-3 py-2 text-left text-[12px] font-medium text-[#1B3D6D] hover:bg-gray-50 active:bg-gray-100"
                                                            >
                                                                Dar de baja
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2: Name, Quantity */}
                                    <div className="flex items-center justify-between mt-0.5">
                                        <span className="text-[14px] font-medium text-[#111928] leading-tight max-w-[70%]">
                                            {sub.historia}
                                        </span>
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                            <span className="text-[12px] font-medium text-[#1B3D6D]">Cantidad:</span>
                                            <span className="text-[12px] font-bold text-[#1B3D6D]">{sub.cantidad}</span>
                                        </div>
                                    </div>

                                    {/* Row 3: Subscription Type */}
                                    <div className="flex -mt-1.5">
                                        <span className="text-[14px] font-medium text-[#111928]">
                                            {sub.tipo}
                                        </span>
                                    </div>

                                    {/* Row 4: Dates Grid */}
                                    <div className="grid grid-cols-2 gap-x-4 mt-1">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-medium text-[#BBBBBB]">Adquisición</span>
                                            <span className="text-[13px] font-bold text-[#111928]">
                                                {formatDateDisplay(sub.fecha_adquisicion)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-medium text-[#BBBBBB]">Finalización</span>
                                            <span className="text-[13px] font-bold text-[#111928]">
                                                {formatDateDisplay(sub.fecha_finalizacion)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center text-[14px] text-[#7B7B7B]">
                                No se encontraron suscripciones.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-auto flex flex-col items-center justify-between gap-6 border-t border-[#F2F2F2] bg-white pt-8 pb-4 md:flex-row md:border-none md:pt-6 md:pb-0">
                        <p className="w-full text-center font-['Inter'] text-[14px] font-medium text-[#7B7B7B] md:w-auto md:text-left md:text-[13px] md:font-semibold">
                            Mostrando {paginatedSuscripciones.length} de{' '}
                            {filteredSuscripciones.length} registros
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                disabled={currentPage === 1}
                                className="flex size-9 items-center justify-center rounded-[6px] text-[#637381] hover:bg-gray-100 disabled:opacity-30 md:size-8"
                            >
                                <FontAwesomeIcon
                                    icon={faChevronLeft}
                                    className="size-3"
                                />
                            </button>
                            
                            {/* Pagination items logic */}
                            {(() => {
                                const pages = [];
                                if (totalPages <= 7) {
                                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                                } else {
                                    if (currentPage <= 4) {
                                        for (let i = 1; i <= 5; i++) pages.push(i);
                                        pages.push('...');
                                        pages.push(totalPages);
                                    } else if (currentPage >= totalPages - 3) {
                                        pages.push(1);
                                        pages.push('...');
                                        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                                    } else {
                                        pages.push(1);
                                        pages.push('...');
                                        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                                        pages.push('...');
                                        pages.push(totalPages);
                                    }
                                }
                                return pages.map((page, idx) => (
                                    typeof page === 'number' ? (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentPage(page)}
                                            className={`flex size-9 items-center justify-center rounded-[4px] text-[13px] font-bold transition-colors md:size-8 ${currentPage === page ? 'bg-[#1B3D6D] text-white' : 'text-[#637381] hover:bg-gray-100'}`}
                                        >
                                            {page}
                                        </button>
                                    ) : (
                                        <span key={idx} className="flex size-9 items-center justify-center text-[13px] text-[#637381] md:size-8">
                                            {page}
                                        </span>
                                    )
                                ));
                            })()}

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
                                className="flex size-9 items-center justify-center rounded-[6px] text-[#637381] hover:bg-gray-100 disabled:opacity-30 md:size-8"
                            >
                                <FontAwesomeIcon
                                    icon={faChevronRight}
                                    className="size-3"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-black/40 px-4 transition-all duration-300 fade-in">
                    <div className="w-full max-w-[450px] animate-in overflow-hidden rounded-[16px] bg-white p-8 shadow-2xl duration-200 zoom-in-95">
                        <div className="flex flex-col items-center text-center">
                            {/* Circle info icon */}
                            <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-[#F5F6F7]">
                                <FontAwesomeIcon
                                    icon={faCircleExclamation}
                                    className="size-7 text-[#1B3D6D]"
                                />
                            </div>

                            <h2 className="mb-3 px-4 font-['Inter'] text-[22px] leading-tight font-bold text-[#1B3D6D]">
                                ¿Estás seguro que deseas cancelar tu
                                suscripción?
                            </h2>

                            <div className="mb-6 h-[2.5px] w-20 rounded-full bg-[#1B3D6D]/80" />

                            <p className="mb-8 font-['Inter'] text-[15px] font-medium text-[#7B7B7B]">
                                Si deseas cancelar tu suscripción presiona
                                continuar
                            </p>

                            <div className="flex w-full gap-4">
                                <button
                                    onClick={closeCancelModal}
                                    className="h-[50px] flex-1 rounded-[4px] bg-[#1B3D6D] font-['Inter'] text-[16px] font-bold text-white transition hover:opacity-90 active:scale-[0.98]"
                                >
                                    Continuar
                                </button>
                                <button
                                    onClick={closeCancelModal}
                                    className="h-[50px] flex-1 rounded-[4px] border border-[#1B3D6D] font-['Inter'] text-[16px] font-bold text-[#1B3D6D] transition hover:bg-gray-50 active:scale-[0.98]"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
