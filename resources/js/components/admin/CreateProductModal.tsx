import React, { useEffect, useRef, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faImage, faPencil } from '@fortawesome/free-solid-svg-icons';
import { LimitedWordTextarea } from '@/components/admin/create-story/LimitedWordTextarea';
import { MAX_PALABRAS_TEXTO_LARGO } from '@/components/admin/create-story/constants';
import { ProductoTaxonomyManageModal } from '@/components/admin/ProductoTaxonomyManageModal';

export type CategoriaOption = {
    id: number;
    nombre: string;
};

type SubRow = { id: number; nombre: string };

export type ProductoFormData = {
    nombre: string;
    descripcion_corta: string;
    descripcion_larga: string;
    detalle: string;
    producto_categoria_id: string | number;
    producto_subcategoria_id: string | number;
    precio_base: string;
    precio_promocional: string;
    impuesto: string;
    codigo: string;
    stock: number;
    imagen: string;
    peso: string;
    dimensiones: string;
    estado: string;
};

type ProductoFormularioJson = {
    nombre: string;
    descripcion_corta: string;
    descripcion_larga: string;
    detalle: string;
    producto_categoria_id: number;
    producto_subcategoria_id: number | null;
    precio_base: string;
    precio_promocional: string;
    impuesto: string;
    codigo: string;
    stock: number;
    imagen: string;
    peso: string;
    dimensiones: string;
    estado: string;
    variantes: unknown;
    galeria: unknown;
};

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    categorias: CategoriaOption[];
    /** Si se indica, el modal carga el producto y envía PATCH al guardar */
    editingProductId?: number | null;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
    isOpen,
    onClose,
    categorias,
    editingProductId = null,
}) => {
    const { data, setData, post, patch, processing, errors, reset } = useForm<ProductoFormData>({
        nombre: '',
        descripcion_corta: '',
        descripcion_larga: '',
        detalle: '',
        producto_categoria_id: '' as string | number,
        producto_subcategoria_id: '' as string | number,
        precio_base: '',
        precio_promocional: '',
        impuesto: '',
        codigo: '',
        stock: 0,
        imagen: '',
        peso: '',
        dimensiones: '',
        estado: 'activo',
    });

    const [subRows, setSubRows] = useState<SubRow[]>([]);
    const [subcategoriasLoading, setSubcategoriasLoading] = useState(false);
    const [taxonomyModal, setTaxonomyModal] = useState<'categoria' | 'subcategoria' | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const wasModalOpenRef = useRef(false);
    const prevEditingProductIdRef = useRef<number | null>(null);

    const isEditMode = editingProductId != null && editingProductId > 0;

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

    /** Si la subcategoría elegida ya no existe en la categoría actual, limpiar */
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
            wasModalOpenRef.current = false;
            prevEditingProductIdRef.current = null;
            return;
        }
        const justOpened = !wasModalOpenRef.current;
        wasModalOpenRef.current = true;
        const hadEditMode = prevEditingProductIdRef.current != null;
        prevEditingProductIdRef.current = isEditMode && editingProductId ? editingProductId : null;

        if (!isEditMode) {
            if (justOpened || hadEditMode) {
                reset();
            }
            setLoadError(null);
            setLoadingProduct(false);
            return;
        }

        let cancelled = false;
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
                if (cancelled) {
                    return;
                }
                setData({
                    nombre: payload.nombre,
                    descripcion_corta: payload.descripcion_corta,
                    descripcion_larga: payload.descripcion_larga,
                    detalle: payload.detalle ?? '',
                    producto_categoria_id: payload.producto_categoria_id,
                    producto_subcategoria_id:
                        payload.producto_subcategoria_id != null ? payload.producto_subcategoria_id : '',
                    precio_base: payload.precio_base,
                    precio_promocional: payload.precio_promocional ?? '',
                    impuesto: payload.impuesto ?? '',
                    codigo: payload.codigo,
                    stock: payload.stock,
                    imagen: payload.imagen ?? '',
                    peso: payload.peso ?? '',
                    dimensiones: payload.dimensiones ?? '',
                    estado: payload.estado === 'pausado' ? 'pausado' : 'activo',
                });
            })
            .catch(() => {
                if (!cancelled) {
                    setLoadError('No se pudo cargar el producto. Cierra e inténtalo de nuevo.');
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadingProduct(false);
                }
            });
        return () => {
            cancelled = true;
        };
        // reset/setData provienen de useForm (Inertia); dependencias explícitas evitan bucles con reset()
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
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, reset]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loadingProduct) {
            return;
        }
        const visitOptions = {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        };
        if (isEditMode && editingProductId) {
            patch(`/admin/productos/${editingProductId}`, visitOptions);
        } else {
            post('/admin/productos', visitOptions);
        }
    };

    const handleClose = () => {
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

                                <LimitedWordTextarea
                                    id="producto-descripcion-larga"
                                    label={
                                        <>
                                            Descripción larga<span className="text-[#EF4444]">*</span>
                                        </>
                                    }
                                    value={data.descripcion_larga}
                                    onChange={(v) => setData('descripcion_larga', v)}
                                    maxWords={MAX_PALABRAS_TEXTO_LARGO}
                                    placeholder="Versátil y de alta calidad, ideal para manualidades..."
                                    rows={5}
                                    error={errors.descripcion_larga}
                                />

                                <LimitedWordTextarea
                                    id="producto-detalle"
                                    label="Detalle"
                                    value={data.detalle}
                                    onChange={(v) => setData('detalle', v)}
                                    maxWords={MAX_PALABRAS_TEXTO_LARGO}
                                    placeholder="Aquí detalles del producto"
                                    rows={4}
                                    error={errors.detalle}
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

                                <div className="mt-2">
                                    <label className="mb-3 block text-[13.5px] font-semibold text-[#1B3D6D]">Variantes(Opcional)</label>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="mb-1.5 block text-[12.5px] text-[#4B5563]">Color</label>
                                            <select className="w-full appearance-none rounded-[4px] border border-[#E5E7EB] bg-white px-3 py-2 text-[13.5px] text-[#4B5563] outline-none">
                                                <option>Beige</option>
                                                <option>Blanco</option>
                                                <option>Negro</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-[12.5px] text-[#4B5563]">Material</label>
                                            <select className="w-full appearance-none rounded-[4px] border border-[#E5E7EB] bg-white px-3 py-2 text-[13.5px] text-[#4B5563] outline-none">
                                                <option>Papel</option>
                                                <option>Cartón</option>
                                            </select>
                                        </div>
                                        <div className="mt-1 text-center">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-[4px] border border-[#1B3D6D] px-4 py-1.5 text-[12px] font-medium text-[#1B3D6D] transition-colors hover:bg-[#F8F9FA]"
                                            >
                                                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                                                Agregar Variante
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <label className="mb-3 block text-[13.5px] font-semibold text-[#1B3D6D]">Imágenes y multimedia</label>
                                    <div className="relative flex h-[150px] w-full items-center justify-center overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPC9zdmc+')]" />
                                    <div className="mt-3 text-center">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-[4px] border border-[#1B3D6D] px-4 py-1.5 text-[12px] font-medium text-[#1B3D6D] transition-colors hover:bg-[#F8F9FA]"
                                        >
                                            <FontAwesomeIcon icon={faImage} className="text-[11px]" />
                                            Subir Imagen
                                        </button>
                                        {errors.imagen ? <span className="mt-1 block text-[11px] text-red-500">{errors.imagen}</span> : null}
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-col gap-4">
                                    <label className="group flex cursor-pointer items-start gap-3">
                                        <div className="relative mt-0.5 flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="estado"
                                                value="activo"
                                                checked={data.estado === 'activo'}
                                                onChange={() => setData('estado', 'activo')}
                                                className="peer sr-only"
                                            />
                                            <div className="h-4 w-4 rounded-[3px] border border-[#D1D5DB] transition-all peer-checked:border-[#1B3D6D] peer-checked:bg-[#1B3D6D]" />
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className="pointer-events-none absolute text-[9px] text-white opacity-0 rotate-45 peer-checked:opacity-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13.5px] font-medium text-[#111827]">Activo</span>
                                            <span className="text-[12px] text-[#A0A0A0]">Está publicado en el sitio web y recibiendo ventas.</span>
                                        </div>
                                    </label>

                                    <label className="group flex cursor-pointer items-start gap-3">
                                        <div className="relative mt-0.5 flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="estado"
                                                value="pausado"
                                                checked={data.estado === 'pausado'}
                                                onChange={() => setData('estado', 'pausado')}
                                                className="peer sr-only"
                                            />
                                            <div className="h-4 w-4 rounded-[3px] border border-[#D1D5DB] transition-all peer-checked:border-[#1B3D6D] peer-checked:bg-[#1B3D6D]" />
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className="pointer-events-none absolute text-[9px] text-white opacity-0 rotate-45 peer-checked:opacity-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13.5px] font-medium text-[#111827]">Pausado</span>
                                            <span className="text-[12px] text-[#A0A0A0]">
                                                No aparece en el sitio web pero sigue en la base de datos y en la &quot;lista de productos&quot;.
                                            </span>
                                        </div>
                                    </label>
                                    {errors.estado ? <span className="text-[11px] text-red-500">{errors.estado}</span> : null}
                                </div>
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
};
