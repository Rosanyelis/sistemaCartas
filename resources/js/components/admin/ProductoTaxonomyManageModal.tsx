import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import { laravelJsonFetch } from '@/lib/laravel-json-fetch';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

export type TaxonomyKind = 'categoria' | 'subcategoria';

export type CategoriaOption = {
    id: number;
    nombre: string;
};

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

type Row = { id: number; nombre: string; productos_count?: number };

type ProductoTaxonomyManageModalProps = {
    isOpen: boolean;
    onClose: () => void;
    kind: TaxonomyKind;
    /** Valor inicial del selector de categoría (solo subcategorías) */
    categoriaPadreId?: number | null;
    /** Categorías para el selector al crear/listar subcategorías */
    categorias?: CategoriaOption[];
    onSaved?: () => void;
};

const PER_PAGE = 10;

export function ProductoTaxonomyManageModal({
    isOpen,
    onClose,
    kind,
    categoriaPadreId,
    categorias = [],
    onSaved,
}: ProductoTaxonomyManageModalProps) {
    const isCategoria = kind === 'categoria';

    const [nombre, setNombre] = useState('');
    const [subParentCategoryId, setSubParentCategoryId] = useState('');
    const [saving, setSaving] = useState(false);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState<Row[]>([]);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [from, setFrom] = useState<number | null>(null);
    const [to, setTo] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
    const [deleting, setDeleting] = useState(false);

    const subCategoriaIdNum =
        subParentCategoryId === '' ? NaN : Number(subParentCategoryId);

    const loadPage = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (isCategoria) {
                const res = await laravelJsonFetch<Paginated<Row>>(
                    `/admin/taxonomia/producto-categorias?page=${page}&per_page=${PER_PAGE}`,
                );
                setRows(res.data);
                setLastPage(res.last_page);
                setTotal(res.total);
                setFrom(res.from);
                setTo(res.to);
            } else {
                if (!Number.isFinite(subCategoriaIdNum) || subCategoriaIdNum <= 0) {
                    setRows([]);
                    setLastPage(1);
                    setTotal(0);
                    setFrom(null);
                    setTo(null);
                    return;
                }
                const res = await laravelJsonFetch<Paginated<Row>>(
                    `/admin/taxonomia/producto-subcategorias?producto_categoria_id=${subCategoriaIdNum}&page=${page}&per_page=${PER_PAGE}`,
                );
                setRows(res.data);
                setLastPage(res.last_page);
                setTotal(res.total);
                setFrom(res.from);
                setTo(res.to);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'No se pudo cargar el listado.');
        } finally {
            setLoading(false);
        }
    }, [isCategoria, page, subCategoriaIdNum]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        setPage(1);
        setNombre('');
        setError(null);
        setDeleteTarget(null);
        if (!isCategoria) {
            setSubParentCategoryId(
                categoriaPadreId != null && Number.isFinite(categoriaPadreId) && categoriaPadreId > 0
                    ? String(categoriaPadreId)
                    : '',
            );
        } else {
            setSubParentCategoryId('');
        }
    }, [isOpen, isCategoria, categoriaPadreId]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        void loadPage();
    }, [isOpen, loadPage]);

    const goToPage = (next: number) => {
        if (next < 1 || next > lastPage) {
            return;
        }
        setPage(next);
    };

    const handleSave = async () => {
        const trimmed = nombre.trim();
        if (!trimmed) {
            setError('Escribe un nombre.');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            if (isCategoria) {
                await laravelJsonFetch('/admin/taxonomia/producto-categorias', {
                    method: 'POST',
                    body: JSON.stringify({ nombre: trimmed }),
                });
            } else {
                if (!Number.isFinite(subCategoriaIdNum) || subCategoriaIdNum <= 0) {
                    setError('Selecciona la categoría a la que pertenecerá la subcategoría.');
                    setSaving(false);
                    return;
                }
                await laravelJsonFetch('/admin/taxonomia/producto-subcategorias', {
                    method: 'POST',
                    body: JSON.stringify({
                        nombre: trimmed,
                        producto_categoria_id: subCategoriaIdNum,
                    }),
                });
            }
            setNombre('');
            onSaved?.();
            await loadPage();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'No se pudo guardar.');
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) {
            return;
        }
        setDeleting(true);
        setError(null);
        try {
            const path = isCategoria
                ? `/admin/taxonomia/producto-categorias/${deleteTarget.id}`
                : `/admin/taxonomia/producto-subcategorias/${deleteTarget.id}`;
            await laravelJsonFetch(path, { method: 'DELETE' });
            setDeleteTarget(null);
            onSaved?.();
            const soloFila = rows.length === 1;
            if (soloFila && page > 1) {
                setPage(page - 1);
            } else {
                await loadPage();
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'No se pudo eliminar.');
        } finally {
            setDeleting(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    const title = isCategoria ? 'Gestionar categorías' : 'Gestionar subcategorías';
    const currentPage = page;
    const last_page = lastPage;
    const emptyTableMsg = isCategoria ? 'No hay categorías registradas.' : 'No hay subcategorías para esta categoría.';
    const emptyTableMsgMobile = isCategoria ? 'No hay categorías.' : 'No hay subcategorías.';
    const deleteTitle = isCategoria ? 'Eliminar categoría' : 'Eliminar subcategoría';
    const deleteBlockedTitle = isCategoria
        ? 'No se puede eliminar: hay productos usando esta categoría'
        : 'No se puede eliminar: hay productos usando esta subcategoría';

    return (
        <>
            <div className="fixed inset-0 z-[60] flex items-center justify-center font-['Inter'] p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
                <div className="relative flex max-h-[90vh] w-[90%] flex-col overflow-hidden rounded-lg bg-white shadow-2xl md:w-[850px]">
                    <div className="flex shrink-0 items-center justify-between border-b border-[#F3F4F6] px-6 py-5">
                        <h3 className="text-[17px] font-semibold text-[#1B3D6D]">{title}</h3>
                        <button type="button" onClick={onClose} className="text-[#7B7B7B] hover:text-[#111827]">
                            <FontAwesomeIcon icon={faTimes} className="text-lg" />
                        </button>
                    </div>

                    <div className="shrink-0 space-y-4 border-b border-[#F3F4F6] px-6 py-4">
                        {!isCategoria ? (
                            <div>
                                <label className="mb-1.5 block text-[13px] font-semibold text-[#1B3D6D]">
                                    Categoría<span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={subParentCategoryId}
                                    onChange={(e) => {
                                        setSubParentCategoryId(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full rounded-[4px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13.5px] text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]"
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categorias.map((c) => (
                                        <option key={c.id} value={String(c.id)}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1.5 text-[11px] text-[#6B7280]">
                                    El listado y las nuevas subcategorías se asocian a la categoría elegida.
                                </p>
                            </div>
                        ) : null}

                        <div>
                            <label className="mb-2 block text-[13px] font-semibold text-[#1B3D6D]">
                                {isCategoria ? 'Nueva categoría' : 'Nueva subcategoría'}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder={isCategoria ? 'Nombre de la categoría' : 'Nombre de la subcategoría'}
                                    className="min-w-0 flex-1 rounded-[4px] border border-[#E5E7EB] px-3 py-2.5 text-[13.5px] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]"
                                />
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => void handleSave()}
                                    className="shrink-0 rounded-[4px] bg-[#1B3D6D] px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[#1B3D6D]/90 disabled:opacity-50"
                                >
                                    {saving ? 'Guardando…' : 'Guardar'}
                                </button>
                            </div>
                            {error ? <p className="mt-2 text-[12px] text-red-600">{error}</p> : null}
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="hidden md:block">
                            <table className="w-full min-w-[600px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                                        <th className="px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-[#4B5563]">
                                            Nombre
                                        </th>
                                        <th className="w-[140px] px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-[#4B5563]">
                                            Productos
                                        </th>
                                        <th className="w-[120px] px-6 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-[#4B5563]">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F3F4F6]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-10 text-center text-[13px] text-[#6B7280]">
                                                Cargando…
                                            </td>
                                        </tr>
                                    ) : rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-10 text-center text-[13px] text-[#7B7B7B]">
                                                {!isCategoria && (!Number.isFinite(subCategoriaIdNum) || subCategoriaIdNum <= 0)
                                                    ? 'Selecciona una categoría para ver sus subcategorías.'
                                                    : emptyTableMsg}
                                            </td>
                                        </tr>
                                    ) : (
                                        rows.map((r) => {
                                            const count = r.productos_count ?? 0;
                                            const puedeEliminar = count === 0;
                                            return (
                                                <tr key={r.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-3.5 text-[13.5px] text-[#4B5563]">{r.nombre}</td>
                                                    <td className="px-6 py-3.5 text-[13.5px] text-[#4B5563]">{count}</td>
                                                    <td className="px-6 py-3.5 text-center">
                                                        <button
                                                            type="button"
                                                            disabled={!puedeEliminar}
                                                            title={puedeEliminar ? deleteTitle : deleteBlockedTitle}
                                                            onClick={() => puedeEliminar && setDeleteTarget(r)}
                                                            className="inline-flex items-center justify-center rounded p-2 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} className="text-[14px]" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="block divide-y divide-[#F3F4F6] md:hidden">
                            {loading ? (
                                <p className="p-8 text-center text-[13px] text-[#6B7280]">Cargando…</p>
                            ) : rows.length === 0 ? (
                                <p className="p-8 text-center text-[13px] text-[#7B7B7B]">
                                    {!isCategoria && (!Number.isFinite(subCategoriaIdNum) || subCategoriaIdNum <= 0)
                                        ? 'Selecciona una categoría.'
                                        : emptyTableMsgMobile}
                                </p>
                            ) : (
                                rows.map((r) => {
                                    const count = r.productos_count ?? 0;
                                    const puedeEliminar = count === 0;
                                    return (
                                        <div key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[13.5px] font-medium text-[#374151]">{r.nombre}</p>
                                                <p className="text-[12px] text-[#9CA3AF]">{count} producto(s)</p>
                                            </div>
                                            <button
                                                type="button"
                                                disabled={!puedeEliminar}
                                                title={puedeEliminar ? 'Eliminar' : deleteBlockedTitle}
                                                onClick={() => puedeEliminar && setDeleteTarget(r)}
                                                className="shrink-0 rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-[14px]" />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-4 border-t border-[#F3F4F6] bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
                        <div className="text-[13px] font-bold text-[#9CA3AF] md:font-normal md:text-[#7B7B7B]">
                            <span className="hidden md:inline">
                                {from != null && to != null ? (
                                    <>
                                        Mostrando <span className="font-semibold text-[#111827]">{from}</span> a{' '}
                                        <span className="font-semibold text-[#111827]">{to}</span> de{' '}
                                        <span className="font-semibold text-[#111827]">{total}</span> registros
                                    </>
                                ) : (
                                    'Sin registros'
                                )}
                            </span>
                            <span className="md:hidden">
                                {from != null ? `Mostrando ${from} de ${total} registros` : 'Sin registros'}
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                            <button
                                type="button"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                className={`flex size-8 items-center justify-center rounded-md transition-colors ${
                                    currentPage === 1 ? 'cursor-not-allowed text-[#D1D5DB]' : 'text-[#7B7B7B] hover:bg-gray-100'
                                }`}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                            </button>
                            {Array.from({ length: last_page }, (_, i) => i + 1).map((p) => {
                                if (p === 1 || p === last_page || (p >= currentPage - 1 && p <= currentPage + 1)) {
                                    return (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => goToPage(p)}
                                            className={`flex size-8 items-center justify-center rounded-md text-[13px] transition-colors ${
                                                currentPage === p
                                                    ? 'bg-[#1B3D6D] font-semibold text-white'
                                                    : 'text-[#7B7B7B] hover:bg-gray-100'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                }
                                if (p === currentPage - 2 || p === currentPage + 2) {
                                    return (
                                        <span key={p} className="px-1 text-[#A0A0A0]">
                                            …
                                        </span>
                                    );
                                }
                                return null;
                            })}
                            <button
                                type="button"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === last_page || loading}
                                className={`flex size-8 items-center justify-center rounded-md transition-colors ${
                                    currentPage === last_page
                                        ? 'cursor-not-allowed text-[#D1D5DB]'
                                        : 'text-[#7B7B7B] hover:bg-gray-100'
                                }`}
                            >
                                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title={deleteTitle}
                description={
                    deleteTarget
                        ? isCategoria
                            ? `¿Eliminar la categoría «${deleteTarget.nombre}»? Esta acción no se puede deshacer.`
                            : `¿Eliminar la subcategoría «${deleteTarget.nombre}»? Esta acción no se puede deshacer.`
                        : ''
                }
                onConfirm={() => void handleConfirmDelete()}
                isProcessing={deleting}
            />
        </>
    );
}
