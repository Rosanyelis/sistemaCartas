import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faChevronLeft,
    faChevronRight,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { adminTaxonomiaUrls } from '@/lib/admin-taxonomia-urls';
import { laravelJsonFetch } from '@/lib/laravel-json-fetch';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

type Row = { id: number; nombre: string; historias_count?: number };

type HistoriaCategoriaManageModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSaved?: () => void;
};

const PER_PAGE = 10;

export function HistoriaCategoriaManageModal({
    isOpen,
    onClose,
    onSaved,
}: HistoriaCategoriaManageModalProps) {
    const [nombre, setNombre] = useState('');
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

    const loadPage = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await laravelJsonFetch<Paginated<Row>>(
                adminTaxonomiaUrls.historiaCategorias.index({
                    page,
                    per_page: PER_PAGE,
                }),
            );
            setRows(res.data);
            setLastPage(res.last_page);
            setTotal(res.total);
            setFrom(res.from);
            setTo(res.to);
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : 'No se pudo cargar el listado.',
            );
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        setPage(1);
        setNombre('');
        setError(null);
        setDeleteTarget(null);
    }, [isOpen]);

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
            await laravelJsonFetch(
                adminTaxonomiaUrls.historiaCategorias.store(),
                {
                    method: 'POST',
                    body: JSON.stringify({ nombre: trimmed }),
                },
            );
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
            await laravelJsonFetch(
                adminTaxonomiaUrls.historiaCategorias.destroy(deleteTarget.id),
                {
                    method: 'DELETE',
                },
            );
            setDeleteTarget(null);
            onSaved?.();
            if (rows.length === 1 && page > 1) {
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

    const currentPage = page;
    const last_page = lastPage;
    const deleteBlockedTitle =
        'No se puede eliminar: hay historias usando esta categoría';

    return createPortal(
        <>
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 font-['Inter']">
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden
                />
                <div className="relative flex max-h-[90vh] w-[90%] flex-col overflow-hidden rounded-lg bg-white shadow-2xl md:w-[850px]">
                    <div className="flex shrink-0 items-center justify-between border-b border-[#F3F4F6] px-6 py-5">
                        <h3 className="text-[17px] font-semibold text-[#1B3D6D]">
                            Gestionar categorías de historias
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[#7B7B7B] hover:text-[#111827]"
                        >
                            <FontAwesomeIcon
                                icon={faTimes}
                                className="text-lg"
                            />
                        </button>
                    </div>

                    <div className="shrink-0 space-y-4 border-b border-[#F3F4F6] px-6 py-4">
                        <div>
                            <label className="mb-2 block text-[13px] font-semibold text-[#1B3D6D]">
                                Nueva categoría
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Nombre de la categoría"
                                    className="min-w-0 flex-1 rounded-[4px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13.5px] text-[#1B3D6D] outline-none placeholder:text-[#9CA3AF] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]"
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
                            {error ? (
                                <p className="mt-2 text-[12px] text-red-600">
                                    {error}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="hidden md:block">
                            <table className="w-full min-w-[600px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                                        <th className="px-6 py-3 text-[12px] font-bold tracking-wider text-[#4B5563] uppercase">
                                            Nombre
                                        </th>
                                        <th className="w-[140px] px-6 py-3 text-[12px] font-bold tracking-wider text-[#4B5563] uppercase">
                                            Historias
                                        </th>
                                        <th className="w-[120px] px-6 py-3 text-center text-[12px] font-bold tracking-wider text-[#4B5563] uppercase">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F3F4F6]">
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-6 py-10 text-center text-[13px] text-[#6B7280]"
                                            >
                                                Cargando…
                                            </td>
                                        </tr>
                                    ) : rows.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-6 py-10 text-center text-[13px] text-[#7B7B7B]"
                                            >
                                                No hay categorías registradas.
                                            </td>
                                        </tr>
                                    ) : (
                                        rows.map((r) => {
                                            const count =
                                                r.historias_count ?? 0;
                                            const puedeEliminar = count === 0;
                                            return (
                                                <tr
                                                    key={r.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-3.5 text-[13.5px] text-[#4B5563]">
                                                        {r.nombre}
                                                    </td>
                                                    <td className="px-6 py-3.5 text-[13.5px] text-[#4B5563]">
                                                        {count}
                                                    </td>
                                                    <td className="px-6 py-3.5 text-center">
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                !puedeEliminar
                                                            }
                                                            title={
                                                                puedeEliminar
                                                                    ? 'Eliminar categoría'
                                                                    : deleteBlockedTitle
                                                            }
                                                            onClick={() =>
                                                                puedeEliminar &&
                                                                setDeleteTarget(
                                                                    r,
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center rounded p-2 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                                className="text-[14px]"
                                                            />
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
                                <p className="p-8 text-center text-[13px] text-[#6B7280]">
                                    Cargando…
                                </p>
                            ) : rows.length === 0 ? (
                                <p className="p-8 text-center text-[13px] text-[#7B7B7B]">
                                    No hay categorías.
                                </p>
                            ) : (
                                rows.map((r) => {
                                    const count = r.historias_count ?? 0;
                                    const puedeEliminar = count === 0;
                                    return (
                                        <div
                                            key={r.id}
                                            className="flex items-center justify-between gap-3 px-4 py-3"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[13.5px] font-medium text-[#374151]">
                                                    {r.nombre}
                                                </p>
                                                <p className="text-[12px] text-[#9CA3AF]">
                                                    {count} historia(s)
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                disabled={!puedeEliminar}
                                                title={
                                                    puedeEliminar
                                                        ? 'Eliminar'
                                                        : deleteBlockedTitle
                                                }
                                                onClick={() =>
                                                    puedeEliminar &&
                                                    setDeleteTarget(r)
                                                }
                                                className="shrink-0 rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="text-[14px]"
                                                />
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
                                        Mostrando{' '}
                                        <span className="font-semibold text-[#111827]">
                                            {from}
                                        </span>{' '}
                                        a{' '}
                                        <span className="font-semibold text-[#111827]">
                                            {to}
                                        </span>{' '}
                                        de{' '}
                                        <span className="font-semibold text-[#111827]">
                                            {total}
                                        </span>{' '}
                                        registros
                                    </>
                                ) : (
                                    'Sin registros'
                                )}
                            </span>
                            <span className="md:hidden">
                                {from != null
                                    ? `Mostrando ${from} de ${total} registros`
                                    : 'Sin registros'}
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                            <button
                                type="button"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                className={`flex size-8 items-center justify-center rounded-md transition-colors ${
                                    currentPage === 1
                                        ? 'cursor-not-allowed text-[#D1D5DB]'
                                        : 'text-[#7B7B7B] hover:bg-gray-100'
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faChevronLeft}
                                    className="text-xs"
                                />
                            </button>
                            {Array.from(
                                { length: last_page },
                                (_, i) => i + 1,
                            ).map((p) => {
                                if (
                                    p === 1 ||
                                    p === last_page ||
                                    (p >= currentPage - 1 &&
                                        p <= currentPage + 1)
                                ) {
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
                                if (
                                    p === currentPage - 2 ||
                                    p === currentPage + 2
                                ) {
                                    return (
                                        <span
                                            key={p}
                                            className="px-1 text-[#A0A0A0]"
                                        >
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
                                <FontAwesomeIcon
                                    icon={faChevronRight}
                                    className="text-xs"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmDialog
                elevated
                isOpen={deleteTarget !== null}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Eliminar categoría"
                description={
                    deleteTarget
                        ? `¿Eliminar la categoría «${deleteTarget.nombre}»? Esta acción no se puede deshacer.`
                        : ''
                }
                onConfirm={() => void handleConfirmDelete()}
                isProcessing={deleting}
            />
        </>,
        document.body,
    );
}
