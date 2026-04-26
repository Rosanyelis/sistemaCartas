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
    faEye
} from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

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
    const [capituloToEdit, setCapituloToEdit] = useState<HistoriaCapitulo | null>(null);
    const [deleteCapituloId, setDeleteCapituloId] = useState<number | null>(null);

    const handleBack = () => {
        router.get('/admin/historias');
    };

    const handleToggleStatus = (id: number) => {
        router.patch(`/admin/capitulos/${id}/toggle-status`, {}, { preserveScroll: true });
    };

    const handleDeleteCapitulo = () => {
        if (deleteCapituloId) {
            router.delete(`/admin/capitulos/${deleteCapituloId}`, {
                preserveScroll: true,
                onSuccess: () => setDeleteCapituloId(null)
            });
        }
    };

    return (
        <UserLayout title={`Detalle: ${historia.nombre}`}>
            <Head title={`Admin - ${historia.nombre}`} />

            <div className="flex flex-col gap-6 px-4 md:px-8 py-8 font-['Inter'] max-w-7xl mx-auto w-full">
                {/* Upper Navigation */}
                <div className="flex items-center justify-between">
                    <button 
                        onClick={handleBack}
                        className="flex items-center gap-2 text-[#7B7B7B] hover:text-[#1B3D6D] transition-colors group"
                    >
                        <div className="size-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#1B3D6D]/30 group-hover:bg-[#1B3D6D]/5">
                            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                        </div>
                        <span className="text-sm font-semibold text-[#1B3D6D]">Volver a Historias</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider shadow-sm
                            ${historia.estado === 'activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#E0F2FE] text-[#0284C7]'}`}>
                            {historia.estado}
                        </span>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Data & Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-[#F3F4F6] overflow-hidden">
                            <div className="relative h-48">
                                <img src={historia.imagen || '/images/placeholder.svg'} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-6 flex-col justify-end">
                                    <h1 className="text-white text-xl font-bold">{historia.nombre}</h1>
                                    <p className="text-white/80 text-xs font-medium">{historia.categoria}</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                                    <div className="size-8 rounded bg-blue-50 flex items-center justify-center text-[#1B3D6D]">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-[12px]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-widest">Publicado</p>
                                        <p className="font-medium text-[#1B3D6D]">{new Date(historia.fecha_publicacion).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                                    <div className="size-8 rounded bg-purple-50 flex items-center justify-center text-purple-600">
                                        <FontAwesomeIcon icon={faClock} className="text-[12px]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-widest">Duración Planificada</p>
                                        <p className="font-medium text-[#1B3D6D]">{historia.duracion_meses} Meses ({historia.capitulos.length} Capítulos creados)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                                    <div className="size-8 rounded bg-green-50 flex items-center justify-center text-[#12A05B]">
                                        <FontAwesomeIcon icon={faTags} className="text-[12px]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-widest">Precio Base</p>
                                        <p className="font-medium text-[#1B3D6D]">${Number(historia.precio_base).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gallery Quick View */}
                        <div className="bg-white rounded-xl shadow-sm border border-[#F3F4F6] p-6">
                            <h3 className="text-[14px] font-bold text-[#1B3D6D] mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faImage} className="text-[12px]" />
                                Galería Multimedia
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {historia.galeria.map((img: any, i: number) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100 relative group cursor-pointer">
                                        <img src={img.path} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        {img.es_principal && (
                                            <div className="absolute top-1 right-1">
                                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 bg-white rounded-full text-[10px]" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Chapters Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-[#F3F4F6] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#F3F4F6] flex items-center justify-between bg-white sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-[#1B3D6D]/5 flex items-center justify-center text-[#1B3D6D]">
                                        <FontAwesomeIcon icon={faNewspaper} className="text-lg" />
                                    </div>
                                    <div>
                                        <h2 className="text-[16px] font-bold text-[#1B3D6D]">Capítulos de la historia</h2>
                                        <p className="text-[12px] text-[#7B7B7B]">Gestiona el contenido episódico mensual</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        setCapituloToEdit(null);
                                        setIsCapituloModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 rounded-md bg-[#1B3D6D] px-4 py-2.5 text-[13px] font-bold text-white shadow-sm hover:bg-[#1B3D6D]/90 transition-all active:scale-95"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="text-[11px]" />
                                    <span>Agregar Capítulo</span>
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#F9FAFB] border-b border-[#F3F4F6]">
                                            <th className="px-6 py-4 text-[11px] font-bold text-[#7B7B7B] uppercase tracking-wider w-[80px]">Orden</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-[#7B7B7B] uppercase tracking-wider">Título de la Parte</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-[#7B7B7B] uppercase tracking-wider">Estatus</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-[#7B7B7B] uppercase tracking-wider text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F3F4F6]">
                                        {historia.capitulos.length > 0 ? (
                                            historia.capitulos.map((cap: HistoriaCapitulo) => (
                                                <tr key={cap.id} className="group hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-bold text-[#1B3D6D]">
                                                        #{cap.orden}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[13.5px] font-semibold text-[#111827]">{cap.titulo}</span>
                                                            <span className="text-[12px] text-[#7B7B7B] truncate max-w-[300px]">
                                                                {cap.texto.replace(/<[^>]*>/g, '').substring(0, 80)}...
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-tight
                                                            ${cap.estado === 'activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#FFFBEB] text-[#D97706]'}`}>
                                                            {cap.estado.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    setCapituloToEdit(cap);
                                                                    setIsCapituloModalOpen(true);
                                                                }}
                                                                className="size-8 flex items-center justify-center text-[#7B7B7B] hover:text-[#1B3D6D] hover:bg-[#1B3D6D]/5 rounded-md transition-all"
                                                                title="Editar"
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleToggleStatus(cap.id)}
                                                                className={`size-8 flex items-center justify-center rounded-md transition-all
                                                                    ${cap.estado === 'borrador' ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                                                                title={cap.estado === 'borrador' ? 'Activar' : 'Pasar a Borrador'}
                                                            >
                                                                <FontAwesomeIcon icon={cap.estado === 'borrador' ? faCheckCircle : faClock} className="text-sm" />
                                                            </button>
                                                            <button 
                                                                onClick={() => setDeleteCapituloId(cap.id)}
                                                                className="size-8 flex items-center justify-center text-red-100 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                                                title="Eliminar"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-2 opacity-40">
                                                        <FontAwesomeIcon icon={faNewspaper} className="text-3xl text-gray-400" />
                                                        <p className="text-sm text-gray-500">Aún no hay capítulos registrados.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Variants Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-[#F3F4F6] p-6">
                            <h3 className="text-[14px] font-bold text-[#1B3D6D] mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faTags} className="text-[12px]" />
                                Variantes
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {historia.variantes.map((v: { id: number; tipo?: string; valor?: string | null }) => {
                                    const tipoLabel = v.tipo === 'color' ? 'Color' : 'Papel';
                                    const valorTexto = (v.valor ?? '').trim() || '—';
                                    const hexOk =
                                        v.tipo === 'color' && /^#[0-9A-Fa-f]{6}$/i.test((v.valor ?? '').trim());

                                    return (
                                    <div
                                        key={v.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB]/50 p-4 transition-all group hover:border-[#1B3D6D]/10"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-[#111827] break-words">
                                                {valorTexto}
                                            </p>
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-[#7B7B7B]">
                                                {tipoLabel}
                                            </p>
                                        </div>
                                        {hexOk ? (
                                            <div
                                                className="size-10 shrink-0 rounded-md border border-[#E5E7EB] shadow-inner"
                                                style={{ backgroundColor: (v.valor ?? '').trim() }}
                                                title={(v.valor ?? '').trim()}
                                            />
                                        ) : (
                                            <span className="text-[11px] text-[#A0A0A0]">—</span>
                                        )}
                                    </div>
                                    );
                                })}
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
function CapituloModal({ isOpen, onClose, historiaId, capituloToEdit }: { isOpen: boolean, onClose: () => void, historiaId: number, capituloToEdit: HistoriaCapitulo | null }) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        titulo: '',
        texto: '',
        estado: 'borrador' as 'borrador' | 'activo'
    });

    React.useEffect(() => {
        if (capituloToEdit && isOpen) {
            setData({
                titulo: capituloToEdit.titulo,
                texto: capituloToEdit.texto,
                estado: capituloToEdit.estado
            });
        } else if (!capituloToEdit && isOpen) {
            reset();
        }
    }, [capituloToEdit, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (capituloToEdit) {
            patch(`/admin/capitulos/${capituloToEdit.id}`, {
                onSuccess: () => onClose()
            });
        } else {
            post(`/admin/historias/${historiaId}/capitulos`, {
                onSuccess: () => onClose()
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B3D6D]/40 backdrop-blur-[2px] p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
                    <h2 className="text-[16px] font-bold text-[#1B3D6D]">{capituloToEdit ? 'Editar Capítulo' : 'Agregar Nuevo Capítulo'}</h2>
                    <button onClick={onClose} className="text-[#A0A0A0] hover:text-[#1B3D6D] transition-colors"><FontAwesomeIcon icon={faTimes} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#1B3D6D]">Título de la Parte / Capítulo<span className="text-[#EF4444]">*</span></label>
                        <input 
                            type="text" 
                            value={data.titulo}
                            onChange={e => setData('titulo', e.target.value)}
                            placeholder="Ej: Capítulo 1: El Despertar"
                            className={`w-full rounded-[4px] border ${errors.titulo ? 'border-red-500' : 'border-[#DFE4EA]'} bg-white px-3 py-2.5 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15 outline-none transition-all`}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-[#1B3D6D]">Contenido del Capítulo<span className="text-[#EF4444]">*</span></label>
                        <div className="rounded-[4px] border border-[#DFE4EA] overflow-hidden">
                            {/* Toolbar Simplificado */}
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F9FAFB] border-b border-[#DFE4EA]/50">
                                <button type="button" className="w-8 h-8 flex items-center justify-center text-[#4B5563] hover:text-[#1B3D6D] hover:bg-white rounded transition-all"><FontAwesomeIcon icon={faBold} className="text-[12px]" /></button>
                                <button type="button" className="w-8 h-8 flex items-center justify-center text-[#4B5563] hover:text-[#1B3D6D] hover:bg-white rounded transition-all"><FontAwesomeIcon icon={faItalic} className="text-[12px]" /></button>
                                <button type="button" className="w-8 h-8 flex items-center justify-center text-[#4B5563] hover:text-[#1B3D6D] hover:bg-white rounded transition-all"><FontAwesomeIcon icon={faUnderline} className="text-[12px]" /></button>
                                <div className="w-[1px] h-4 bg-[#DFE4EA] mx-1"></div>
                                <button type="button" className="w-8 h-8 flex items-center justify-center text-[#4B5563] hover:text-[#1B3D6D] hover:bg-white rounded transition-all"><FontAwesomeIcon icon={faListUl} className="text-[12px]" /></button>
                            </div>
                            <textarea 
                                value={data.texto}
                                onChange={e => setData('texto', e.target.value)}
                                rows={12}
                                className="w-full px-4 py-3 text-[14px] text-gray-700 outline-none resize-y min-h-[300px]"
                                placeholder="Escribe aquí el contenido del capítulo..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-2">
                        <label className="text-[13px] font-semibold text-[#1B3D6D]">Estado de publicación:</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="estado_cap" 
                                    checked={data.estado === 'borrador'} 
                                    onChange={() => setData('estado', 'borrador')}
                                    className="accent-[#1B3D6D]"
                                />
                                <span className="text-[13px] text-[#4B5563] group-hover:text-[#1B3D6D]">Borrador</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="estado_cap" 
                                    checked={data.estado === 'activo'} 
                                    onChange={() => setData('estado', 'activo')}
                                    className="accent-[#1B3D6D]"
                                />
                                <span className="text-[13px] text-[#4B5563] group-hover:text-[#1B3D6D]">Activo / Publicar</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#F3F4F6]">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-[13px] font-bold text-[#7B7B7B] hover:text-[#1B3D6D] transition-all">Cancelar</button>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="px-8 py-2.5 bg-[#1B3D6D] text-white rounded-md text-[13px] font-bold shadow-md hover:bg-[#1B3D6D]/90 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {capituloToEdit ? 'Guardar Cambios' : 'Crear Capítulo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
