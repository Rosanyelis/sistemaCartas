import {
    faChevronDown,
    faMagnifyingGlass,
    faFilter,
    faCircleExclamation,
    faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import ListPagination from '@/components/panel/ListPagination';
import SuscripcionController from '@/actions/App/Http/Controllers/User/SuscripcionController';

interface Suscripcion {
    id: string;
    suscripcion_id: number;
    historia: string;
    cantidad: number;
    tipo: string;
    fecha_adquisicion: string;
    /** Vacío si no hay fecha en base de datos */
    fecha_finalizacion: string;
    /** Vacío si no hay fecha en base de datos */
    proximo_cobro: string;
    estado: string;
    estado_color: 'success' | 'warning' | 'danger';
    es_activa: boolean;
}

interface SubscriptionsProps {
    suscripciones: Suscripcion[];
}

export default function Subscriptions({ suscripciones }: SubscriptionsProps) {
    const pageErrors = usePage().props.errors as
        | { subscription?: string }
        | undefined;
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activeMenuSuscripcionId, setActiveMenuSuscripcionId] = useState<
        number | null
    >(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedSub, setSelectedSub] = useState<Suscripcion | null>(null);
    const [cancelProcessing, setCancelProcessing] = useState(false);
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

    const filteredTotal = filteredSuscripciones.length;
    const clientLastPage = Math.max(
        1,
        Math.ceil(filteredTotal / itemsPerPage),
    );

    useEffect(() => {
        if (currentPage > clientLastPage) {
            setCurrentPage(clientLastPage);
        }
    }, [currentPage, clientLastPage]);

    const paginatedSuscripciones = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredSuscripciones.slice(
            startIndex,
            startIndex + itemsPerPage,
        );
    }, [filteredSuscripciones, currentPage]);

    const paginationFrom =
        filteredTotal === 0 ? null : (currentPage - 1) * itemsPerPage + 1;
    const paginationTo =
        filteredTotal === 0
            ? null
            : Math.min(currentPage * itemsPerPage, filteredTotal);

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr || dateStr.trim() === '') {
            return '—';
        }
        const date = new Date(`${dateStr}T12:00:00Z`);
        if (Number.isNaN(date.getTime())) {
            return '—';
        }
        const months = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];
        return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
    };

    const formatIsoDateTable = (dateStr: string) => {
        if (!dateStr || dateStr.trim() === '') {
            return '—';
        }
        return dateStr.split('-').reverse().join('/');
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

    const confirmCancelSubscription = () => {
        if (!selectedSub) {
            return;
        }

        setCancelProcessing(true);
        router.post(
            SuscripcionController.cancel.url(selectedSub.suscripcion_id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeCancelModal();
                },
                onFinish: () => {
                    setCancelProcessing(false);
                },
            },
        );
    };

    const canDarDeBaja = (sub: Suscripcion): boolean => sub.es_activa;

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
                    {pageErrors?.subscription ? (
                        <div
                            className="rounded-[4px] border border-red-200 bg-red-50 px-3 py-2 font-['Inter'] text-[13px] text-red-700"
                            role="alert"
                        >
                            {pageErrors.subscription}
                        </div>
                    ) : null}
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
                                    paginatedSuscripciones.map((sub) => (
                                        <tr
                                            key={sub.suscripcion_id}
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
                                                {formatIsoDateTable(sub.fecha_adquisicion)}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-3 py-4 text-[12px] text-[#7B7B7B]">
                                                {formatIsoDateTable(sub.fecha_finalizacion)}
                                            </td>
                                            <td className="border-b border-[#F2F2F2] px-3 py-4 text-[12px] text-[#7B7B7B]">
                                                {formatIsoDateTable(sub.proximo_cobro)}
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
                                                    type="button"
                                                    disabled={!canDarDeBaja(sub)}
                                                    onClick={() =>
                                                        openCancelModal(sub)
                                                    }
                                                    className="rounded-[4px] border border-[#1B3D6D] px-4 py-1.5 text-[10px] font-medium text-[#1B3D6D] transition-colors duration-200 hover:bg-[#1B3D6D] hover:text-white disabled:cursor-not-allowed disabled:border-[#CBD5E1] disabled:text-[#94A3B8] disabled:hover:bg-transparent"
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
                                            {suscripciones.length === 0
                                                ? 'No tienes suscripciones aún.'
                                                : 'No se encontraron suscripciones con los filtros aplicados.'}
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
                                    key={sub.suscripcion_id}
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
                                                    type="button"
                                                    disabled={!canDarDeBaja(sub)}
                                                    onClick={() =>
                                                        setActiveMenuSuscripcionId(
                                                            activeMenuSuscripcionId ===
                                                                sub.suscripcion_id
                                                                ? null
                                                                : sub.suscripcion_id,
                                                        )
                                                    }
                                                    className="flex size-8 items-center justify-center text-[#111928] opacity-60 hover:opacity-100 disabled:opacity-30"
                                                >
                                                    <FontAwesomeIcon icon={faEllipsisVertical} className="size-4" />
                                                </button>
                                                {activeMenuSuscripcionId ===
                                                    sub.suscripcion_id &&
                                                    canDarDeBaja(sub) && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={() =>
                                                                setActiveMenuSuscripcionId(
                                                                    null,
                                                                )
                                                            }
                                                        />
                                                        <div className="absolute right-0 top-full z-20 mt-1 w-[120px] rounded-[6px] bg-white p-1.5 shadow-[0px_4px_15px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-1 duration-150">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    openCancelModal(
                                                                        sub,
                                                                    );
                                                                    setActiveMenuSuscripcionId(
                                                                        null,
                                                                    );
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
                                {suscripciones.length === 0
                                    ? 'No tienes suscripciones aún.'
                                    : 'No se encontraron suscripciones con los filtros aplicados.'}
                            </div>
                        )}
                    </div>

                    <ListPagination
                        currentPage={currentPage}
                        lastPage={clientLastPage}
                        from={paginationFrom}
                        to={paginationTo}
                        total={filteredTotal}
                        onPageChange={setCurrentPage}
                        variant="cliente"
                        className="gap-6 border-t border-[#F2F2F2] pt-8 pb-4 md:border-none md:pt-6 md:pb-0"
                    />
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
                                    type="button"
                                    disabled={cancelProcessing}
                                    onClick={confirmCancelSubscription}
                                    className="h-[50px] flex-1 rounded-[4px] bg-[#1B3D6D] font-['Inter'] text-[16px] font-bold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                                >
                                    {cancelProcessing
                                        ? 'Procesando…'
                                        : 'Continuar'}
                                </button>
                                <button
                                    type="button"
                                    disabled={cancelProcessing}
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
