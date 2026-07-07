import React, { useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faPlus,
    faEdit,
    faTrash,
    faCheckCircle,
    faClock,
    faCalendarAlt,
    faChevronRight,
    faNewspaper,
    faImage,
    faTags,
    faTimes,
    faBold,
    faItalic,
    faUnderline,
    faListUl,
    faAlignLeft,
    faLink,
    faEllipsisV,
    faEye,
} from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { historias as adminHistoriasList } from '@/routes/admin';

interface HistoriaCapitulo {
    id: number;
    historia_id: number;
    titulo: string;
    texto: string;
    orden: number;
    estado: 'borrador' | 'activo';
}

interface Props {
    historia: any;
}

export default function ViewStory({ historia }: Props) {
    const [isCapituloModalOpen, setIsCapituloModalOpen] = useState(false);
    const [capituloToEdit, setCapituloToEdit] =
        useState<HistoriaCapitulo | null>(null);
    const [deleteCapituloId, setDeleteCapituloId] = useState<number | null>(
        null,
    );

    const handleBack = () => {
        router.get(adminHistoriasList.url());
    };

    const handleToggleStatus = (id: number) => {
        router.patch(
            `/admin/capitulos/${id}/toggle-status`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDeleteCapitulo = () => {
        if (deleteCapituloId) {
            router.delete(`/admin/capitulos/${deleteCapituloId}`, {
                preserveScroll: true,
                onSuccess: () => setDeleteCapituloId(null),
            });
        }
    };

    return (
        <UserLayout title={`Detalle: ${historia.nombre}`}>
            <Head title={`Admin - ${historia.nombre}`} />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 font-['Inter'] md:px-8">
                {/* Upper Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="group flex items-center gap-2 text-[#7B7B7B] transition-colors hover:text-[#1B3D6D]"
                    >
                        <div className="flex size-8 items-center justify-center rounded-full border border-gray-200 group-hover:border-[#1B3D6D]/30 group-hover:bg-[#1B3D6D]/5">
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                className="text-xs"
                            />
                        </div>
                        <span className="text-sm font-semibold text-[#1B3D6D]">
                            Volver a Historias
                        </span>
                    </button>

                    <div className="flex items-center gap-3">
                        <span
                            className={`rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wider uppercase shadow-sm ${historia.estado === 'activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#E0F2FE] text-[#0284C7]'}`}
                        >
                            {historia.estado}
                        </span>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column: Data & Stats */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="overflow-hidden rounded-xl border border-[#F3F4F6] bg-white shadow-sm">
                            <div className="relative h-48">
                                <img
                                    src={
                                        historia.imagen ||
                                        '/images/placeholder.svg'
                                    }
                                    className="h-full w-full object-cover"
                                />
                                <div className="items-bottom absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-6">
                                    <h1 className="text-xl font-bold text-white">
                                        {historia.nombre}
                                    </h1>
                                    <p className="text-xs font-medium text-white/80">
                                        {historia.categoria}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4 p-6">
                                <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                                    <div className="flex size-8 items-center justify-center rounded bg-blue-50 text-[#1B3D6D]">
                                        <FontAwesomeIcon
                                            icon={faCalendarAlt}
                                            className="text-[12px]"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-[#A0A0A0] uppercase">
                                            Publicado
                                        </p>
                                        <p className="font-medium text-[#1B3D6D]">
                                            {new Date(
                                                historia.fecha_publicacion,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                                    <div className="flex size-8 items-center justify-center rounded bg-purple-50 text-purple-600">
                                        <FontAwesomeIcon
                                            icon={faClock}
                                            className="text-[12px]"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-[#A0A0A0] uppercase">
                                            Duración Planificada
                                        </p>
                                        <p className="font-medium text-[#1B3D6D]">
                                            {historia.duracion_meses} Meses (
                                            {historia.capitulos.length}{' '}
                                            Capítulos creados)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                                    <div className="flex size-8 items-center justify-center rounded bg-green-50 text-[#12A05B]">
                                        <FontAwesomeIcon
                                            icon={faTags}
                                            className="text-[12px]"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-[#A0A0A0] uppercase">
                                            Precio Base
                                        </p>
                                        <p className="font-medium text-[#1B3D6D]">
                                            $
                                            {Number(
                                                historia.precio_base,
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gallery Quick View */}
                        <div className="rounded-xl border border-[#F3F4F6] bg-white p-6 shadow-sm">
                            <h3 className="mb-4 flex items-center gap-2 text-[14px] font-bold text-[#1B3D6D]">
                                <FontAwesomeIcon
                                    icon={faImage}
                                    className="text-[12px]"
                                />
                                Galería Multimedia
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {historia.galeria.map((img: any, i: number) => (
                                    <div
                                        key={i}
                                        className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-gray-100"
                                    >
                                        <img
                                            src={img.path}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                        />
                                        {img.es_principal && (
                                            <div className="absolute top-1 right-1">
                                                <FontAwesomeIcon
                                                    icon={faCheckCircle}
                                                    className="rounded-full bg-white text-[10px] text-green-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Chapters Table */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="overflow-hidden rounded-xl border border-[#F3F4F6] bg-white shadow-sm">
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#F3F4F6] bg-white px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#1B3D6D]/5 text-[#1B3D6D]">
                                        <FontAwesomeIcon
                                            icon={faNewspaper}
                                            className="text-lg"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-[16px] font-bold text-[#1B3D6D]">
                                            Capítulos de la historia
                                        </h2>
                                        <p className="text-[12px] text-[#7B7B7B]">
                                            Gestiona el contenido episódico
                                            mensual
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setCapituloToEdit(null);
                                        setIsCapituloModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 rounded-md bg-[#1B3D6D] px-4 py-2.5 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-[#1B3D6D]/90 active:scale-95"
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="text-[11px]"
                                    />
                                    <span>Agregar Capítulo</span>
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                                            <th className="w-[80px] px-6 py-4 text-[11px] font-bold tracking-wider text-[#7B7B7B] uppercase">
                                                Orden
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-[#7B7B7B] uppercase">
                                                Título de la Parte
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-[#7B7B7B] uppercase">
                                                Estatus
                                            </th>
                                            <th className="px-6 py-4 text-right text-[11px] font-bold tracking-wider text-[#7B7B7B] uppercase">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F3F4F6]">
                                        {historia.capitulos.length > 0 ? (
                                            historia.capitulos.map(
                                                (cap: HistoriaCapitulo) => (
                                                    <tr
                                                        key={cap.id}
                                                        className="group transition-colors hover:bg-gray-50/50"
                                                    >
                                                        <td className="px-6 py-4 text-sm font-bold text-[#1B3D6D]">
                                                            #{cap.orden}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-[13.5px] font-semibold text-[#111827]">
                                                                    {cap.titulo}
                                                                </span>
                                                                <span className="max-w-[300px] truncate text-[12px] text-[#7B7B7B]">
                                                                    {cap.texto
                                                                        .replace(
                                                                            /<[^>]*>/g,
                                                                            '',
                                                                        )
                                                                        .substring(
                                                                            0,
                                                                            80,
                                                                        )}
                                                                    ...
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold tracking-tight ${cap.estado === 'activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#FFFBEB] text-[#D97706]'}`}
                                                            >
                                                                {cap.estado.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setCapituloToEdit(
                                                                            cap,
                                                                        );
                                                                        setIsCapituloModalOpen(
                                                                            true,
                                                                        );
                                                                    }}
                                                                    className="flex size-8 items-center justify-center rounded-md text-[#7B7B7B] transition-all hover:bg-[#1B3D6D]/5 hover:text-[#1B3D6D]"
                                                                    title="Editar"
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faEdit
                                                                        }
                                                                        className="text-sm"
                                                                    />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleToggleStatus(
                                                                            cap.id,
                                                                        )
                                                                    }
                                                                    className={`flex size-8 items-center justify-center rounded-md transition-all ${cap.estado === 'borrador' ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                                                                    title={
                                                                        cap.estado ===
                                                                        'borrador'
                                                                            ? 'Activar'
                                                                            : 'Pasar a Borrador'
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            cap.estado ===
                                                                            'borrador'
                                                                                ? faCheckCircle
                                                                                : faClock
                                                                        }
                                                                        className="text-sm"
                                                                    />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        setDeleteCapituloId(
                                                                            cap.id,
                                                                        )
                                                                    }
                                                                    className="flex size-8 items-center justify-center rounded-md text-red-100 transition-all hover:bg-red-50 hover:text-red-600"
                                                                    title="Eliminar"
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faTrash
                                                                        }
                                                                        className="text-sm"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-6 py-12 text-center"
                                                >
                                                    <div className="flex flex-col items-center gap-2 opacity-40">
                                                        <FontAwesomeIcon
                                                            icon={faNewspaper}
                                                            className="text-3xl text-gray-400"
                                                        />
                                                        <p className="text-sm text-gray-500">
                                                            Aún no hay capítulos
                                                            registrados.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Variants Section */}
                        <div className="rounded-xl border border-[#F3F4F6] bg-white p-6 shadow-sm">
                            <h3 className="mb-4 flex items-center gap-2 text-[14px] font-bold text-[#1B3D6D]">
                                <FontAwesomeIcon
                                    icon={faTags}
                                    className="text-[12px]"
                                />
                                Variantes
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {historia.variantes.map(
                                    (v: {
                                        id: number;
                                        tipo?: string;
                                        valor?: string | null;
                                    }) => {
                                        const tipoLabel =
                                            v.tipo === 'color'
                                                ? 'Color'
                                                : 'Papel';
                                        const valorTexto =
                                            (v.valor ?? '').trim() || '—';
                                        const hexOk =
                                            v.tipo === 'color' &&
                                            /^#[0-9A-Fa-f]{6}$/i.test(
                                                (v.valor ?? '').trim(),
                                            );

                                        return (
                                            <div
                                                key={v.id}
                                                className="group flex items-center justify-between gap-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB]/50 p-4 transition-all hover:border-[#1B3D6D]/10"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold break-words text-[#111827]">
                                                        {valorTexto}
                                                    </p>
                                                    <p className="text-[11px] font-bold tracking-widest text-[#7B7B7B] uppercase">
                                                        {tipoLabel}
                                                    </p>
                                                </div>
                                                {hexOk ? (
                                                    <div
                                                        className="size-10 shrink-0 rounded-md border border-[#E5E7EB] shadow-inner"
                                                        style={{
                                                            backgroundColor: (
                                                                v.valor ?? ''
                                                            ).trim(),
                                                        }}
                                                        title={(
                                                            v.valor ?? ''
                                                        ).trim()}
                                                    />
                                                ) : (
                                                    <span className="text-[11px] text-[#A0A0A0]">
                                                        —
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Capítulo Modal */}
            <CapituloModal
                isOpen={isCapituloModalOpen}
                onClose={() => {
                    setIsCapituloModalOpen(false);
                    setCapituloToEdit(null);
                }}
                historiaId={historia.id}
                capituloToEdit={capituloToEdit}
            />

            <ConfirmDialog
                isOpen={deleteCapituloId !== null}
                onOpenChange={(open) => !open && setDeleteCapituloId(null)}
                onConfirm={handleDeleteCapitulo}
                title="Eliminar Capítulo"
                description="¿Estás seguro de que deseas eliminar este capítulo? Esta acción eliminará permanentemente el contenido."
            />
        </UserLayout>
    );
}

// Modal Component for Chapters
function CapituloModal({
    isOpen,
    onClose,
    historiaId,
    capituloToEdit,
}: {
    isOpen: boolean;
    onClose: () => void;
    historiaId: number;
    capituloToEdit: HistoriaCapitulo | null;
}) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        titulo: '',
        texto: '',
        estado: 'borrador' as 'borrador' | 'activo',
    });

    React.useEffect(() => {
        if (capituloToEdit && isOpen) {
            setData({
                titulo: capituloToEdit.titulo,
                texto: capituloToEdit.texto,
                estado: capituloToEdit.estado,
            });
        } else if (!capituloToEdit && isOpen) {
            reset();
        }
    }, [capituloToEdit, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (capituloToEdit) {
            patch(`/admin/capitulos/${capituloToEdit.id}`, {
                onSuccess: () => onClose(),
            });
        } else {
            post(`/admin/historias/${historiaId}/capitulos`, {
                onSuccess: () => onClose(),
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B3D6D]/40 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-3xl animate-in overflow-hidden rounded-lg bg-white shadow-2xl duration-200 fade-in zoom-in">
                <div className="flex items-center justify-between border-b border-[#F3F4F6] px-6 py-4">
                    <h2 className="text-[16px] font-bold text-[#1B3D6D]">
                        {capituloToEdit
                            ? 'Editar Capítulo'
                            : 'Agregar Nuevo Capítulo'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#A0A0A0] transition-colors hover:text-[#1B3D6D]"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#1B3D6D]">
                            Título de la Parte / Capítulo
                            <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
                            placeholder="Ej: Capítulo 1: El Despertar"
                            className={`w-full rounded-[4px] border ${errors.titulo ? 'border-red-500' : 'border-[#DFE4EA]'} bg-white px-3 py-2.5 text-[14px] text-gray-800 transition-all outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15`}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#1B3D6D]">
                            Contenido del Capítulo
                            <span className="text-[#EF4444]">*</span>
                        </label>
                        <div className="overflow-hidden rounded-[4px] border border-[#DFE4EA]">
                            {/* Toolbar Simplificado */}
                            <div className="flex items-center gap-1.5 border-b border-[#DFE4EA]/50 bg-[#F9FAFB] px-3 py-2">
                                <button
                                    type="button"
                                    className="flex h-8 w-8 items-center justify-center rounded text-[#4B5563] transition-all hover:bg-white hover:text-[#1B3D6D]"
                                >
                                    <FontAwesomeIcon
                                        icon={faBold}
                                        className="text-[12px]"
                                    />
                                </button>
                                <button
                                    type="button"
                                    className="flex h-8 w-8 items-center justify-center rounded text-[#4B5563] transition-all hover:bg-white hover:text-[#1B3D6D]"
                                >
                                    <FontAwesomeIcon
                                        icon={faItalic}
                                        className="text-[12px]"
                                    />
                                </button>
                                <button
                                    type="button"
                                    className="flex h-8 w-8 items-center justify-center rounded text-[#4B5563] transition-all hover:bg-white hover:text-[#1B3D6D]"
                                >
                                    <FontAwesomeIcon
                                        icon={faUnderline}
                                        className="text-[12px]"
                                    />
                                </button>
                                <div className="mx-1 h-4 w-[1px] bg-[#DFE4EA]"></div>
                                <button
                                    type="button"
                                    className="flex h-8 w-8 items-center justify-center rounded text-[#4B5563] transition-all hover:bg-white hover:text-[#1B3D6D]"
                                >
                                    <FontAwesomeIcon
                                        icon={faListUl}
                                        className="text-[12px]"
                                    />
                                </button>
                            </div>
                            <textarea
                                value={data.texto}
                                onChange={(e) =>
                                    setData('texto', e.target.value)
                                }
                                rows={12}
                                className="min-h-[300px] w-full resize-y px-4 py-3 text-[14px] text-gray-700 outline-none"
                                placeholder="Escribe aquí el contenido del capítulo..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-2">
                        <label className="text-[13px] font-semibold text-[#1B3D6D]">
                            Estado de publicación:
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="group flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    name="estado_cap"
                                    checked={data.estado === 'borrador'}
                                    onChange={() =>
                                        setData('estado', 'borrador')
                                    }
                                    className="accent-[#1B3D6D]"
                                />
                                <span className="text-[13px] text-[#4B5563] group-hover:text-[#1B3D6D]">
                                    Borrador
                                </span>
                            </label>
                            <label className="group flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    name="estado_cap"
                                    checked={data.estado === 'activo'}
                                    onChange={() => setData('estado', 'activo')}
                                    className="accent-[#1B3D6D]"
                                />
                                <span className="text-[13px] text-[#4B5563] group-hover:text-[#1B3D6D]">
                                    Activo / Publicar
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-[#F3F4F6] pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-[13px] font-bold text-[#7B7B7B] transition-all hover:text-[#1B3D6D]"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-[#1B3D6D] px-8 py-2.5 text-[13px] font-bold text-white shadow-md transition-all hover:bg-[#1B3D6D]/90 active:scale-95 disabled:opacity-50"
                        >
                            {capituloToEdit
                                ? 'Guardar Cambios'
                                : 'Crear Capítulo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
