import {
    faSearch,
    faFileExcel,
    faChevronDown,
    faFilter,
    faPlus,
    faEllipsisV,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, router } from '@inertiajs/react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { historias as adminHistoriasList } from '@/routes/admin';
import {
    destroy as historiasDestroy,
    duplicate as historiasDuplicate,
    exportMethod as historiasExport,
    toggleStatus as historiasToggleStatus,
} from '@/routes/admin/historias';
import type { HistoriaDetalleInclusionRow } from '@/components/admin/create-story/types';
import { CreateStoryModal } from '@/components/admin/CreateStoryModal';
import { HistoriaCategoriaManageModal } from '@/components/admin/HistoriaCategoriaManageModal';
import { buildExportQuery } from '@/lib/export-query';
import UserLayout from '@/layouts/user-layout';
import ListPagination from '@/components/panel/ListPagination';
import type { PaginatedData } from '@/types/pagination';

type CategoriaRow = { id: number; nombre: string };

interface HistoriaGaleriaItem {
    id: number;
    path: string;
    es_principal: boolean;
}

interface HistoriaVarianteItem {
    id?: number;
    tipo?: 'papel' | 'color' | string;
    valor?: string | null;
}

interface Story {
    id: number;
    nombre: string;
    slug: string;
    codigo: string;
    imagen: string | null;
    categoria: string;
    autor: string;
    precio_base: string;
    estado: string;
    destacada?: string | null;
    fecha_publicacion: string;
    descripcion_corta?: string;
    descripcion_larga?: string;
    detalle?: HistoriaDetalleInclusionRow[] | null;
    video?: string | null;
    precio_promocional?: string | null;
    impuesto?: string | null;
    peso?: string | null;
    dimensiones?: string | null;
    duracion_meses?: number | string | null;
    galeria?: HistoriaGaleriaItem[];
    variantes?: HistoriaVarianteItem[];
}

interface Props {
    historias: PaginatedData<Story>;
    categorias: CategoriaRow[];
    filters: {
        search?: string;
        categoria_id?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function Stories({ historias, categorias, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters.categoria_id || '',
    );
    const [isCategoriaManageOpen, setIsCategoriaManageOpen] = useState(false);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const categoryMenuRef = useRef<HTMLDivElement>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<any>(null);
    const [deleteStoryId, setDeleteStoryId] = useState<number | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                categoryMenuRef.current &&
                !categoryMenuRef.current.contains(event.target as Node)
            ) {
                setIsCategoryMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        const closeActionMenu = () => setOpenMenuId(null);
        document.addEventListener('click', closeActionMenu);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('click', closeActionMenu);
        };
    }, []);

    const applyFilters = useCallback(
        (params: Record<string, string>) => {
            router.get(
                adminHistoriasList.url({
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

    const handleCategorySelect = (categoriaId: string) => {
        setSelectedCategory(categoriaId);
        setIsCategoryMenuOpen(false);
        applyFilters({ categoria_id: categoriaId });
    };

    const handleOpenCategoriaManage = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedStory(null);
        setIsCategoriaManageOpen(true);
    };

    const goToPage = (page: number) => {
        router.get(
            adminHistoriasList.url({
                query: { ...filters, page: String(page) },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDuplicate = (id: number) => {
        router.post(historiasDuplicate.url(id), {}, { preserveScroll: true });
    };

    const handleToggleStatus = (id: number) => {
        router.patch(
            historiasToggleStatus.url(id),
            {},
            { preserveScroll: true },
        );
    };

    const handleDeleteClick = (id: number) => {
        setDeleteStoryId(id);
    };

    const handleEdit = (story: Story) => {
        setSelectedStory(story);
        setIsEditModalOpen(true);
    };

    const handlePreview = (story: Story) => {
        setSelectedStory(story);
        setIsPreviewModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteStoryId !== null) {
            router.delete(historiasDestroy.url(deleteStoryId), {
                preserveScroll: true,
                onSuccess: () => setDeleteStoryId(null),
            });
        }
    };

    const {
        data: storyList,
        current_page,
        last_page,
        from,
        to,
        total,
    } = historias;

    const renderActionMenu = (story: Story) => (
        <div className="absolute top-full right-0 z-20 mt-1 w-40 rounded-md border border-[#E5E7EB] bg-white py-1 text-left shadow-lg">
            <button
                onClick={() => handlePreview(story)}
                className="w-full px-4 py-2 text-left text-[13px] text-[#4B5563] transition-colors hover:bg-gray-50"
            >
                Vista Previa
            </button>
            <button
                onClick={() => handleEdit(story)}
                className="w-full px-4 py-2 text-left text-[13px] text-[#4B5563] transition-colors hover:bg-gray-50"
            >
                Editar
            </button>
            <div className="mx-2 my-1 h-[1px] bg-[#F3F4F6]"></div>
            <button
                onClick={() => handleDuplicate(story.id)}
                className="w-full px-4 py-2 text-left text-[13px] text-[#4B5563] transition-colors hover:bg-gray-50"
            >
                Duplicar
            </button>
            <button
                onClick={() => handleToggleStatus(story.id)}
                className="w-full px-4 py-2 text-left text-[13px] text-[#4B5563] transition-colors hover:bg-gray-50"
            >
                {story.estado === 'activo' ? 'Pausar' : 'Activar'}
            </button>
            <button
                onClick={() => handleDeleteClick(story.id)}
                className="w-full px-4 py-2 text-left text-[13px] text-red-500 transition-colors hover:bg-red-50"
            >
                Eliminar
            </button>
        </div>
    );

    return (
        <UserLayout title="Historias">
            <Head title="Gestión de Historias publicadas" />

            <div className="flex flex-col gap-6 px-4 py-6 font-['Inter'] md:px-8">
                {/* Header Section */}
                <div className="mb-2 flex flex-col items-center gap-1 text-center md:mb-0 md:items-start md:text-left">
                    <h1 className="text-[25px] font-bold text-[#1B3D6D] md:text-2xl">
                        Historias publicadas
                    </h1>
                    <p className="text-[13.5px] text-[#1B3D6D] md:text-sm md:text-[#7B7B7B]">
                        Crea y gestiona las historias de la página
                    </p>
                </div>

                {/* Filters/Actions Bar */}
                <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex w-full gap-2 lg:max-w-xl lg:flex-1">
                        <div className="relative flex-1">
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
                                placeholder="Filtrar por nombre de la historia..."
                                className="block w-full rounded-[4px] border border-[#DFE4EA] bg-white py-[10px] pr-3 pl-[34px] text-[13px] text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-all outline-none placeholder:text-[#1B3D6D]/60 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15 md:rounded-md md:border-[#E5E7EB] md:py-2.5 md:pl-10 md:text-sm md:text-gray-900 md:shadow-none md:placeholder:text-[#A0A0A0]"
                            />
                        </div>
                        {/* Mobile category button */}
                        <div
                            className="relative md:hidden"
                            ref={categoryMenuRef}
                        >
                            <button
                                onClick={() =>
                                    setIsCategoryMenuOpen(!isCategoryMenuOpen)
                                }
                                className="flex h-full w-10 items-center justify-center rounded-[4px] border border-[#DFE4EA] bg-white text-[#A0A0A0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
                            >
                                <FontAwesomeIcon
                                    icon={faFilter}
                                    className="text-[14px]"
                                />
                            </button>
                            {isCategoryMenuOpen && (
                                <div className="absolute top-full right-0 z-10 mt-2 w-48 rounded-md border border-[#E5E7EB] bg-white py-1 shadow-lg">
                                    <button
                                        onClick={() => handleCategorySelect('')}
                                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Todas
                                    </button>
                                    {categorias.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() =>
                                                handleCategorySelect(
                                                    String(cat.id),
                                                )
                                            }
                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {cat.nombre}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Categoría Filter Desktop */}
                        <div
                            className="relative hidden shrink-0 md:block"
                            ref={categoryMenuRef}
                        >
                            <button
                                onClick={() =>
                                    setIsCategoryMenuOpen(!isCategoryMenuOpen)
                                }
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-[#DFE4EA] bg-white px-4 py-[10px] text-[13px] text-[#4B5563] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-gray-50 md:w-auto md:justify-start md:rounded-md md:border-[#E5E7EB] md:py-2.5 md:text-sm"
                            >
                                <FontAwesomeIcon
                                    icon={faFilter}
                                    className="text-[#A0A0A0]"
                                />
                                <span className="font-medium opacity-80 md:opacity-100">
                                    {selectedCategory
                                        ? (categorias.find(
                                              (c) =>
                                                  String(c.id) ===
                                                  selectedCategory,
                                          )?.nombre ?? 'Categoría')
                                        : 'Categoría'}
                                </span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`ml-1 text-[10px] text-[#A0A0A0] transition-transform md:text-xs ${isCategoryMenuOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {isCategoryMenuOpen && (
                                <div className="absolute top-full left-0 z-10 mt-2 w-full rounded-md border border-[#E5E7EB] bg-white py-1 shadow-lg md:w-48">
                                    <button
                                        onClick={() => handleCategorySelect('')}
                                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Todas
                                    </button>
                                    {categorias.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() =>
                                                handleCategorySelect(
                                                    String(cat.id),
                                                )
                                            }
                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {cat.nombre}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex w-full flex-col items-center gap-3 md:flex-row lg:w-auto">
                        <button
                            onClick={() => {
                                window.location.href = historiasExport.url({
                                    query: buildExportQuery(filters),
                                });
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#1B3D6D] bg-white px-4 py-[10px] text-[14px] font-bold text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#F8F9FA] md:w-auto md:rounded-md md:py-2.5 md:text-sm md:font-semibold md:shadow-sm"
                        >
                            <span>Exportar a excel</span>
                            <FontAwesomeIcon
                                icon={faFileExcel}
                                className="text-[12px] md:text-[14px]"
                            />
                        </button>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#1B3D6D] px-4 py-[10px] text-[14px] font-bold text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#1B3D6D]/90 md:w-auto md:rounded-md md:py-2.5 md:text-sm md:font-semibold md:shadow-sm"
                        >
                            <span>Crear historia</span>
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="text-[12px] md:text-[14px]"
                            />
                        </button>
                    </div>
                </div>

                {/* Main Content Container */}
                <div className="flex w-full flex-col bg-transparent md:rounded-lg md:bg-white md:shadow-[0px_0px_15px_rgba(36,16,167,0.08)]">
                    {/* Desktop Table View */}
                    <div className="hidden overflow-visible md:block">
                        <table className="w-full min-w-[1000px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                                    <th className="w-[120px] px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Código
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Historia
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Categoría
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Autor
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Precio
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        <div className="flex items-center gap-2">
                                            Estado{' '}
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                className="text-[10px] opacity-50"
                                            />
                                        </div>
                                    </th>
                                    <th className="px-5 py-4 text-center text-xs font-bold tracking-wider text-[#7B7B7B] uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {storyList.length > 0 ? (
                                    storyList.map((story) => (
                                        <tr
                                            key={story.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4 text-sm font-semibold text-[#1B3D6D]">
                                                {story.codigo}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            story.imagen ||
                                                            '/images/placeholder.svg'
                                                        }
                                                        alt={story.nombre}
                                                        className="h-10 w-10 rounded bg-gray-100 object-cover shadow-sm"
                                                    />
                                                    <span className="text-sm font-medium text-[#111827]">
                                                        {story.nombre}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {story.categoria}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                {story.autor}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">
                                                $
                                                {Number(
                                                    story.precio_base,
                                                ).toFixed(2)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded px-2.5 py-0.5 text-[11.5px] font-semibold tracking-wide ${story.estado === 'activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#E0F2FE] text-[#0284C7]'}`}
                                                >
                                                    {story.estado
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        story.estado.slice(1)}
                                                </span>
                                            </td>
                                            <td className="relative px-5 py-4 text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const menuKey = `desktop-${story.id}`;
                                                        setOpenMenuId(
                                                            openMenuId ===
                                                                menuKey
                                                                ? null
                                                                : menuKey,
                                                        );
                                                    }}
                                                    className="rounded-full p-2 text-[#7B7B7B] transition-colors outline-none hover:bg-gray-100 hover:text-[#1B3D6D]"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEllipsisV}
                                                        className="text-sm"
                                                    />
                                                </button>
                                                {openMenuId ===
                                                    `desktop-${story.id}` &&
                                                    renderActionMenu(story)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-10 text-center text-sm text-[#7B7B7B]"
                                        >
                                            No se encontraron historias que
                                            coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="mb-4 block flex flex-col rounded-[10px] bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.04)] md:hidden">
                        <div className="flex w-full flex-col divide-y divide-[#F3F4F6] px-4">
                            {storyList.length > 0 ? (
                                storyList.map((story) => (
                                    <div
                                        key={story.id}
                                        className="relative flex gap-3 py-[18px]"
                                    >
                                        <div className="shrink-0">
                                            <img
                                                src={
                                                    story.imagen ||
                                                    '/images/placeholder.svg'
                                                }
                                                alt={story.nombre}
                                                className="h-[88px] w-[88px] rounded-[6px] border border-gray-100 bg-gray-100 object-cover shadow-sm"
                                            />
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <div className="relative flex w-full items-center justify-between">
                                                <span className="text-[13px] text-[#4B5563]">
                                                    {story.codigo}
                                                </span>
                                                <div className="absolute right-0 flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center justify-center rounded px-[8px] py-[2px] text-[11.5px] font-medium tracking-wide ${story.estado === 'activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#E0F2FE] text-[#0284C7]'}`}
                                                    >
                                                        {story.estado
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            story.estado.slice(
                                                                1,
                                                            )}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const menuKey = `mobile-${story.id}`;
                                                            setOpenMenuId(
                                                                openMenuId ===
                                                                    menuKey
                                                                    ? null
                                                                    : menuKey,
                                                            );
                                                        }}
                                                        className="text-[#4B5563] outline-none"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEllipsisV}
                                                            className="text-sm"
                                                        />
                                                    </button>
                                                </div>
                                                {openMenuId ===
                                                    `mobile-${story.id}` &&
                                                    renderActionMenu(story)}
                                            </div>
                                            <div className="mt-1 max-w-[95%] pr-6 text-[13.5px] leading-tight text-[#4B5563]">
                                                {story.nombre}
                                            </div>
                                            <div className="mt-1 text-[13px] text-[#4B5563]">
                                                Precio: $
                                                {Number(
                                                    story.precio_base,
                                                ).toFixed(2)}
                                            </div>
                                            <div className="mt-2 grid grid-cols-2 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10.5px] text-[#A0A0A0]">
                                                        Categoría
                                                    </span>
                                                    <span className="text-[12.5px] text-[#4B5563]">
                                                        {story.categoria}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end text-right">
                                                    <span className="text-[10.5px] text-[#A0A0A0]">
                                                        Autor
                                                    </span>
                                                    <span className="w-full truncate text-[12.5px] text-[#4B5563]">
                                                        {story.autor}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-[13px] text-[#7B7B7B]">
                                    No se encontraron historias que coincidan
                                    con la búsqueda.
                                </div>
                            )}
                        </div>
                    </div>

                    <ListPagination
                        currentPage={current_page}
                        lastPage={last_page}
                        from={from}
                        to={to}
                        total={total}
                        onPageChange={goToPage}
                        variant="admin"
                        className="mt-2 justify-center bg-transparent md:mt-0 md:justify-between md:bg-white md:py-4"
                    />
                </div>
            </div>

            {/* Modals */}
            <CreateStoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                categorias={categorias}
                onOpenCategoriaManage={handleOpenCategoriaManage}
            />

            <CreateStoryModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedStory(null);
                }}
                categorias={categorias}
                storyToEdit={selectedStory}
                onOpenCategoriaManage={handleOpenCategoriaManage}
            />

            <HistoriaCategoriaManageModal
                isOpen={isCategoriaManageOpen}
                onClose={() => setIsCategoriaManageOpen(false)}
                onSaved={() => router.reload({ only: ['categorias'] })}
            />

            {isPreviewModalOpen && selectedStory && (
                <PreviewStoryModal
                    story={selectedStory}
                    onClose={() => {
                        setIsPreviewModalOpen(false);
                        setSelectedStory(null);
                    }}
                />
            )}

            <ConfirmDialog
                isOpen={deleteStoryId !== null}
                onOpenChange={(open) => !open && setDeleteStoryId(null)}
                onConfirm={handleDeleteConfirm}
                title="Eliminar Historia"
                description="¿Estás seguro de que deseas eliminar esta historia? Esta acción no se puede deshacer."
            />
        </UserLayout>
    );
}

// Pantalla de Vista Previa Minimalista (contenedor desplazable + altura máxima para no desbordar en viewport)
function PreviewStoryModal({
    story,
    onClose,
}: {
    story: any;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-[60] overflow-x-hidden overflow-y-auto bg-black/60 backdrop-blur-sm"
            style={{
                paddingTop: 'max(1rem, env(safe-area-inset-top))',
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            }}
        >
            <div className="flex min-h-[min(calc(100dvh-2rem),calc(100svh-2rem))] items-center justify-center p-4 sm:p-6">
                <div
                    className="my-auto flex max-h-[min(calc(100dvh-2rem),calc(100svh-2rem))] w-full max-w-2xl animate-in flex-col overflow-hidden rounded-lg bg-white shadow-2xl duration-200 fade-in zoom-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative h-36 shrink-0 bg-gray-200 sm:h-48 md:h-56">
                        <img
                            src={story.imagen || '/images/placeholder.svg'}
                            alt={story.nombre}
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40 sm:top-4 sm:right-4 sm:size-10"
                            aria-label="Cerrar vista previa"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
                        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <div className="min-w-0 flex-1">
                                <h2 className="text-xl font-bold tracking-tight text-[#1B3D6D] sm:text-2xl">
                                    {story.nombre}
                                </h2>
                                <p className="mt-0.5 text-[13px] text-[#7B7B7B] sm:text-[14px]">
                                    {story.categoria} • Por{' '}
                                    <span className="font-semibold text-[#1B3D6D]">
                                        {story.autor}
                                    </span>
                                </p>
                            </div>
                            <span
                                className={`shrink-0 self-start rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase sm:self-auto ${story.estado === 'activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#E0F2FE] text-[#0284C7]'}`}
                            >
                                {story.estado}
                            </span>
                        </div>

                        <div className="mb-6 grid grid-cols-1 gap-4 border-y border-gray-100 py-5 sm:grid-cols-2">
                            <div className="text-center sm:border-r sm:border-gray-100">
                                <p className="mb-1 text-[10px] font-bold tracking-widest text-[#A0A0A0] uppercase">
                                    Precio Base
                                </p>
                                <p className="font-mono text-sm leading-none font-bold text-[#4B5563]">
                                    $
                                    {Number(story.precio_base)
                                        .toFixed(2)
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="mb-1 text-[10px] font-bold tracking-widest text-[#A0A0A0] uppercase">
                                    Código
                                </p>
                                <p className="text-sm font-bold break-all text-[#4B5563]">
                                    {story.codigo}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <h4 className="mb-2 text-[12px] font-bold tracking-wider text-[#1B3D6D] uppercase">
                                    Resumen
                                </h4>
                                <p className="text-[13px] leading-relaxed text-[#4B5563] italic sm:text-[14px]">
                                    &ldquo;{story.descripcion_corta}&rdquo;
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-2 text-[12px] font-bold tracking-wider text-[#1B3D6D] uppercase">
                                    Descripción Completa
                                </h4>
                                <div
                                    className="line-clamp-6 max-w-none text-[13px] leading-relaxed break-words text-[#6B7280] sm:line-clamp-none sm:max-h-[min(40vh,320px)] sm:overflow-y-auto sm:overscroll-contain"
                                    dangerouslySetInnerHTML={{
                                        __html: story.descripcion_larga,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-8 sm:py-5">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full rounded-md bg-[#1B3D6D] px-6 py-2.5 text-[13px] font-bold text-white shadow-lg transition-all hover:bg-[#1B3D6D]/90 sm:w-auto sm:px-8"
                            >
                                Finalizar Vista Previa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
