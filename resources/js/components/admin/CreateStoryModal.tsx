import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@inertiajs/react';
import { useEffect, useId, useMemo, useState } from 'react';
import { AdminFormSidePanel } from '@/components/admin/AdminFormSidePanel';
import { HISTORIA_DETALLE_INCLUSION_ICONS } from '@/constants/historia-detalle-inclusion-icons';
import {
    MAX_IMAGEN_BYTES,
    MENSAJE_MAX_IMAGEN,
    pickGalleryFiles,
    validateMediaFileSize,
} from '@/components/admin/constants/media-limits';
import { MAX_PALABRAS_TEXTO_LARGO } from './create-story/constants';
import { buildHistoriaFormData } from './create-story/formDefaults';
import { HistoriaDetalleInclusionsEditor } from './create-story/HistoriaDetalleInclusionsEditor';
import { HistoriaMultimediaPanel } from './create-story/HistoriaMultimediaPanel';
import { LimitedWordRichEditor } from './create-story/LimitedWordRichEditor';
import type { GallerySlot, HistoriaParaFormulario } from './create-story/types';
import { store as historiasStore, update as historiasUpdate } from '@/routes/admin/historias';

type CategoriaOption = { id: number; nombre: string };

interface CreateStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    categorias: CategoriaOption[];
    storyToEdit?: HistoriaParaFormulario | null;
    onOpenCategoriaManage?: () => void;
}

const inputClass = (hasError: boolean) =>
    `w-full rounded-[4px] border ${hasError ? 'border-red-500' : 'border-[#DFE4EA]'} bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all`;

/**
 * Modal crear/editar historia: estado con Inertia `useForm`, secciones en subcomponentes
 * y descripción larga con editor enriquecido (HTML). «Qué incluye cada envío» se edita como lista JSON en `detalle`.
 */
export function CreateStoryModal({
    isOpen,
    onClose,
    categorias,
    storyToEdit,
    onOpenCategoriaManage,
}: CreateStoryModalProps) {
    const rootId = useId();
    const descripcionLargaId = `${rootId}-descripcion-larga`;
    const estadoRadioName = `${rootId}-estado`;
    const destacadaRadioName = `${rootId}-destacada`;

    const initialForm = useMemo(() => buildHistoriaFormData(), []);
    const { data, setData, post, processing, errors, reset, transform } = useForm(initialForm);

    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [galleryItems, setGalleryItems] = useState<GallerySlot[]>([]);
    const [galeriaLimitMessage, setGaleriaLimitMessage] = useState<string | null>(null);
    const [videoClientError, setVideoClientError] = useState<string | null>(null);
    const [imagenClientError, setImagenClientError] = useState<string | null>(null);
    /** Contenido inicial de los editores ricos solo tras hidratar en `useEffect` (evita flash vacío). */
    const [richEditors, setRichEditors] = useState<{
        seed: number;
        descripcion_larga: string;
    } | null>(null);

    /** Al abrir el modal se hidrata desde `storyToEdit` o se limpia para creación. */
    /* eslint-disable react-hooks/set-state-in-effect -- sincronizar previews y formulario al abrir el modal */
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (storyToEdit) {
            const next = buildHistoriaFormData(storyToEdit);
            setData(next);
            setImgPreview(storyToEdit.imagen ?? null);
            setVideoPreview(storyToEdit.video ?? null);
            const extras = (storyToEdit.galeria ?? []).filter((g) => !g.es_principal);
            setGalleryItems(
                extras.map((g) => ({
                    kind: 'existente' as const,
                    id: g.id,
                    preview: g.path,
                })),
            );
            setGaleriaLimitMessage(null);
            setVideoClientError(null);
            setImagenClientError(null);
            setImagenClientError(null);
            setRichEditors({
                seed: Date.now(),
                descripcion_larga: next.descripcion_larga,
            });
        } else {
            reset();
            setImgPreview(null);
            setVideoPreview(null);
            setGalleryItems([]);
            setGaleriaLimitMessage(null);
            setVideoClientError(null);
            setImagenClientError(null);
            setImagenClientError(null);
            const next = buildHistoriaFormData();
            setRichEditors({
                seed: Date.now(),
                descripcion_larga: next.descripcion_larga,
            });
        }
    }, [storyToEdit, isOpen, setData, reset]);
    /* eslint-enable react-hooks/set-state-in-effect */

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'imagen' | 'video') => {
        const file = e.target.files?.[0];
        e.target.value = '';

        if (!file) {
            return;
        }

        if (field === 'imagen') {
            const sizeError = validateMediaFileSize(
                file,
                MAX_IMAGEN_BYTES,
                MENSAJE_MAX_IMAGEN,
            );
            if (sizeError) {
                setImagenClientError(sizeError);
                return;
            }
            setImagenClientError(null);
        } else {
            const allowedTypes = ['video/mp4', 'video/quicktime'];
            if (!allowedTypes.includes(file.type)) {
                setVideoClientError('El video debe ser MP4 o MOV.');
                return;
            }
            setVideoClientError(null);
        }

        setData(field, file);
        const reader = new FileReader();
        reader.onloadend = () => {
            if (field === 'imagen') {
                setImgPreview(reader.result as string);
            } else {
                setVideoPreview(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files: slice, limitMessage } = pickGalleryFiles(
            Array.from(e.target.files || []),
            galleryItems.length,
            { imagesOnly: true },
        );

        e.target.value = '';
        setGaleriaLimitMessage(limitMessage);

        if (slice.length === 0) {
            return;
        }

        for (const file of slice) {
            const sizeError = validateMediaFileSize(
                file,
                MAX_IMAGEN_BYTES,
                MENSAJE_MAX_IMAGEN,
            );
            if (sizeError) {
                setGaleriaLimitMessage(sizeError);
                return;
            }
        }

        void Promise.all(
            slice.map(
                (file) =>
                    new Promise<{ file: File; preview: string }>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve({ file, preview: reader.result as string });
                        reader.onerror = () => reject(reader.error);
                        reader.readAsDataURL(file);
                    }),
            ),
        ).then((read) => {
            setGalleryItems((prev) => [
                ...prev,
                ...read.map((item) => ({
                    kind: 'nuevo' as const,
                    clientKey: `nuevo-${item.file.name}-${item.file.size}-${item.file.lastModified}-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`}`,
                    file: item.file,
                    preview: item.preview,
                })),
            ]);
        });
    };

    const removeGalleryImage = (index: number) => {
        setGalleryItems((prev) => prev.filter((_, i) => i !== index));
        setGaleriaLimitMessage(null);
    };

    const submitHistoria = () => {
        transform((form) => {
            const dm = parseInt(String(form.duracion_meses), 10);
            const duracion_meses =
                Number.isFinite(dm) && dm >= 1 ? String(dm) : '12';
            const nuevos = galleryItems.filter((x): x is Extract<GallerySlot, { kind: 'nuevo' }> => x.kind === 'nuevo');
            const files = nuevos.map((x) => x.file);
            const allowedIcons = new Set<string>(HISTORIA_DETALLE_INCLUSION_ICONS);
            const detalleCleaned = (Array.isArray(form.detalle) ? form.detalle : [])
                .filter((r) => r.title.trim() !== '')
                .map((r) => {
                    const d = r.description.trim();
                    const iconResolved =
                        r.icon && allowedIcons.has(r.icon) ? r.icon : 'FileText';
                    const item: { icon: string; title: string; description?: string } = {
                        icon: iconResolved,
                        title: r.title.trim(),
                    };

                    if (d !== '') {
                        item.description = d;
                    }

                    return item;
                });
            const next = {
                ...form,
                duracion_meses,
                galeria: files,
                detalle: JSON.stringify(detalleCleaned),
            };

            if (storyToEdit?.id != null) {
                const keepIds = galleryItems
                    .filter((x): x is Extract<GallerySlot, { kind: 'existente' }> => x.kind === 'existente')
                    .map((x) => x.id);

                return {
                    ...next,
                    _method: 'patch' as const,
                    historia_gallery_sync: true,
                    galeria_keep_ids: keepIds,
                };
            }

            return next;
        });

        const visitOptions = {
            preserveScroll: true,
            preserveState: true,
            forceFormData: true,
            onSuccess: () => {
                setRichEditors(null);
                reset();
                onClose();
            },
        };

        if (storyToEdit?.id != null) {
            post(historiasUpdate.url(storyToEdit.id), visitOptions);

            return;
        }

        post(historiasStore.url(), visitOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitHistoria();
    };

    const handleOpenCategoriaManage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onOpenCategoriaManage?.();
    };

    const handleClose = () => {
        setRichEditors(null);
        reset();
        onClose();
    };

    return (
        <AdminFormSidePanel
            open={isOpen}
            onClose={handleClose}
            title={storyToEdit ? 'Editar Historia' : 'Crear Historia'}
        >
                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="custom-scrollbar flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                        Nombre de la historia<span className="text-[#EF4444]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nombre}
                                        onChange={(ev) => setData('nombre', ev.target.value)}
                                        placeholder="Historia en Londres"
                                        className={inputClass(Boolean(errors.nombre))}
                                    />
                                    {errors.nombre && <span className="text-red-500 text-[11px]">{errors.nombre}</span>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                        Descripción corta<span className="text-[#EF4444]">*</span>
                                    </label>
                                    <textarea
                                        value={data.descripcion_corta}
                                        onChange={(ev) => setData('descripcion_corta', ev.target.value)}
                                        placeholder="Una apasionante aventura"
                                        rows={2}
                                        className={`${inputClass(Boolean(errors.descripcion_corta))} resize-none`}
                                    />
                                    {errors.descripcion_corta ? (
                                        <span className="text-red-500 text-[11px]">{errors.descripcion_corta}</span>
                                    ) : (
                                        <span className="text-[11.5px] text-[#A0A0A0]">
                                            Se mostrará en la sección principal de historias
                                        </span>
                                    )}
                                </div>

                                {richEditors ? (
                                    <>
                                        <LimitedWordRichEditor
                                            key={`descripcion-larga-${richEditors.seed}`}
                                            id={descripcionLargaId}
                                            label={
                                                <>
                                                    Descripción larga<span className="text-[#EF4444]">*</span>
                                                </>
                                            }
                                            initialHtml={richEditors.descripcion_larga}
                                            onChange={(v) => setData('descripcion_larga', v)}
                                            maxWords={MAX_PALABRAS_TEXTO_LARGO}
                                            placeholder="Una apasionante aventura por los rincones del Londres..."
                                            rows={5}
                                            error={errors.descripcion_larga}
                                        />
                                    </>
                                ) : null}

                                <HistoriaDetalleInclusionsEditor
                                    items={data.detalle}
                                    onChange={(items) => setData('detalle', items)}
                                    errors={errors as Record<string, string | string[] | undefined>}
                                    rootId={rootId}
                                />

                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <label htmlFor={`${rootId}-categoria`} className="text-[13px] font-semibold text-[#1B3D6D]">
                                            Categoría<span className="text-[#EF4444]">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            title="Gestionar categorías"
                                            onClick={handleOpenCategoriaManage}
                                            className="inline-flex size-7 items-center justify-center text-[#1B3D6D] hover:bg-[#F9FAFB]"
                                        >
                                            <FontAwesomeIcon icon={faPencil} className="text-[11px]" />
                                        </button>
                                    </div>
                                    <select
                                        id={`${rootId}-categoria`}
                                        value={data.historia_categoria_id === '' ? '' : String(data.historia_categoria_id)}
                                        onChange={(ev) => {
                                            const v = ev.target.value;
                                            setData('historia_categoria_id', v === '' ? '' : v);
                                        }}
                                        className={inputClass(Boolean(errors.historia_categoria_id))}
                                    >
                                        <option value="">Seleccione una categoría</option>
                                        {categorias.map((c) => (
                                            <option key={c.id} value={String(c.id)}>
                                                {c.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.historia_categoria_id && (
                                        <span className="text-red-500 text-[11px]">{errors.historia_categoria_id}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                        Autor<span className="text-[#EF4444]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.autor}
                                        onChange={(ev) => setData('autor', ev.target.value)}
                                        placeholder="Laura Pérez"
                                        className={inputClass(Boolean(errors.autor))}
                                    />
                                    {errors.autor && <span className="text-red-500 text-[11px]">{errors.autor}</span>}
                                </div>

                                <div className="flex flex-col gap-4 mt-2">
                                    <h3 className="text-[14px] font-bold text-[#1B3D6D]">Inventario</h3>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                            Código de historia<span className="text-[#EF4444]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.codigo}
                                            onChange={(ev) => setData('codigo', ev.target.value)}
                                            placeholder="HST-135790"
                                            className={inputClass(Boolean(errors.codigo))}
                                        />
                                        {errors.codigo && <span className="text-red-500 text-[11px]">{errors.codigo}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                            Duración (meses)<span className="text-[#EF4444]">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            step={1}
                                            value={data.duracion_meses}
                                            onChange={(ev) => setData('duracion_meses', ev.target.value)}
                                            onBlur={() => {
                                                const n = parseInt(data.duracion_meses, 10);

                                                if (!Number.isFinite(n) || n < 1) {
                                                    setData('duracion_meses', '12');
                                                }
                                            }}
                                            placeholder="12"
                                            className={inputClass(Boolean(errors.duracion_meses))}
                                        />
                                        {errors.duracion_meses && (
                                            <span className="text-red-500 text-[11px]">{errors.duracion_meses}</span>
                                        )}
                                    </div>
                                </div>

                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                        Precio Base<span className="text-[#EF4444]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.precio_base}
                                        onChange={(ev) => setData('precio_base', ev.target.value)}
                                        placeholder="25.00"
                                        className={inputClass(Boolean(errors.precio_base))}
                                    />
                                    {errors.precio_base && <span className="text-red-500 text-[11px]">{errors.precio_base}</span>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">Precio promocional</label>
                                    <input
                                        type="text"
                                        value={data.precio_promocional}
                                        onChange={(ev) => setData('precio_promocional', ev.target.value)}
                                        placeholder="0"
                                        className={inputClass(Boolean(errors.precio_promocional))}
                                    />
                                    {errors.precio_promocional && (
                                        <span className="text-red-500 text-[11px]">{errors.precio_promocional}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">Impuesto</label>
                                    <input
                                        type="text"
                                        value={data.impuesto}
                                        onChange={(ev) => setData('impuesto', ev.target.value)}
                                        placeholder="16"
                                        className={inputClass(Boolean(errors.impuesto))}
                                    />
                                    {errors.impuesto ? (
                                        <span className="text-red-500 text-[11px]">{errors.impuesto}</span>
                                    ) : (
                                        <span className="text-[11.5px] text-[#A0A0A0]">
                                            IVA aplicado en tienda: 16&nbsp;%
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-4 mt-2">
                                    <h3 className="text-[14px] font-bold text-[#1B3D6D]">Información de envío</h3>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-semibold text-[#1B3D6D]">Peso</label>
                                        <input
                                            type="text"
                                            value={data.peso}
                                            onChange={(ev) => setData('peso', ev.target.value)}
                                            placeholder="0kg"
                                            className={inputClass(Boolean(errors.peso))}
                                        />
                                        {errors.peso && <span className="text-red-500 text-[11px]">{errors.peso}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1.5 mt-1">
                                        <label className="text-[13px] font-semibold text-[#1B3D6D]">Dimensiones</label>
                                        <input
                                            type="text"
                                            value={data.dimensiones}
                                            onChange={(ev) => setData('dimensiones', ev.target.value)}
                                            placeholder="0x0x0"
                                            className={inputClass(Boolean(errors.dimensiones))}
                                        />
                                        {errors.dimensiones && (
                                            <span className="text-red-500 text-[11px]">{errors.dimensiones}</span>
                                        )}
                                    </div>
                                </div>

                                <HistoriaMultimediaPanel
                                    imgPreview={imgPreview}
                                    videoPreview={videoPreview}
                                    galleryPreviews={galleryItems.map((g) => g.preview)}
                                    galleryPreviewKeys={galleryItems.map((g) =>
                                        g.kind === 'existente' ? `e-${g.id}` : g.clientKey,
                                    )}
                                    galeriaLength={galleryItems.length}
                                    estado={data.estado}
                                    estadoRadioName={estadoRadioName}
                                    onEstadoChange={(v) => setData('estado', v)}
                                    destacada={data.destacada}
                                    destacadaRadioName={destacadaRadioName}
                                    onDestacadaChange={(v) => setData('destacada', v)}
                                    onImageChange={(ev) => handleFileChange(ev, 'imagen')}
                                    onVideoChange={(ev) => handleFileChange(ev, 'video')}
                                    onGalleryChange={handleGalleryChange}
                                    onRemoveGalleryImage={removeGalleryImage}
                                    galeriaLimitMessage={galeriaLimitMessage}
                                    errors={{
                                        imagen: imagenClientError ?? errors.imagen,
                                        video: videoClientError ?? errors.video,
                                        galeria: errors.galeria,
                                        estado: errors.estado,
                                        destacada: errors.destacada,
                                    }}
                                    fieldIds={{
                                        imagen: `${rootId}-imagen`,
                                        video: `${rootId}-video`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="sticky bottom-0 mt-auto flex shrink-0 justify-end gap-3 border-t border-[#F3F4F6] bg-white px-6 py-4 md:px-8 md:py-5">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="py-[9px] px-[22px] rounded-[4px] border border-[#1B3D6D] text-[14px] font-semibold text-[#1B3D6D] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="py-[9px] px-[22px] rounded-[4px] bg-[#1B3D6D] text-[14px] font-semibold text-white shadow-sm hover:bg-[#1B3D6D]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing ? 'Guardando...' : 'Guardar Historia'}
                        </button>
                    </div>
                </form>
        </AdminFormSidePanel>
    );
}
