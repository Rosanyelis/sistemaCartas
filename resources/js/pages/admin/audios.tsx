import { faEllipsisV, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, router } from '@inertiajs/react';
import React, { useCallback, useEffect, useState } from 'react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import {
    CreateAudioModal,
    type AudioParaFormulario,
} from '@/components/admin/CreateAudioModal';
import ListPagination from '@/components/panel/ListPagination';
import UserLayout from '@/layouts/user-layout';
import type { PaginatedData } from '@/types/pagination';
import { audios as adminAudiosList } from '@/routes/admin';
import { destroy as audiosDestroy, qr as audiosQr } from '@/routes/admin/audios';

interface AudioRow {
    id: number;
    titulo: string;
    slug: string;
    codigo: string | null;
    historia_id: number;
    historia_nombre: string;
    estado: string;
    qr_path: string | null;
    public_url: string;
    created_at: string;
}

type HistoriaOption = { id: number; nombre: string };

interface Props {
    audios: PaginatedData<AudioRow>;
    historias: HistoriaOption[];
    filters: { search?: string };
}

export default function Audios({ audios, historias, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [audioToEdit, setAudioToEdit] = useState<AudioParaFormulario | null>(null);
    const [deleteAudioId, setDeleteAudioId] = useState<number | null>(null);

    useEffect(() => {
        const closeActionMenu = () => setOpenMenuId(null);
        document.addEventListener('click', closeActionMenu);

        return () => document.removeEventListener('click', closeActionMenu);
    }, []);

    const applyFilters = useCallback(
        (params: Record<string, string>) => {
            router.get(
                adminAudiosList.url({ query: { ...filters, ...params, page: '1' } }),
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
        if (deleteAudioId !== null) {
            router.delete(audiosDestroy.url(deleteAudioId), {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => setDeleteAudioId(null),
            });
        }
    };

    const openEdit = (audio: AudioRow) => {
        setOpenMenuId(null);
        setIsCreateModalOpen(false);
        setAudioToEdit({
            id: audio.id,
            titulo: audio.titulo,
            codigo: audio.codigo,
            historia_id: audio.historia_id,
            estado: audio.estado,
            qr_path: audio.qr_path,
        });
    };

    const { data: audioList, current_page, last_page, from, to, total } = audios;

    const renderActionMenu = (audio: AudioRow) => (
        <div className="absolute right-0 top-full z-20 mt-1 w-[170px] rounded-[6px] border border-[#F3F4F6] bg-white py-1 text-left shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
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
                    window.open(audio.public_url, '_blank', 'noopener,noreferrer');
                }}
                className="flex w-full items-center justify-start px-4 py-2.5 text-[14px] text-[#4B5563] transition-colors hover:bg-gray-50"
            >
                Ver URL pública
            </button>
            <a
                href={audiosQr.url(audio.id)}
                className="flex w-full items-center justify-start px-4 py-2.5 text-[14px] text-[#4B5563] transition-colors hover:bg-gray-50"
                onClick={() => setOpenMenuId(null)}
            >
                Descargar QR
            </a>
            <button
                type="button"
                onClick={() => {
                    setOpenMenuId(null);
                    setDeleteAudioId(audio.id);
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
                    <h1 className="text-[25px] font-bold text-[#1B3D6D] md:text-2xl">Audios</h1>
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
                            placeholder="Filtrar por título, código o historia"
                            className="block w-full rounded-[4px] border border-[#DFE4EA] bg-white py-[10px] pl-[34px] pr-3 text-[13px] text-[#1B3D6D] placeholder:text-[#1B3D6D]/60 outline-none transition-all focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15 md:rounded-md md:border-[#E5E7EB] md:py-2.5 md:pl-10 md:text-sm md:text-gray-900 md:placeholder:text-[#A0A0A0]"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setAudioToEdit(null);
                            setIsCreateModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 rounded-[4px] bg-[#1B3D6D] px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 md:text-sm"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Crear audio
                    </button>
                </div>

                <div className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-[13px] md:text-sm">
                            <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[#4B5563]">
                                <tr>
                                    <th className="px-4 py-3 font-semibold md:px-6">Título</th>
                                    <th className="px-4 py-3 font-semibold md:px-6">Historia</th>
                                    <th className="px-4 py-3 font-semibold md:px-6">Estado</th>
                                    <th className="px-4 py-3 font-semibold md:px-6">Fecha</th>
                                    <th className="px-4 py-3 font-semibold md:px-6">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {audioList.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-[#7B7B7B]"
                                        >
                                            No hay audios registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    audioList.map((audio) => (
                                        <tr
                                            key={audio.id}
                                            className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#FAFAFA]"
                                        >
                                            <td className="px-4 py-3 font-medium text-[#1B3D6D] md:px-6">
                                                {audio.titulo}
                                            </td>
                                            <td className="px-4 py-3 text-[#4B5563] md:px-6">
                                                {audio.historia_nombre}
                                            </td>
                                            <td className="px-4 py-3 md:px-6">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
                                                        audio.estado === 'activo'
                                                            ? 'bg-green-50 text-green-700'
                                                            : 'bg-amber-50 text-amber-700'
                                                    }`}
                                                >
                                                    {audio.estado === 'activo' ? 'Activo' : 'Pausado'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[#4B5563] md:px-6">
                                                {audio.created_at}
                                            </td>
                                            <td className="relative px-4 py-3 md:px-6">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(
                                                            openMenuId === audio.id ? null : audio.id,
                                                        );
                                                    }}
                                                    className="rounded p-2 text-[#4B5563] hover:bg-gray-100"
                                                    aria-label="Acciones"
                                                >
                                                    <FontAwesomeIcon icon={faEllipsisV} />
                                                </button>
                                                {openMenuId === audio.id && renderActionMenu(audio)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
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
                />
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
                isOpen={deleteAudioId !== null}
                title="Eliminar audio"
                description="¿Seguro que deseas eliminar este audio? Se borrarán el archivo y el código QR."
                confirmText="Eliminar"
                onConfirm={handleDeleteConfirm}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteAudioId(null);
                    }
                }}
            />
        </UserLayout>
    );
}
