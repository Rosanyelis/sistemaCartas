import { faTimes, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router, useForm } from '@inertiajs/react';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ProductoMultimediaPanel } from '@/components/admin/create-product/ProductoMultimediaPanel';
import { MAX_IMAGENES_GALERIA, MAX_PALABRAS_TEXTO_LARGO } from '@/components/admin/create-story/constants';
import { normalizeDetalleInclusiones } from '@/components/admin/create-story/formDefaults';
import { HistoriaDetalleInclusionsEditor } from '@/components/admin/create-story/HistoriaDetalleInclusionsEditor';
import { LimitedWordRichEditor } from '@/components/admin/create-story/LimitedWordRichEditor';
import type { GallerySlot, HistoriaDetalleInclusionRow } from '@/components/admin/create-story/types';
import { ProductoTaxonomyManageModal } from '@/components/admin/ProductoTaxonomyManageModal';
import { HISTORIA_DETALLE_INCLUSION_ICONS } from '@/constants/historia-detalle-inclusion-icons';

export type CategoriaOption = {
    id: number;
    nombre: string;
};

type SubRow = { id: number; nombre: string };

export type ProductoModalFormData = {
    nombre: string;
    descripcion_corta: string;
    descripcion_larga: string;
    detalle: HistoriaDetalleInclusionRow[];
    producto_categoria_id: string | number;
    producto_subcategoria_id: string | number;
    precio_base: string;
    precio_promocional: string;
    impuesto: string;
    codigo: string;
    stock: number;
    peso: string;
    dimensiones: string;
    estado: string;
    imagen: File | null;
    video: File | null;
    galeria: File[];
    producto_gallery_sync?: boolean;
    galeria_keep_ids?: number[];
    _method?: 'patch';
};

type ProductoGaleriaJsonItem = {
    id: number;
    path: string;
    tipo: string;
    es_principal: boolean;
};

type ProductoFormularioJson = {
    nombre: string;
    descripcion_corta: string;
    descripcion_larga: string;
    detalle: HistoriaDetalleInclusionRow[] | string | null | unknown;
    producto_categoria_id: number;
    producto_subcategoria_id: number | null;
    precio_base: string;
    precio_promocional: string;
    impuesto: string;
    codigo: string;
    stock: number;
    imagen: string;
    video?: string;
    peso: string;
    dimensiones: string;
    estado: string;
    galeria?: ProductoGaleriaJsonItem[];
};

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    categorias: CategoriaOption[];
    /** Si se indica, el modal carga el producto y envía PATCH al guardar */
    editingProductId?: number | null;
}

export function CreateProductModal({
    isOpen,
    onClose,
    categorias,
    editingProductId = null,
}: CreateProductModalProps) {
    const rootId = useId();
    const descripcionLargaId = `${rootId}-descripcion-larga`;
    const estadoRadioName = `${rootId}-estado`;

    const initialForm = useMemo(
        (): ProductoModalFormData => ({
            nombre: '',
            descripcion_corta: '',
            descripcion_larga: '',
            detalle: [],
            producto_categoria_id: '' as string | number,
            producto_subcategoria_id: '' as string | number,
            precio_base: '',
            precio_promocional: '',
            impuesto: '',
            codigo: '',
            stock: 0,
            peso: '',
            dimensiones: '',
            estado: 'activo',
            imagen: null,
            video: null,
            galeria: [],
        }),
        [],
    );

    const { data, setData, post, processing, errors, reset, transform } = useForm(initialForm);

    const [subRows, setSubRows] = useState<SubRow[]>([]);
    const [subcategoriasLoading, setSubcategoriasLoading] = useState(false);
    const [taxonomyModal, setTaxonomyModal] = useState<'categoria' | 'subcategoria' | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [galleryItems, setGalleryItems] = useState<GallerySlot[]>([]);
    const [richEditors, setRichEditors] = useState<{
        seed: number;
        descripcion_larga: string;
    } | null>(null);

    const isEditMode = editingProductId != null && editingProductId > 0;

    /** Evita re-hidratar en bucle: `reset`/`setData` de Inertia no deben ir en deps del efecto de apertura. */
    const openCycleRef = useRef(0);

    useEffect(() => {
        if (!isOpen || data.producto_categoria_id === '' || data.producto_categoria_id === null) {
            setSubRows([]);
            setSubcategoriasLoading(false);

            return;
        }

        const catId = Number(data.producto_categoria_id);

        if (!Number.isFinite(catId) || catId <= 0) {
            setSubRows([]);
            setSubcategoriasLoading(false);

            return;
        }

        let cancelled = false;
        setSubcategoriasLoading(true);
        fetch(
            `/admin/taxonomia/producto-subcategorias?producto_categoria_id=${encodeURIComponent(
                String(catId),
            )}&per_page=200`,
            { credentials: 'same-origin', headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } },
        )
            .then(async (r) => {
                const j = (await r.json()) as { data?: SubRow[] };

                if (!r.ok) {
                    throw new Error('subcategorias');
                }

                if (!cancelled) {
                    const rows = Array.isArray(j.data) ? j.data : [];
                    setSubRows(
                        rows.map((row) => ({
                            id: row.id,
                            nombre: row.nombre,
                        })),
                    );
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setSubRows([]);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setSubcategoriasLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [isOpen, data.producto_categoria_id]);

    useEffect(() => {
        if (data.producto_subcategoria_id === '' || data.producto_subcategoria_id === null) {
            return;
        }

        const sid = Number(data.producto_subcategoria_id);

        if (!Number.isFinite(sid) || subRows.length === 0 || subcategoriasLoading) {
            return;
        }

        if (!subRows.some((s) => s.id === sid)) {
            setData('producto_subcategoria_id', '');
        }
    }, [subRows, data.producto_subcategoria_id, subcategoriasLoading, setData]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (!isEditMode) {
            openCycleRef.current += 1;
            reset();
            setImgPreview(null);
            setVideoPreview(null);
            setGalleryItems([]);
            setLoadError(null);
            setLoadingProduct(false);
            setRichEditors({
                seed: Date.now(),
                descripcion_larga: initialForm.descripcion_larga,
            });

            return;
        }

        let cancelled = false;
        openCycleRef.current += 1;
        const fetchCycle = openCycleRef.current;
        setLoadError(null);
        setLoadingProduct(true);
        void fetch(`/admin/productos/${editingProductId}/formulario`, {
            credentials: 'same-origin',
            headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        })
            .then(async (r) => {
                if (!r.ok) {
                    throw new Error('No se pudo cargar el producto.');
                }

                return r.json() as Promise<ProductoFormularioJson>;
            })
            .then((payload) => {
                if (cancelled || fetchCycle !== openCycleRef.current) {
                    return;
                }

                const detalleRows = normalizeDetalleInclusiones(payload.detalle);
                setData({
                    nombre: payload.nombre,
                    descripcion_corta: payload.descripcion_corta,
                    descripcion_larga: payload.descripcion_larga,
                    detalle: detalleRows,
                    producto_categoria_id: payload.producto_categoria_id,
                    producto_subcategoria_id:
                        payload.producto_subcategoria_id != null ? payload.producto_subcategoria_id : '',
                    precio_base: payload.precio_base,
                    precio_promocional: payload.precio_promocional ?? '',
                    impuesto: payload.impuesto ?? '',
                    codigo: payload.codigo,
                    stock: payload.stock,
                    imagen: null,
                    video: null,
                    galeria: [],
                    peso: payload.peso ?? '',
                    dimensiones: payload.dimensiones ?? '',
                    estado: payload.estado === 'pausado' ? 'pausado' : 'activo',
                });
                setImgPreview(payload.imagen || null);
                setVideoPreview(payload.video || null);
                const extras = (payload.galeria ?? []).filter((g) => !g.es_principal);
                setGalleryItems(
                    extras.map((g) => ({
                        kind: 'existente' as const,
                        id: g.id,
                        preview: g.path,
                    })),
                );
                setRichEditors({
                    seed: Date.now(),
                    descripcion_larga: payload.descripcion_larga,
                });
            })
            .catch(() => {
                if (!cancelled && fetchCycle === openCycleRef.current) {
                    setLoadError('No se pudo cargar el producto. Cierra e inténtalo de nuevo.');
                }
            })
            .finally(() => {
                if (!cancelled && fetchCycle === openCycleRef.current) {
                    setLoadingProduct(false);
                }
            });

        return () => {
            cancelled = true;
        };
        // reset/setData: estables en la práctica, pero incluirlos re-dispara el efecto y puede provocar bucles (pantalla en blanco).
        // eslint-disable-next-line react-hooks/exhaustive-deps -- solo isOpen, modo edición e id de producto
    }, [isOpen, isEditMode, editingProductId]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            reset();
            setSubRows([]);
            setTaxonomyModal(null);
            setLoadError(null);
            setLoadingProduct(false);
            setImgPreview(null);
            setVideoPreview(null);
            setGalleryItems([]);
            setRichEditors(null);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, reset]);

    if (!isOpen) {
        return null;
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'imagen' | 'video') => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
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

    const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const availableSlots = MAX_IMAGENES_GALERIA - galleryItems.length;
        const slice = files.slice(0, availableSlots);

        if (slice.length === 0) {
            return;
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
                    clientKey: `nuevo-${item.file.name}-${item.file.size}-${item.file.lastModified}-${
                        typeof crypto !== 'undefined' && 'randomUUID' in crypto
                            ? crypto.randomUUID()
                            : `${Date.now()}-${Math.random()}`
                    }`,
                    file: item.file,
                    preview: item.preview,
                })),
            ]);
        });
    };

    const removeGalleryImage = (index: number) => {
        setGalleryItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (loadingProduct) {
            return;
        }

        transform((form) => {
            const nuevos = galleryItems.filter((x): x is Extract<GallerySlot, { kind: 'nuevo' }> => x.kind === 'nuevo');
            const files = nuevos.map((x) => x.file);
            const allowedIcons = new Set<string>(HISTORIA_DETALLE_INCLUSION_ICONS);
            const detalleCleaned = (Array.isArray(form.detalle) ? form.detalle : [])
                .filter((r) => r.title.trim() !== '')
                .map((r) => {
                    const d = r.description.trim();
                    const iconResolved = r.icon && allowedIcons.has(r.icon) ? r.icon : 'FileText';
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
                galeria: files,
                detalle: JSON.stringify(detalleCleaned),
            };

            if (isEditMode && editingProductId) {
                const keepIds = galleryItems
                    .filter((x): x is Extract<GallerySlot, { kind: 'existente' }> => x.kind === 'existente')
                    .map((x) => x.id);

                return {
                    ...next,
                    _method: 'patch' as const,
                    producto_gallery_sync: true,
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

        if (isEditMode && editingProductId) {
            post(`/admin/productos/${editingProductId}`, visitOptions);

            return;
        }

        post('/admin/productos', {
            ...visitOptions,
            forceFormData: true,
        });
    };

    const handleClose = () => {
        setRichEditors(null);
        reset();
        onClose();
    };

    const categoriaIdNum = data.producto_categoria_id === '' ? null : Number(data.producto_categoria_id);
    const formDisabled = loadingProduct || Boolean(loadError);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-['Inter']">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} aria-hidden />

            <div className="relative flex w-[90%] max-h-[90vh] flex-col overflow-hidden rounded-lg bg-white shadow-2xl md:w-[850px]">
                <div className="flex items-center justify-between border-b border-[#F3F4F6] px-6 py-5">
                    <h2 className="text-[17px] font-semibold text-[#1B3D6D]">
                        {isEditMode ? 'Editar producto' : 'Crear producto'}
                    </h2>
                    <button type="button" onClick={handleClose} className="text-[#7B7B7B] transition-colors hover:text-[#111827]">
                        <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>
                </div>

                {loadError ? (
                    <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-[13px] text-red-800">{loadError}</div>
                ) : null}

                <form onSubmit={handleSubmit} className="custom-scrollbar relative flex flex-1 flex-col overflow-y-auto">
                    {loadingProduct ? (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 text-[13.5px] font-medium text-[#4B5563]">
                            Cargando producto…
                        </div>
                    ) : null}
                    <div className={`flex-1 p-6 ${formDisabled ? 'pointer-events-none opacity-60' : ''}`}>
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="mb-1.5 block text-[13.5px] font-semibold text-[#1B3D6D]">
                                        Nombre del producto<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        placeholder="Papel de Hilo Prensado"
                                        className={`w-full rounded-[4px] border px-3 py-2 text-[13.5px] text-[#4B5563] outline-none placeholder:text-[#9CA3AF] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] ${
                                            errors.nombre ? 'border-red-500' : 'border-[#E5E7EB]'
                                        }`}
                                    />
                                    {errors.nombre ? <span className="text-[11px] text-red-500">{errors.nombre}</span> : null}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-[13.5px] font-semibold text-[#1B3D6D]">
                                        Descripción corta<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.descripcion_corta}
                                        onChange={(e) => setData('descripcion_corta', e.target.value)}
                                        placeholder="Papel"
                                        className={`w-full rounded-[4px] border px-3 py-2 text-[13.5px] text-[#4B5563] outline-none placeholder:text-[#9CA3AF] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] ${
                                            errors.descripcion_corta ? 'border-red-500' : 'border-[#E5E7EB]'
                                        }`}
                                    />
                                    {errors.descripcion_corta ? (
                                        <span className="mt-1 block text-[11px] text-red-500">{errors.descripcion_corta}</span>
                                    ) : (
                                        <span className="mt-1 block text-[11px] text-[#A0A0A0]">Se mostrará en la sección principal de productos</span>
                                    )}
                                </div>

                                {richEditors ? (
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
                                        placeholder="Versátil y de alta calidad, ideal para manualidades..."
                                        rows={5}
                                        error={errors.descripcion_larga}
                                    />
                                ) : null}

                                <HistoriaDetalleInclusionsEditor
                                    items={data.detalle}
                                    onChange={(items) => setData('detalle', items)}
                                    errors={errors as Record<string, string | string[] | undefined>}
                                    rootId={rootId}
                                    sectionTitle="¿Qué incluye el envío o el producto?"
                                    sectionHint="Lista (icono Lucide, título obligatorio, descripción opcional). Misma estructura que en historias."
                                    emptyStateHint="Sin ítems. Añade filas para mostrar inclusiones en la ficha del producto."
                                />

                                <div>
                                    <div className="mb-1.5 flex items-center gap-2">
                                        <label className="text-[13.5px] font-semibold text-[#1B3D6D]">
                                            Categoría<span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            title="Gestionar categorías"
                                            onClick={() => setTaxonomyModal('categoria')}
                                            className="inline-flex size-7 items-center justify-center  text-[#1B3D6D] hover:bg-[#F9FAFB]"
                                        >
                                            <FontAwesomeIcon icon={faPencil} className="text-[11px]" />
                                        </button>
                                    </div>
                                    <select
                                        value={data.producto_categoria_id === '' ? '' : String(data.producto_categoria_id)}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setData('producto_categoria_id', v === '' ? '' : v);
                                            setData('producto_subcategoria_id', '');
                                        }}
                                        className={`w-full rounded-[4px] border bg-white px-3 py-2 text-[13.5px] text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] ${
                                            errors.producto_categoria_id ? 'border-red-500' : 'border-[#E5E7EB]'
                                        }`}
                                    >
                                        <option value="">Seleccione una categoría</option>
                                        {categorias.map((c) => (
                                            <option key={c.id} value={String(c.id)}>
                                                {c.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.producto_categoria_id ? (
                                        <span className="text-[11px] text-red-500">{errors.producto_categoria_id}</span>
                                    ) : null}
                                </div>

                                <div>
                                    <div className="mb-1.5 flex items-center gap-2">
                                        <label className="text-[13.5px] font-semibold text-[#1B3D6D]">Subcategoría</label>
                                        <button
                                            type="button"
                                            title="Gestionar subcategorías (elige la categoría en el modal)"
                                            onClick={() => setTaxonomyModal('subcategoria')}
                                            className="inline-flex size-7 items-center justify-center rounded border border-[#E5E7EB] text-[#1B3D6D] hover:bg-[#F9FAFB]"
                                        >
                                            <FontAwesomeIcon icon={faPencil} className="text-[11px]" />
                                        </button>
                                    </div>
                                    <select
                                        value={data.producto_subcategoria_id === '' ? '' : String(data.producto_subcategoria_id)}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setData('producto_subcategoria_id', v === '' ? '' : v);
                                        }}
                                        disabled={!categoriaIdNum || subcategoriasLoading}
                                        className={`w-full rounded-[4px] border bg-white px-3 py-2 text-[13.5px] text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] disabled:bg-[#F9FAFB] ${
                                            errors.producto_subcategoria_id ? 'border-red-500' : 'border-[#E5E7EB]'
                                        }`}
                                    >
                                        <option value="">
                                            {subcategoriasLoading ? 'Cargando subcategorías…' : 'Sin subcategoría'}
                                        </option>
                                        {subRows.map((s) => (
                                            <option key={s.id} value={String(s.id)}>
                                                {s.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {categoriaIdNum && !subcategoriasLoading && subRows.length === 0 ? (
                                        <p className="mt-1 text-[11px] text-[#6B7280]">
                                            No hay subcategorías para esta categoría. Usa el lápiz para crearlas.
                                        </p>
                                    ) : null}
                                    {errors.producto_subcategoria_id ? (
                                        <span className="text-[11px] text-red-500">{errors.producto_subcategoria_id}</span>
                                    ) : null}
                                </div>

                                <div>
                                    <label className="mb-3 block text-[13.5px] font-semibold text-[#1B3D6D]">
                                        Precio<span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="mb-1.5 block text-[12.5px] font-medium text-[#1B3D6D]">
                                                Precio base<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.precio_base}
                                                onChange={(e) => setData('precio_base', e.target.value)}
                                                placeholder="250.00"
                                                className={`w-full rounded-[4px] border px-3 py-2 text-[13.5px] text-[#4B5563] outline-none ${
                                                    errors.precio_base ? 'border-red-500' : 'border-[#E5E7EB]'
                                                }`}
                                            />
                                            {errors.precio_base ? <span className="text-[11px] text-red-500">{errors.precio_base}</span> : null}
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-[12.5px] font-medium text-[#1B3D6D]">Precio promocional</label>
                                            <input
                                                type="text"
                                                value={data.precio_promocional}
                                                onChange={(e) => setData('precio_promocional', e.target.value)}
                                                placeholder="199.00"
                                                className={`w-full rounded-[4px] border px-3 py-2 text-[13.5px] text-[#4B5563] outline-none ${
                                                    errors.precio_promocional ? 'border-red-500' : 'border-[#E5E7EB]'
                                                }`}
                                            />
                                            {errors.precio_promocional ? (
                                                <span className="text-[11px] text-red-500">{errors.precio_promocional}</span>
                                            ) : null}
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-[12.5px] font-medium text-[#1B3D6D]">Impuesto</label>
                                            <input
                                                type="text"
                                                value={data.impuesto}
                                                onChange={(e) => setData('impuesto', e.target.value)}
                                                placeholder="16"
                                                className={`w-full rounded-[4px] border px-3 py-2 text-[13.5px] text-[#4B5563] outline-none ${
                                                    errors.impuesto ? 'border-red-500' : 'border-[#E5E7EB]'
                                                }`}
                                            />
                                            {errors.impuesto ? <span className="text-[11px] text-red-500">{errors.impuesto}</span> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="mb-3 block text-[13.5px] font-semibold text-[#1B3D6D]">Información de envío</label>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="mb-1.5 block text-[12.5px] font-medium text-[#1B3D6D]">Peso</label>
                                            <input
                                                type="text"
                                                value={data.peso}
                                                onChange={(e) => setData('peso', e.target.value)}
                                                placeholder="0kg"
                                                className={`w-full rounded-[4px] border px-3 py-2 text-[13.5px] text-[#4B5563] outline-none ${
                                                    errors.peso ? 'border-red-500' : 'border-[#E5E7EB]'
                                                }`}
                                            />
                                            {errors.peso ? <span className="text-[11px] text-red-500">{errors.peso}</span> : null}
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-[12.5px] font-medium text-[#1B3D6D]">Dimensiones</label>
                                            <input
                                                type="text"
                                                value={data.dimensiones}
                                                onChange={(e) => setData('dimensiones', e.target.value)}
                                                placeholder="0x0x0"
                                                className={`w-full rounded-[4px] border px-3 py-2 text-[13.5px] text-[#4B5563] outline-none ${
                                                    errors.dimensiones ? 'border-red-500' : 'border-[#E5E7EB]'
                                                }`}
                                            />
                                            {errors.dimensiones ? <span className="text-[11px] text-red-500">{errors.dimensiones}</span> : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <label className="mb-3 block text-[13.5px] font-semibold text-[#1B3D6D]">Inventario</label>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="mb-1.5 block text-[12.5px] font-medium text-[#1B3D6D]">
                                                Código de producto<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.codigo}
                                                onChange={(e) => setData('codigo', e.target.value)}
                                                placeholder="#1018"
                                                className={`w-full rounded-[4px] border px-3 py-2 text-[13.5px] text-[#4B5563] outline-none ${
                                                    errors.codigo ? 'border-red-500' : 'border-[#E5E7EB]'
                                                }`}
                                            />
                                            {errors.codigo ? <span className="text-[11px] text-red-500">{errors.codigo}</span> : null}
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-[12.5px] font-medium text-[#1B3D6D]">
                                                Stock<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={data.stock}
                                                onChange={(e) => setData('stock', parseInt(e.target.value, 10) || 0)}
                                                placeholder="20"
                                                className={`w-full rounded-[4px] border px-3 py-2 text-[13.5px] text-[#4B5563] outline-none ${
                                                    errors.stock ? 'border-red-500' : 'border-[#E5E7EB]'
                                                }`}
                                            />
                                            {errors.stock ? <span className="text-[11px] text-red-500">{errors.stock}</span> : null}
                                        </div>
                                    </div>
                                </div>

                                <ProductoMultimediaPanel
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
                                    onImageChange={(ev) => handleFileChange(ev, 'imagen')}
                                    onVideoChange={(ev) => handleFileChange(ev, 'video')}
                                    onGalleryChange={handleGalleryChange}
                                    onRemoveGalleryImage={removeGalleryImage}
                                    errors={{
                                        imagen: errors.imagen,
                                        video: errors.video,
                                        galeria: errors.galeria,
                                        estado: errors.estado,
                                    }}
                                    fieldIds={{
                                        imagen: `${rootId}-imagen`,
                                        video: `${rootId}-video`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="sticky bottom-0 z-10 flex shrink-0 justify-end gap-3 border-t border-[#F3F4F6] bg-white px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="rounded-md border border-[#1B3D6D] px-6 py-2 text-[13.5px] font-semibold text-[#1B3D6D] transition-colors hover:bg-[#F8F9FA] disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing || formDisabled}
                            className="flex items-center gap-2 rounded-md bg-[#1B3D6D] px-6 py-2 text-[13.5px] font-semibold text-white shadow-sm transition-colors hover:bg-[#1B3D6D]/90 disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : isEditMode ? 'Guardar cambios' : 'Guardar producto'}
                        </button>
                    </div>
                </form>
            </div>

            <ProductoTaxonomyManageModal
                isOpen={taxonomyModal === 'categoria'}
                onClose={() => setTaxonomyModal(null)}
                kind="categoria"
                onSaved={() => router.reload({ only: ['categorias'] })}
            />
            <ProductoTaxonomyManageModal
                isOpen={taxonomyModal === 'subcategoria'}
                onClose={() => setTaxonomyModal(null)}
                kind="subcategoria"
                categorias={categorias}
                categoriaPadreId={categoriaIdNum}
                onSaved={() => {
                    void fetch(
                        `/admin/taxonomia/producto-subcategorias?producto_categoria_id=${encodeURIComponent(
                            String(data.producto_categoria_id),
                        )}&per_page=200`,
                        { credentials: 'same-origin', headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } },
                    )
                        .then((r) => r.json())
                        .then((j: { data?: SubRow[] }) => setSubRows(Array.isArray(j.data) ? j.data : []));
                }}
            />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #D1D5DB; border-radius: 20px; }
            `}</style>
        </div>
    );
}
