import {
    faEllipsisV,
    faPlus,
    faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, router } from '@inertiajs/react';
import React, { useCallback, useEffect, useState } from 'react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import {
    CreateAudioModal,
    type AudioParaFormulario,
} from '@/components/admin/CreateAudioModal';
import type { HistoriaSelectOption } from '@/components/admin/SearchableHistoriaSelect';
import ListPagination from '@/components/panel/ListPagination';
import UserLayout from '@/layouts/user-layout';
import type { PaginatedData } from '@/types/pagination';
import {
    destroy as audiosDestroy,
    downloadQr as audiosDownloadQr,
    index as adminAudiosList,
} from '@/actions/App/Http/Controllers/Admin/AudioController';

interface AudioRow {
    id: number;
    titulo: string;
    slug: string;
    historia_id: number;
    historia_nombre: string;
    historia_imagen: string | null;
    estado: string;
    qr_path: string | null;
    public_url: string;
    created_at: string;
}

interface Props {
    audios: PaginatedData<AudioRow>;
    historias: HistoriaSelectOption[];
    filters: { search?: string };
}

function estadoBadgeClass(estado: string): string {
    return estado === 'activo'
        ? 'bg-[#D1F4E0] text-[#12A05B]'
        : 'bg-[#E0F2FE] text-[#0284C7]';
}

function estadoLabel(estado: string): string {
    return estado.charAt(0).toUpperCase() + estado.slice(1);
}

export default function Audios({ audios, historias, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [audioToEdit, setAudioToEdit] = useState<AudioParaFormulario | null>(
        null,
    );
    const [deleteAudioSlug, setDeleteAudioSlug] = useState<string | null>(null);

    useEffect(() => {
        const closeActionMenu = () => setOpenMenuId(null);
        document.addEventListener('click', closeActionMenu);

        return () => document.removeEventListener('click', closeActionMenu);
    }, []);

    const applyFilters = useCallback(
        (params: Record<string, string>) => {
            router.get(
                adminAudiosList.url({
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
            adminAudiosList.url({ query: { ...filters, page: String(page) } }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteConfirm = () => {
        if (deleteAudioSlug !== null) {
            router.delete(audiosDestroy.url(deleteAudioSlug), {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => setDeleteAudioSlug(null),
            });
        }
    };

    const openEdit = (audio: AudioRow) => {
        setOpenMenuId(null);
        setIsCreateModalOpen(false);
        setAudioToEdit({
            id: audio.id,
            slug: audio.slug,
            titulo: audio.titulo,
            historia_id: audio.historia_id,
            estado: audio.estado,
            qr_path: audio.qr_path,
        });
    };

    const {
        data: audioList,
        current_page,
        last_page,
        from,
        to,
        total,
    } = audios;

    const renderActionMenu = (audio: AudioRow) => (
        <div className="absolute top-full right-0 z-20 mt-1 w-[170px] rounded-[6px] border border-[#F3F4F6] bg-white py-1 text-left shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
            <button
                type="button"
                onClick={() => openEdit(audio)}
                className="flex w-full items-center justify-start px-4 py-2.5 text-[14px] text-[#4B5563] transition-colors hover:bg-gray-50"
            >
                Editar
            </button>
            <button
                type="button"
                onClick={() => {
                    setOpenMenuId(null);
                    window.open(
                        audio.public_url,
                        '_blank',
                        'noopener,noreferrer',
                    );
                }}
                className="flex w-full items-center justify-start px-4 py-2.5 text-[14px] text-[#4B5563] transition-colors hover:bg-gray-50"
            >
                Ver URL pública
            </button>
            <a
                href={audiosDownloadQr.url(audio.slug)}
                className="flex w-full items-center justify-start px-4 py-2.5 text-[14px] text-[#4B5563] transition-colors hover:bg-gray-50"
                onClick={() => setOpenMenuId(null)}
            >
                Descargar QR
            </a>
            <button
                type="button"
                onClick={() => {
                    setOpenMenuId(null);
                    setDeleteAudioSlug(audio.slug);
                }}
                className="flex w-full items-center justify-start px-4 py-2.5 text-[14px] text-red-500 transition-colors hover:bg-red-50"
            >
                Eliminar
            </button>
        </div>
    );

    return (
        <UserLayout title="Audios">
            <Head title="Gestión de Audios" />

            <div className="flex flex-col gap-6 px-4 py-6 font-['Inter'] md:px-8">
                <div className="mb-2 flex flex-col items-center gap-1 text-center md:mb-0 md:items-start md:text-left">
                    <h1 className="text-[25px] font-bold text-[#1B3D6D] md:text-2xl">
                        Audios
                    </h1>
                    <p className="text-[13.5px] text-[#1B3D6D] md:text-sm md:text-[#7B7B7B]">
                        Carga audios, asócialos a historias y genera códigos QR
                    </p>
                </div>

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
                            placeholder="Filtrar por título o historia"
                            className="block w-full rounded-[4px] border border-[#DFE4EA] bg-white py-[10px] pr-3 pl-[34px] text-[13px] text-[#1B3D6D] transition-all outline-none placeholder:text-[#1B3D6D]/60 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15 md:rounded-md md:border-[#E5E7EB] md:py-2.5 md:pl-10 md:text-sm md:text-gray-900 md:placeholder:text-[#A0A0A0]"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setAudioToEdit(null);
                            setIsCreateModalOpen(true);
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#1B3D6D] px-4 py-[10px] text-[14px] font-bold text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#1B3D6D]/90 md:w-auto md:rounded-md md:py-2.5 md:font-semibold md:shadow-sm"
                    >
                        <span>Crear audio</span>
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="text-[12px] md:text-[14px]"
                        />
                    </button>
                </div>

                <div className="flex w-full flex-col bg-transparent md:rounded-lg md:bg-white md:shadow-[0px_0px_15px_rgba(36,16,167,0.08)]">
                    <div className="hidden overflow-visible md:block">
                        <table className="w-full min-w-[900px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Título
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Historia
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Estado
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Fecha creación
                                    </th>
                                    <th className="px-5 py-4 text-center text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {audioList.length > 0 ? (
                                    audioList.map((audio) => (
                                        <tr
                                            key={audio.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            audio.historia_imagen ||
                                                            '/images/placeholder.svg'
                                                        }
                                                        alt={audio.titulo}
                                                        className="h-10 w-10 rounded bg-gray-100 object-cover shadow-sm"
                                                    />
                                                    <span className="text-sm font-medium text-[#111827]">
                                                        {audio.titulo}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {audio.historia_nombre}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded px-2.5 py-0.5 text-[11.5px] font-semibold tracking-wide ${estadoBadgeClass(audio.estado)}`}
                                                >
                                                    {estadoLabel(audio.estado)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {audio.created_at}
                                            </td>
                                            <td className="relative px-5 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const menuKey = `desktop-${audio.id}`;
                                                        setOpenMenuId(
                                                            openMenuId ===
                                                                menuKey
                                                                ? null
                                                                : menuKey,
                                                        );
                                                    }}
                                                    className="rounded-full p-2 text-[#7B7B7B] transition-colors outline-none hover:bg-gray-100 hover:text-[#1B3D6D]"
                                                    aria-label="Acciones"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEllipsisV}
                                                        className="text-sm"
                                                    />
                                                </button>
                                                {openMenuId ===
                                                    `desktop-${audio.id}` &&
                                                    renderActionMenu(audio)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-5 py-10 text-center text-sm text-[#7B7B7B]"
                                        >
                                            No hay audios registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-4 block flex-col rounded-[10px] bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.04)] md:hidden">
                        <div className="flex w-full flex-col divide-y divide-[#F3F4F6] px-4">
                            {audioList.length > 0 ? (
                                audioList.map((audio) => (
                                    <div
                                        key={audio.id}
                                        className="relative flex gap-3 py-[18px]"
                                    >
                                        <div className="shrink-0">
                                            <img
                                                src={
                                                    audio.historia_imagen ||
                                                    '/images/placeholder.svg'
                                                }
                                                alt={audio.titulo}
                                                className="h-[88px] w-[88px] rounded-[6px] border border-gray-100 bg-gray-100 object-cover shadow-sm"
                                            />
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <div className="relative flex w-full items-start justify-between gap-2">
                                                <div className="min-w-0 pr-8">
                                                    <div className="truncate text-[13.5px] leading-tight font-medium text-[#111827]">
                                                        {audio.titulo}
                                                    </div>
                                                    <div className="mt-1 text-[13px] text-[#4B5563]">
                                                        {audio.historia_nombre}
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center justify-center rounded px-[8px] py-[2px] text-[11.5px] font-medium tracking-wide ${estadoBadgeClass(audio.estado)}`}
                                                    >
                                                        {estadoLabel(
                                                            audio.estado,
                                                        )}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const menuKey = `mobile-${audio.id}`;
                                                            setOpenMenuId(
                                                                openMenuId ===
                                                                    menuKey
                                                                    ? null
                                                                    : menuKey,
                                                            );
                                                        }}
                                                        className="text-[#4B5563] outline-none"
                                                        aria-label="Acciones"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEllipsisV}
                                                            className="text-sm"
                                                        />
                                                    </button>
                                                </div>
                                                {openMenuId ===
                                                    `mobile-${audio.id}` &&
                                                    renderActionMenu(audio)}
                                            </div>
                                            <div className="mt-2 text-[12.5px] text-[#A0A0A0]">
                                                {audio.created_at}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-[13px] text-[#7B7B7B]">
                                    No hay audios registrados.
                                </div>
                            )}
                        </div>
                    </div>

                    <ListPagination
                        variant="admin"
                        currentPage={current_page}
                        lastPage={last_page}
                        from={from}
                        to={to}
                        total={total}
                        onPageChange={goToPage}
                        className="mt-2 justify-center bg-transparent md:mt-0 md:justify-between md:bg-white md:py-4"
                    />
                </div>
            </div>

            <CreateAudioModal
                isOpen={isCreateModalOpen || audioToEdit !== null}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setAudioToEdit(null);
                }}
                historias={historias}
                audioToEdit={audioToEdit}
            />

            <ConfirmDialog
                isOpen={deleteAudioSlug !== null}
                title="Eliminar audio"
                description="¿Seguro que deseas eliminar este audio? Se borrarán el archivo y el código QR."
                confirmText="Eliminar"
                onConfirm={handleDeleteConfirm}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteAudioSlug(null);
                    }
                }}
            />
        </UserLayout>
    );
}
