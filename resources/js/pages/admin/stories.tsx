import React, { useState, useRef, useEffect, useCallback } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faFileExcel,
    faChevronDown,
    faFilter,
    faChevronLeft,
    faChevronRight,
    faCalendarAlt,
    faPlus,
    faEllipsisV,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import { CreateStoryModal } from '@/components/admin/CreateStoryModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

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
    fecha_publicacion: string;
    descripcion_corta?: string;
    descripcion_larga?: string;
    detalle?: string | null;
    video?: string | null;
    precio_promocional?: string | null;
    impuesto?: string | null;
    peso?: string | null;
    dimensiones?: string | null;
    duracion_meses?: number | string | null;
    galeria?: HistoriaGaleriaItem[];
    variantes?: HistoriaVarianteItem[];
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Props {
    historias: PaginatedData<Story>;
    categorias: string[];
    filters: {
        search?: string;
        categoria?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function Stories({ historias, categorias, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.categoria || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
    const dateMenuRef = useRef<HTMLDivElement>(null);
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
            if (dateMenuRef.current && !dateMenuRef.current.contains(event.target as Node)) {
                setIsDateMenuOpen(false);
            }
            if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
                setIsCategoryMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        const closeActionMenu = () => setOpenMenuId(null);
        document.addEventListener("click", closeActionMenu);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("click", closeActionMenu);
        }
    }, []);

    const applyFilters = useCallback(
        (params: Record<string, string>) => {
            router.get(
                '/admin/historias',
                { ...filters, ...params, page: '1' },
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

    const handleCategorySelect = (cat: string) => {
        setSelectedCategory(cat);
        setIsCategoryMenuOpen(false);
        applyFilters({ categoria: cat });
    };

    const handleDateApply = () => {
        applyFilters({ start_date: startDate, end_date: endDate });
        setIsDateMenuOpen(false);
    };

    const handleDateClear = () => {
        setStartDate('');
        setEndDate('');
        applyFilters({ start_date: '', end_date: '' });
    };

    const goToPage = (page: number) => {
        router.get(
            '/admin/historias',
            { ...filters, page: String(page) },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDuplicate = (id: number) => {
        router.post(`/admin/historias/${id}/duplicate`, {}, { preserveScroll: true });
    };

    const handleToggleStatus = (id: number) => {
        router.patch(`/admin/historias/${id}/toggle-status`, {}, { preserveScroll: true });
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
            router.delete(`/admin/historias/${deleteStoryId}`, {
                preserveScroll: true,
                onSuccess: () => setDeleteStoryId(null)
            });
        }
    };

    const formatDateLabel = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const { data: storyList, current_page, last_page, from, to, total } = historias;

    const renderActionMenu = (story: Story, menuKey: string) => (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#E5E7EB] rounded-md shadow-lg z-20 py-1 text-left">
            <button onClick={() => handlePreview(story)} className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 transition-colors">Vista Previa</button>
            <button onClick={() => handleEdit(story)} className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 transition-colors">Editar</button>
            <div className="h-[1px] bg-[#F3F4F6] mx-2 my-1"></div>
            <button onClick={() => handleDuplicate(story.id)} className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 transition-colors">Duplicar</button>
            <button onClick={() => handleToggleStatus(story.id)} className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 transition-colors">
                {story.estado === 'activo' ? 'Pausar' : 'Activar'}
            </button>
            <button onClick={() => handleDeleteClick(story.id)} className="w-full text-left px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors">Eliminar</button>
        </div>
    );

    return (
        <UserLayout title="Historias">
            <Head title="Gestión de Historias publicadas" />

            <div className="flex flex-col gap-6 px-4 md:px-8 py-6 font-['Inter']">
                {/* Header Section */}
                <div className="flex flex-col gap-1 items-center text-center md:items-start md:text-left mb-2 md:mb-0">
                    <h1 className="text-[25px] md:text-2xl font-bold text-[#1B3D6D]">
                        Historias publicadas
                    </h1>
                    <p className="text-[13.5px] md:text-sm text-[#1B3D6D] md:text-[#7B7B7B]">
                        Crea y gestiona las historias de la página
                    </p>
                </div>

                {/* Filters/Actions Bar */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full">
                    <div className="flex gap-2 w-full lg:max-w-xl lg:flex-1">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} className="text-[#1B3D6D] md:text-[#A0A0A0] opacity-60 md:opacity-100 text-[13px] md:text-sm" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Filtrar por nombre de la historia..."
                                className="block w-full rounded-[4px] md:rounded-md border border-[#DFE4EA] md:border-[#E5E7EB] bg-white py-[10px] md:py-2.5 pl-[34px] md:pl-10 pr-3 text-[13px] md:text-sm text-[#1B3D6D] md:text-gray-900 placeholder:text-[#1B3D6D]/60 md:placeholder:text-[#A0A0A0] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15 outline-none transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.05)] md:shadow-none"
                            />
                        </div>
                        {/* Mobile category button */}
                        <div className="md:hidden relative" ref={categoryMenuRef}>
                            <button 
                                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                                className="flex justify-center items-center rounded-[4px] border border-[#DFE4EA] bg-white w-10 h-full text-[#A0A0A0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
                            >
                                <FontAwesomeIcon icon={faFilter} className="text-[14px]" />
                            </button>
                            {isCategoryMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 z-10 w-48 rounded-md border border-[#E5E7EB] bg-white py-1 shadow-lg">
                                    <button onClick={() => handleCategorySelect('')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Todas</button>
                                    {categorias.map(cat => (
                                        <button key={cat} onClick={() => handleCategorySelect(cat)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{cat}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row flex-wrap items-center gap-3 w-full lg:w-auto mt-0 lg:mt-0">
                        {/* Categoría Filter Desktop */}
                        <div className="hidden md:block relative w-full md:w-auto" ref={categoryMenuRef}>
                            <button 
                                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                                className="flex w-full md:w-auto justify-center md:justify-start items-center gap-2 rounded-[4px] md:rounded-md border border-[#DFE4EA] md:border-[#E5E7EB] bg-white px-4 py-[10px] md:py-2.5 text-[13px] md:text-sm text-[#4B5563] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <FontAwesomeIcon icon={faFilter} className="text-[#A0A0A0]" />
                                <span className="font-medium opacity-80 md:opacity-100">
                                    {selectedCategory || 'Categoría'}
                                </span>
                                <FontAwesomeIcon icon={faChevronDown} className={`text-[#A0A0A0] ml-1 text-[10px] md:text-xs transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isCategoryMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 z-10 w-full md:w-48 rounded-md border border-[#E5E7EB] bg-white py-1 shadow-lg">
                                    <button onClick={() => handleCategorySelect('')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Todas</button>
                                    {categorias.map(cat => (
                                        <button key={cat} onClick={() => handleCategorySelect(cat)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{cat}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Rango de Fechas Filter Desktop */}
                        <div className="hidden md:block relative w-full md:w-auto" ref={dateMenuRef}>
                            <div 
                                onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                                className="flex w-full md:w-auto justify-center md:justify-start items-center gap-2 rounded-[4px] md:rounded-md border border-[#DFE4EA] md:border-[#E5E7EB] bg-white px-4 py-[10px] md:py-2.5 text-[13px] md:text-sm text-[#1B3D6D] md:text-[#4B5563] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-[#1B3D6D] md:text-[#A0A0A0] opacity-60 md:opacity-100" />
                                <span className="font-medium md:font-medium opacity-80 md:opacity-100">
                                    {startDate && endDate 
                                        ? `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}` 
                                        : startDate 
                                            ? `Desde ${formatDateLabel(startDate)}` 
                                            : endDate 
                                                ? `Hasta ${formatDateLabel(endDate)}` 
                                                : 'Rango de fechas'}
                                </span>
                                <FontAwesomeIcon icon={faChevronDown} className={`text-[#1B3D6D] md:text-[#A0A0A0] opacity-60 md:opacity-100 ml-1 text-[10px] md:text-xs transition-transform ${isDateMenuOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {isDateMenuOpen && (
                                <div className="absolute top-full right-0 lg:left-0 lg:right-auto mt-2 z-10 w-full md:w-72 rounded-md border border-[#E5E7EB] bg-white p-4 shadow-lg">
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-[#7B7B7B]">Desde (Publicación):</label>
                                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded border border-[#E5E7EB] p-2 text-sm text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]" />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-[#7B7B7B]">Hasta (Publicación):</label>
                                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded border border-[#E5E7EB] p-2 text-sm text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]" />
                                        </div>
                                        <div className="mt-2 flex justify-end gap-2">
                                            <button onClick={handleDateClear} className="rounded px-3 py-1.5 text-xs text-[#7B7B7B] font-medium hover:bg-gray-100 transition-colors">Limpiar</button>
                                            <button onClick={handleDateApply} className="rounded bg-[#1B3D6D] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1B3D6D]/90 transition-colors">Aplicar</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-3">
                            <button 
                                onClick={() => {
                                    const params = new URLSearchParams(filters as any).toString();
                                    window.location.href = `/admin/historias/export?${params}`;
                                }}
                                className="flex w-full md:w-auto justify-center items-center gap-2 rounded-[4px] md:rounded-md border border-[#1B3D6D] bg-white px-4 py-[10px] md:py-2.5 text-[14px] md:text-sm font-bold md:font-semibold text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] md:shadow-sm hover:bg-[#F8F9FA] transition-colors"
                            >
                                <span>Exportar a excel</span>
                                <FontAwesomeIcon icon={faFileExcel} className="text-[12px] md:text-[14px]" />
                            </button>

                            <button onClick={() => setIsCreateModalOpen(true)} className="flex w-full md:w-auto justify-center items-center gap-2 rounded-[4px] md:rounded-md bg-[#1B3D6D] px-4 py-[10px] md:py-2.5 text-[14px] md:text-sm font-bold md:font-semibold text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] md:shadow-sm hover:bg-[#1B3D6D]/90 transition-colors">
                                <span>Crear historia</span>
                                <FontAwesomeIcon icon={faPlus} className="text-[12px] md:text-[14px]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Container */}
                <div className="flex flex-col bg-transparent md:bg-white md:shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:rounded-lg w-full">
                    
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-visible">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider w-[120px]">Código</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Historia</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Categoría</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Autor</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">Precio</th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            Estado <FontAwesomeIcon icon={faFilter} className="text-[10px] opacity-50" />
                                        </div>
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {storyList.length > 0 ? (
                                    storyList.map((story) => (
                                        <tr key={story.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4 text-sm font-semibold text-[#1B3D6D]">{story.codigo}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img 
                                                        src={story.imagen || '/images/placeholder.svg'} 
                                                        alt={story.nombre} 
                                                        className="w-10 h-10 rounded object-cover shadow-sm bg-gray-100"
                                                    />
                                                    <span className="text-sm font-medium text-[#111827]">{story.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{story.categoria}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{story.autor}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">${Number(story.precio_base).toFixed(2)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11.5px] font-semibold tracking-wide
                                                    ${story.estado === 'activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#E0F2FE] text-[#0284C7]'}`}>
                                                    {story.estado.charAt(0).toUpperCase() + story.estado.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center relative">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const menuKey = `desktop-${story.id}`;
                                                        setOpenMenuId(openMenuId === menuKey ? null : menuKey);
                                                    }}
                                                    className="p-2 text-[#7B7B7B] hover:text-[#1B3D6D] transition-colors rounded-full hover:bg-gray-100 outline-none"
                                                >
                                                    <FontAwesomeIcon icon={faEllipsisV} className="text-sm" />
                                                </button>
                                                {openMenuId === `desktop-${story.id}` && renderActionMenu(story, `desktop-${story.id}`)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-10 text-center text-sm text-[#7B7B7B]">
                                            No se encontraron historias que coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="flex flex-col bg-white rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.04)] block md:hidden mb-4">
                        <div className="flex flex-col divide-y divide-[#F3F4F6] w-full px-4">
                            {storyList.length > 0 ? (
                                storyList.map((story) => (
                                    <div key={story.id} className="flex py-[18px] gap-3 relative">
                                        <div className="shrink-0">
                                            <img 
                                                src={story.imagen || '/images/placeholder.svg'} 
                                                alt={story.nombre} 
                                                className="w-[88px] h-[88px] rounded-[6px] object-cover shadow-sm bg-gray-100 border border-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <div className="flex justify-between items-center w-full relative">
                                                <span className="text-[13px] text-[#4B5563]">{story.codigo}</span>
                                                <div className="flex items-center gap-2 absolute right-0">
                                                    <span className={`inline-flex items-center justify-center px-[8px] py-[2px] rounded text-[11.5px] font-medium tracking-wide
                                                        ${story.estado === 'activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#E0F2FE] text-[#0284C7]'}`}>
                                                        {story.estado.charAt(0).toUpperCase() + story.estado.slice(1)}
                                                    </span>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const menuKey = `mobile-${story.id}`;
                                                            setOpenMenuId(openMenuId === menuKey ? null : menuKey);
                                                        }}
                                                        className="text-[#4B5563] outline-none"
                                                    >
                                                        <FontAwesomeIcon icon={faEllipsisV} className="text-sm" />
                                                    </button>
                                                </div>
                                                {openMenuId === `mobile-${story.id}` && renderActionMenu(story, `mobile-${story.id}`)}
                                            </div>
                                            <div className="text-[13.5px] text-[#4B5563] mt-1 pr-6 leading-tight max-w-[95%]">{story.nombre}</div>
                                            <div className="text-[13px] text-[#4B5563] mt-1">Precio: ${Number(story.precio_base).toFixed(2)}</div>
                                            <div className="grid grid-cols-2 mt-2 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10.5px] text-[#A0A0A0]">Categoría</span>
                                                    <span className="text-[12.5px] text-[#4B5563]">{story.categoria}</span>
                                                </div>
                                                <div className="flex flex-col items-end text-right">
                                                    <span className="text-[10.5px] text-[#A0A0A0]">Autor</span>
                                                    <span className="text-[12.5px] text-[#4B5563] truncate w-full">{story.autor}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-[13px] text-[#7B7B7B]">
                                    No se encontraron historias que coincidan con la búsqueda.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shared Pagination */}
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-between border-t border-transparent md:border-[#F3F4F6] md:px-5 py-4 md:py-4 bg-transparent md:bg-white gap-4 md:gap-0 mt-2 md:mt-0">
                        <div className="text-[13px] font-bold md:font-normal text-[#9CA3AF] md:text-[#7B7B7B]">
                            <span className="hidden md:inline">
                                {from && to ? (
                                    <>Mostrando <span className="text-[#111827] font-semibold">{from}</span> a <span className="text-[#111827] font-semibold">{to}</span> de <span className="text-[#111827] font-semibold">{total}</span> registros</>
                                ) : 'Sin registros'}
                            </span>
                            <span className="md:hidden">
                                {from ? `Mostrando ${from} de ${total} registros` : 'Sin registros'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => goToPage(current_page - 1)}
                                disabled={current_page === 1}
                                className={`flex items-center justify-center size-8 rounded-md transition-colors ${current_page === 1 ? 'text-[#D1D5DB] cursor-not-allowed' : 'hover:bg-gray-100 text-[#7B7B7B]'}`}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                            </button>
                            
                            {Array.from({ length: last_page }, (_, i) => i + 1).map(page => {
                                if (page === 1 || page === last_page || (page >= current_page - 1 && page <= current_page + 1)) {
                                    return (
                                        <button key={page} onClick={() => goToPage(page)} className={`flex items-center justify-center size-8 rounded-md transition-colors ${current_page === page ? 'bg-[#1B3D6D] text-white font-semibold' : 'hover:bg-gray-100 text-[#7B7B7B]'}`}>
                                            {page}
                                        </button>
                                    );
                                } else if (page === current_page - 2 || page === current_page + 2) {
                                    return <span key={page} className="px-1 text-[#A0A0A0]">...</span>;
                                }
                                return null;
                            })}

                            <button 
                                onClick={() => goToPage(current_page + 1)}
                                disabled={current_page === last_page}
                                className={`flex items-center justify-center size-8 rounded-md transition-colors ${current_page === last_page ? 'text-[#D1D5DB] cursor-not-allowed' : 'hover:bg-gray-100 text-[#7B7B7B]'}`}
                            >
                                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

                {/* Modals */}
                <CreateStoryModal 
                    isOpen={isCreateModalOpen} 
                    onClose={() => setIsCreateModalOpen(false)} 
                    categorias={categorias}
                />

                <CreateStoryModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedStory(null);
                    }} 
                    categorias={categorias}
                    storyToEdit={selectedStory}
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
function PreviewStoryModal({ story, onClose }: { story: any; onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm"
            style={{
                paddingTop: 'max(1rem, env(safe-area-inset-top))',
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            }}
        >
            <div className="flex min-h-[min(calc(100dvh-2rem),calc(100svh-2rem))] items-center justify-center p-4 sm:p-6">
                <div
                    className="my-auto flex w-full max-w-2xl max-h-[min(calc(100dvh-2rem),calc(100svh-2rem))] flex-col overflow-hidden rounded-lg bg-white shadow-2xl animate-in fade-in zoom-in duration-200"
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
                            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40 sm:right-4 sm:top-4 sm:size-10"
                            aria-label="Cerrar vista previa"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
                        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <div className="min-w-0 flex-1">
                                <h2 className="text-xl font-bold tracking-tight text-[#1B3D6D] sm:text-2xl">{story.nombre}</h2>
                                <p className="mt-0.5 text-[13px] text-[#7B7B7B] sm:text-[14px]">
                                    {story.categoria} • Por{' '}
                                    <span className="font-semibold text-[#1B3D6D]">{story.autor}</span>
                                </p>
                            </div>
                            <span
                                className={`shrink-0 self-start rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider sm:self-auto
                            ${story.estado === 'activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#E0F2FE] text-[#0284C7]'}`}
                            >
                                {story.estado}
                            </span>
                        </div>

                        <div className="mb-6 grid grid-cols-1 gap-4 border-y border-gray-100 py-5 sm:grid-cols-2">
                            <div className="text-center sm:border-r sm:border-gray-100">
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">Precio Base</p>
                                <p className="font-mono text-sm font-bold leading-none text-[#4B5563]">
                                    $
                                    {Number(story.precio_base)
                                        .toFixed(2)
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">Código</p>
                                <p className="break-all text-sm font-bold text-[#4B5563]">{story.codigo}</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <h4 className="mb-2 text-[12px] font-bold uppercase tracking-wider text-[#1B3D6D]">Resumen</h4>
                                <p className="text-[13px] italic leading-relaxed text-[#4B5563] sm:text-[14px]">
                                    &ldquo;{story.descripcion_corta}&rdquo;
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-2 text-[12px] font-bold uppercase tracking-wider text-[#1B3D6D]">Descripción Completa</h4>
                                <div
                                    className="max-w-none break-words text-[13px] leading-relaxed text-[#6B7280] line-clamp-6 sm:line-clamp-none sm:max-h-[min(40vh,320px)] sm:overflow-y-auto sm:overscroll-contain"
                                    dangerouslySetInnerHTML={{ __html: story.descripcion_larga }}
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
