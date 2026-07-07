import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faFilter,
    faChevronDown,
    faFileExcel,
    faPlus,
    faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import ListPagination from '@/components/panel/ListPagination';
import type { PaginatedData } from '@/types/pagination';
import { CreateProductModal } from '@/components/admin/CreateProductModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import {
    ProductoTaxonomyManageModal,
    type TaxonomyKind,
} from '@/components/admin/ProductoTaxonomyManageModal';
import { buildExportQuery } from '@/lib/export-query';
import { adminTaxonomiaUrls } from '@/lib/admin-taxonomia-urls';
import { StockAdjuster } from '@/components/admin/StockAdjuster';
import { productos as adminProductosList } from '@/routes/admin';
import {
    destroy as productosDestroy,
    duplicate as productosDuplicate,
    exportMethod as productosExport,
    toggleStatus as productosToggleStatus,
} from '@/routes/admin/productos';

interface Product {
    id: number;
    nombre: string;
    slug: string;
    codigo: string;
    imagen: string | null;
    categoria: string;
    subcategoria: string | null;
    precio: string;
    stock: number;
    estado: string;
}

type CategoriaRow = { id: number; nombre: string };

interface Props {
    productos: PaginatedData<Product>;
    categorias: CategoriaRow[];
    filters: {
        search?: string;
        categoria_id?: string;
    };
}

export default function Products({ productos, categorias, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters.categoria_id || '',
    );

    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const categoryMenuRef = useRef<HTMLDivElement>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editProductId, setEditProductId] = useState<number | null>(null);
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
    const [adjustStockProduct, setAdjustStockProduct] =
        useState<Product | null>(null);
    const [taxonomyModal, setTaxonomyModal] = useState<TaxonomyKind | null>(
        null,
    );
    const [taxonomyCategoriaPadreId, setTaxonomyCategoriaPadreId] = useState<
        number | null
    >(null);

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
                adminProductosList.url({
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

    const handleOpenTaxonomy = (
        kind: TaxonomyKind,
        ctx: { categoriaPadreId: number | null },
    ) => {
        setTaxonomyCategoriaPadreId(ctx.categoriaPadreId);
        setIsCreateModalOpen(false);
        setEditProductId(null);
        setTaxonomyModal(kind);
    };

    const goToPage = (page: number) => {
        router.get(
            adminProductosList.url({
                query: { ...filters, page: String(page) },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDuplicate = (id: number) => {
        router.post(
            productosDuplicate.url(id),
            {},
            { preserveScroll: true, preserveState: false },
        );
    };

    const handleToggleStatus = (id: number) => {
        router.patch(
            productosToggleStatus.url(id),
            {},
            { preserveScroll: true, preserveState: false },
        );
    };

    const handleDeleteClick = (id: number) => {
        setDeleteProductId(id);
    };

    const handleDeleteConfirm = () => {
        if (deleteProductId !== null) {
            router.delete(productosDestroy.url(deleteProductId), {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => setDeleteProductId(null),
            });
        }
    };

    const handleAdjustStockClick = (product: Product) => {
        setAdjustStockProduct(product);
    };

    const {
        data: productList,
        current_page,
        last_page,
        from,
        to,
        total,
    } = productos;

    const renderActionMenu = (product: Product) => (
        <div className="absolute top-full right-0 z-20 mt-1 w-[150px] rounded-[6px] border border-[#F3F4F6] bg-white py-1 text-left shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
            <button
                onClick={() => {
                    setOpenMenuId(null);
                    setIsCreateModalOpen(false);
                    setEditProductId(product.id);
                }}
                className="flex w-full items-center justify-start px-4 py-2.5 text-left text-[14px] text-[#4B5563] transition-colors hover:bg-gray-50"
            >
                Editar
            </button>
            <button
                onClick={() => handleAdjustStockClick(product)}
                className="flex w-full items-center justify-start px-4 py-2.5 text-left text-[14px] text-[#4B5563] transition-colors hover:bg-gray-50"
            >
                Ajustar stock
            </button>
            <button
                onClick={() => handleDuplicate(product.id)}
                className="flex w-full items-center justify-start px-4 py-2.5 text-left text-[14px] text-[#4B5563] transition-colors hover:bg-gray-50"
            >
                Duplicar
            </button>
            <button
                onClick={() => handleToggleStatus(product.id)}
                className="flex w-full items-center justify-start px-4 py-2.5 text-left text-[14px] text-[#4B5563] transition-colors hover:bg-gray-50"
            >
                {product.estado === 'activo' ? 'Pausar' : 'Activar'}
            </button>
            <button
                onClick={() => handleDeleteClick(product.id)}
                className="flex w-full items-center justify-start px-4 py-2.5 text-left text-[14px] text-red-500 transition-colors hover:bg-red-50"
            >
                Eliminar
            </button>
        </div>
    );

    return (
        <UserLayout title="Productos">
            <Head title="Gestión de Productos publicados" />

            <div className="flex flex-col gap-6 px-4 py-6 font-['Inter'] md:px-8">
                {/* Header Section */}
                <div className="mb-2 flex flex-col items-center gap-1 text-center md:mb-0 md:items-start md:text-left">
                    <h1 className="text-[25px] font-bold text-[#1B3D6D] md:text-2xl">
                        Productos publicados
                    </h1>
                    <p className="text-[13.5px] text-[#1B3D6D] md:text-sm md:text-[#7B7B7B]">
                        Crea y gestiona los productos de la página
                    </p>
                </div>

                {/* Filters/Actions Bar */}
                <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    {/* Mobile: Input + Square Filter Button */}
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
                                placeholder="Filtrar por nombre del producto o código de producto"
                                className="block w-full rounded-[4px] border border-[#DFE4EA] bg-white py-[10px] pr-3 pl-[34px] text-[13px] text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-all outline-none placeholder:text-[#1B3D6D]/60 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15 md:rounded-md md:border-[#E5E7EB] md:py-2.5 md:pl-10 md:text-sm md:text-gray-900 md:shadow-none md:placeholder:text-[#A0A0A0]"
                            />
                        </div>

                        {/* Mobile category button */}
                        <div
                            className="relative md:hidden"
                            ref={categoryMenuRef}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCategoryMenuOpen(!isCategoryMenuOpen);
                                }}
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCategoryMenuOpen(!isCategoryMenuOpen);
                                }}
                                className="flex h-full w-full items-center justify-center gap-2 rounded-[4px] border border-[#DFE4EA] bg-white px-4 py-[10px] text-[13px] text-[#4B5563] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-gray-50 md:rounded-md md:py-2.5 md:text-sm"
                            >
                                <FontAwesomeIcon
                                    icon={faFilter}
                                    className="text-[#A0A0A0]"
                                />
                                <span className="font-medium whitespace-nowrap">
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
                                    className={`ml-1 text-[10px] text-[#A0A0A0] transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`}
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
                    </div>

                    <div className="flex w-full flex-col items-center gap-3 md:flex-row lg:w-auto">
                        <button
                            onClick={() => {
                                window.location.href = productosExport.url({
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
                            onClick={() => {
                                setEditProductId(null);
                                setIsCreateModalOpen(true);
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#1B3D6D] px-4 py-[10px] text-[14px] font-bold text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#1B3D6D]/90 md:w-auto md:rounded-md md:py-2.5 md:text-sm md:font-semibold md:shadow-sm"
                        >
                            <span>Crear producto</span>
                            <div className="-mr-1 flex h-4 w-4 items-center justify-center rounded-full border border-white">
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="text-[9px]"
                                />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Main Content Container */}
                <div className="flex w-full flex-col bg-transparent md:rounded-lg md:bg-white md:shadow-[0px_0px_15px_rgba(36,16,167,0.08)]">
                    {/* Desktop Table View */}
                    <div className="hidden overflow-visible md:block">
                        <table className="w-full min-w-[1050px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                                    <th className="w-[100px] px-5 py-4 text-[12px] font-bold tracking-wider text-[#4B5563] uppercase">
                                        Código
                                    </th>
                                    <th className="w-[240px] px-5 py-4 text-[12px] font-bold tracking-wider text-[#4B5563] uppercase">
                                        Producto
                                    </th>
                                    <th className="px-5 py-4 text-[12px] font-bold tracking-wider text-[#4B5563] uppercase">
                                        Categoría
                                    </th>
                                    <th className="px-5 py-4 text-[12px] font-bold tracking-wider text-[#4B5563] uppercase">
                                        Subcategoría
                                    </th>
                                    <th className="px-5 py-4 text-[12px] font-bold tracking-wider whitespace-nowrap text-[#4B5563] uppercase">
                                        Precio
                                    </th>
                                    <th className="px-5 py-4 text-[12px] font-bold tracking-wider text-[#4B5563] uppercase">
                                        Stock
                                    </th>
                                    <th className="px-5 py-4 text-[12px] font-bold tracking-wider text-[#4B5563] uppercase">
                                        <div className="flex items-center gap-2">
                                            Estado{' '}
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                className="text-[10px] opacity-40"
                                            />
                                        </div>
                                    </th>
                                    <th className="px-5 py-4 text-center text-[12px] font-bold tracking-wider text-[#4B5563] uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {productList.length > 0 ? (
                                    productList.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4 text-[13.5px] text-[#4B5563]">
                                                {product.codigo}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            product.imagen ||
                                                            '/images/placeholder.svg'
                                                        }
                                                        alt={product.nombre}
                                                        className="h-[42px] w-[42px] rounded border border-gray-100/50 object-cover"
                                                    />
                                                    <span className="text-[13.5px] text-[#4B5563]">
                                                        {product.nombre}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-[13.5px] text-[#4B5563]">
                                                {product.categoria}
                                            </td>
                                            <td className="px-5 py-4 text-[13.5px] text-[#4B5563]">
                                                {product.subcategoria || '-'}
                                            </td>
                                            <td className="px-5 py-4 text-[13.5px] whitespace-nowrap text-[#4B5563]">
                                                $
                                                {Number(product.precio).toFixed(
                                                    2,
                                                )}
                                            </td>
                                            <td className="px-5 py-4 pl-8 text-[13.5px] text-[#4B5563]">
                                                {product.stock}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded px-[8px] py-[1.5px] text-[11.5px] font-medium tracking-wide ${product.estado === 'activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#FEE2E2] text-[#EF4444]'}`}
                                                >
                                                    {product.estado
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        product.estado.slice(1)}
                                                </span>
                                            </td>
                                            <td className="relative px-5 py-4 text-center">
                                                <div className="relative inline-block text-left">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const menuKey = `desktop-${product.id}`;
                                                            setOpenMenuId(
                                                                openMenuId ===
                                                                    menuKey
                                                                    ? null
                                                                    : menuKey,
                                                            );
                                                        }}
                                                        className="rounded-full p-2 text-[#4B5563] transition-colors outline-none hover:bg-gray-100 hover:text-[#1B3D6D]"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEllipsisV}
                                                            className="text-[15px]"
                                                        />
                                                    </button>
                                                    {openMenuId ===
                                                        `desktop-${product.id}` &&
                                                        renderActionMenu(
                                                            product,
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-5 py-10 text-center text-sm text-[#7B7B7B]"
                                        >
                                            No se encontraron productos que
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
                            {productList.length > 0 ? (
                                productList.map((product) => (
                                    <div
                                        key={product.id}
                                        className="relative flex gap-3 py-[18px]"
                                    >
                                        <div className="shrink-0">
                                            <img
                                                src={
                                                    product.imagen ||
                                                    '/images/placeholder.svg'
                                                }
                                                alt={product.nombre}
                                                className="h-[88px] w-[88px] rounded-[6px] border border-gray-100 bg-gray-100 object-cover shadow-sm"
                                            />
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <div className="relative flex w-full items-center justify-between">
                                                <span className="text-[13px] text-[#4B5563]">
                                                    {product.codigo}
                                                </span>
                                                <div className="absolute right-0 flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center justify-center rounded px-[8px] py-[2px] text-[11.5px] font-medium tracking-wide ${product.estado === 'activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#FEE2E2] text-[#EF4444]'}`}
                                                    >
                                                        {product.estado
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            product.estado.slice(
                                                                1,
                                                            )}
                                                    </span>
                                                    <div className="relative inline-block text-left">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const menuKey = `mobile-${product.id}`;
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
                                                                icon={
                                                                    faEllipsisV
                                                                }
                                                                className="text-sm"
                                                            />
                                                        </button>
                                                        {openMenuId ===
                                                            `mobile-${product.id}` &&
                                                            renderActionMenu(
                                                                product,
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-1 max-w-[95%] pr-6 text-[13.5px] leading-tight text-[#4B5563]">
                                                {product.nombre}
                                            </div>
                                            <div className="mt-1 flex items-center justify-between">
                                                <div className="text-[13px] text-[#4B5563]">
                                                    Precio:{' '}
                                                    <span className="font-medium text-[#111827]">
                                                        $
                                                        {Number(
                                                            product.precio,
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="pr-6 text-[13px] text-[#4B5563]">
                                                    Stock:{' '}
                                                    <span className="font-medium text-[#111827]">
                                                        {product.stock}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 grid grid-cols-2 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10.5px] text-[#A0A0A0]">
                                                        Categoría
                                                    </span>
                                                    <span className="text-[12px] text-[#4B5563]">
                                                        {product.categoria}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end text-right">
                                                    <span className="text-[10.5px] text-[#A0A0A0]">
                                                        Subcategoría
                                                    </span>
                                                    <span className="text-[12px] text-[#4B5563]">
                                                        {product.subcategoria ||
                                                            '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-[13px] text-[#7B7B7B]">
                                    No se encontraron productos que coincidan
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

            <CreateProductModal
                isOpen={isCreateModalOpen || editProductId !== null}
                editingProductId={editProductId}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditProductId(null);
                }}
                categorias={categorias}
                onOpenTaxonomy={handleOpenTaxonomy}
            />

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
                categoriaPadreId={taxonomyCategoriaPadreId}
                onSaved={() => {
                    if (taxonomyCategoriaPadreId == null) {
                        return;
                    }

                    void fetch(
                        adminTaxonomiaUrls.productoSubcategorias.index({
                            producto_categoria_id: taxonomyCategoriaPadreId,
                            per_page: 200,
                        }),
                        {
                            credentials: 'same-origin',
                            headers: {
                                Accept: 'application/json',
                                'X-Requested-With': 'XMLHttpRequest',
                            },
                        },
                    );
                }}
            />

            <ConfirmDialog
                isOpen={deleteProductId !== null}
                onOpenChange={(open) => !open && setDeleteProductId(null)}
                title="Eliminar Producto"
                description="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
                onConfirm={handleDeleteConfirm}
            />

            {adjustStockProduct && (
                <StockAdjuster
                    isOpen={adjustStockProduct !== null}
                    onOpenChange={(open) =>
                        !open && setAdjustStockProduct(null)
                    }
                    productoId={adjustStockProduct.id}
                    productoNombre={adjustStockProduct.nombre}
                    currentStock={adjustStockProduct.stock}
                />
            )}
        </UserLayout>
    );
}
