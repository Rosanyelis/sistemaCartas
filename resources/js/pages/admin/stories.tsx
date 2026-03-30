import React, { useMemo, useState, useRef, useEffect } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
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
    faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import { CreateStoryModal } from '@/components/admin/CreateStoryModal';


interface Story {
    id: string;
    nombre: string;
    imagen: string;
    categoria: string;
    autor: string;
    precio: string;
    estado: string; // 'Activo' or 'Pausado'
    fecha_publicacion: string;
}

interface Props {
    stories: Story[];
}

export default function Stories({ stories }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Filtros
    const [selectedCategory, setSelectedCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Menús
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
    const dateMenuRef = useRef<HTMLDivElement>(null);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const categoryMenuRef = useRef<HTMLDivElement>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const itemsPerPage = 8;
    
    // Categorías únicas para el filtro
    const categories = useMemo(() => Array.from(new Set(stories.map(s => s.categoria))), [stories]);

    // Cerrar menús al hacer click afuera
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
        
        // Listener independiente para clicks globales y cerrar el menú de acciones
        const closeActionMenu = () => setOpenMenuId(null);
        document.addEventListener("click", closeActionMenu);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("click", closeActionMenu);
        }
    }, []);

    // Función parseDate helper
    const parseDateStr = (dateStr: string) => {
        if (!dateStr) return null;
        return new Date(dateStr);
    };

    // Label format para el botón
    const formatDateLabel = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    // Filtrado de las historias
    const filteredStories = useMemo(() => {
        return stories.filter((story) => {
            // Filter por búsqueda
            const matchesSearch =
                story.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                story.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                story.autor.toLowerCase().includes(searchTerm.toLowerCase());
                
            // Filter por categoría
            const matchesCategory = selectedCategory ? story.categoria === selectedCategory : true;

            // Filter por fechas
            let matchesDateStr = true;
            if (startDate || endDate) {
                const acquiredDate = parseDateStr(story.fecha_publicacion);
                if (acquiredDate) {
                    acquiredDate.setHours(0, 0, 0, 0);
                    
                    if (startDate) {
                        const sDate = parseDateStr(startDate);
                        if (sDate) {
                            sDate.setHours(0, 0, 0, 0);
                            if (acquiredDate < sDate) matchesDateStr = false;
                        }
                    }
                    if (endDate) {
                        const eDate = parseDateStr(endDate);
                        if (eDate) {
                            eDate.setHours(23, 59, 59, 999);
                            if (acquiredDate > eDate) matchesDateStr = false;
                        }
                    }
                } else {
                    matchesDateStr = false;
                }
            }

            return matchesSearch && matchesCategory && matchesDateStr;
        });
    }, [stories, searchTerm, selectedCategory, startDate, endDate]);

    // Paginación
    const totalRecords = filteredStories.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
    
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }

    const paginatedStories = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredStories.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredStories, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

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

                {/* Filters/Actions Bar - Mobile first layout */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full">
                    
                    {/* Mobile: Input + Square Filter Button */}
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
                                    <button
                                        onClick={() => { setSelectedCategory(''); setIsCategoryMenuOpen(false); setCurrentPage(1); }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Todas
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setSelectedCategory(cat); setIsCategoryMenuOpen(false); setCurrentPage(1); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {cat}
                                        </button>
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
                                <FontAwesomeIcon 
                                    icon={faChevronDown} 
                                    className={`text-[#A0A0A0] ml-1 text-[10px] md:text-xs transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} 
                                />
                            </button>
                            {isCategoryMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 z-10 w-full md:w-48 rounded-md border border-[#E5E7EB] bg-white py-1 shadow-lg">
                                    <button
                                        onClick={() => { setSelectedCategory(''); setIsCategoryMenuOpen(false); setCurrentPage(1); }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Todas
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setSelectedCategory(cat); setIsCategoryMenuOpen(false); setCurrentPage(1); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Rango de Fechas Filter Desktop solo */}
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
                                <FontAwesomeIcon 
                                    icon={faChevronDown} 
                                    className={`text-[#1B3D6D] md:text-[#A0A0A0] opacity-60 md:opacity-100 ml-1 text-[10px] md:text-xs transition-transform ${isDateMenuOpen ? 'rotate-180' : ''}`} 
                                />
                            </div>

                            {/* Dropdown del calendario */}
                            {isDateMenuOpen && (
                                <div className="absolute top-full right-0 lg:left-0 lg:right-auto mt-2 z-10 w-full md:w-72 rounded-md border border-[#E5E7EB] bg-white p-4 shadow-lg">
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-[#7B7B7B]">Desde (Publicación):</label>
                                            <input 
                                                type="date" 
                                                value={startDate} 
                                                onChange={(e) => {setStartDate(e.target.value); setCurrentPage(1);}}
                                                className="w-full rounded border border-[#E5E7EB] p-2 text-sm text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]" 
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-[#7B7B7B]">Hasta (Publicación):</label>
                                            <input 
                                                type="date" 
                                                value={endDate} 
                                                onChange={(e) => {setEndDate(e.target.value); setCurrentPage(1);}}
                                                className="w-full rounded border border-[#E5E7EB] p-2 text-sm text-[#4B5563] outline-none focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]" 
                                            />
                                        </div>
                                        <div className="mt-2 flex justify-end gap-2">
                                            <button 
                                                onClick={() => {setStartDate(''); setEndDate(''); setCurrentPage(1);}}
                                                className="rounded px-3 py-1.5 text-xs text-[#7B7B7B] font-medium hover:bg-gray-100 transition-colors"
                                            >
                                                Limpiar
                                            </button>
                                            <button 
                                                onClick={() => setIsDateMenuOpen(false)}
                                                className="rounded bg-[#1B3D6D] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1B3D6D]/90 transition-colors"
                                            >
                                                Aplicar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-3">
                            <button className="flex w-full md:w-auto justify-center items-center gap-2 rounded-[4px] md:rounded-md border border-[#1B3D6D] bg-white px-4 py-[10px] md:py-2.5 text-[14px] md:text-sm font-bold md:font-semibold text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] md:shadow-sm hover:bg-[#F8F9FA] transition-colors">
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
                <div className="flex flex-col bg-transparent md:bg-white md:shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:rounded-lg overflow-hidden w-full">
                    
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider w-[120px]">
                                        Código
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">
                                        Historia
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">
                                        Autor
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">
                                        Precio
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            Estado <FontAwesomeIcon icon={faFilter} className="text-[10px] opacity-50" />
                                        </div>
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold text-[#7B7B7B] uppercase tracking-wider text-center">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {paginatedStories.length > 0 ? (
                                    paginatedStories.map((story, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4 text-sm font-semibold text-[#1B3D6D]">{story.id}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img 
                                                        src={story.imagen} 
                                                        alt={story.nombre} 
                                                        className="w-10 h-10 rounded object-cover shadow-sm bg-gray-100"
                                                    />
                                                    <span className="text-sm font-medium text-[#111827]">{story.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{story.categoria}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{story.autor}</td>
                                            <td className="px-5 py-4 text-sm text-[#4B5563]">{story.precio}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11.5px] font-semibold tracking-wide
                                                    ${story.estado === 'Activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#E0F2FE] text-[#0284C7]'}`}>
                                                    {story.estado}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center relative">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const menuKey = `desktop-${idx}`;
                                                        setOpenMenuId(openMenuId === menuKey ? null : menuKey);
                                                    }}
                                                    className="p-2 text-[#7B7B7B] hover:text-[#1B3D6D] transition-colors rounded-full hover:bg-gray-100 outline-none"
                                                >
                                                    <FontAwesomeIcon icon={faEllipsisV} className="text-sm" />
                                                </button>
                                                
                                                {openMenuId === `desktop-${idx}` && (
                                                    <div className="absolute right-14 top-1/2 transform -translate-y-1/2 mt-0 w-36 bg-white border border-[#E5E7EB] rounded-md shadow-lg z-20 py-1 text-left">
                                                        <button className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Editar</button>
                                                        <button className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Vista previa</button>
                                                        <button className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Duplicar</button>
                                                        <button className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Activar/Pausar</button>
                                                        <button className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Eliminar</button>
                                                    </div>
                                                )}
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
                            {paginatedStories.length > 0 ? (
                                paginatedStories.map((story, idx) => (
                                    <div key={idx} className="flex py-[18px] gap-3 relative">
                                        {/* Image */}
                                        <div className="shrink-0">
                                            <img 
                                                src={story.imagen} 
                                                alt={story.nombre} 
                                                className="w-[88px] h-[88px] rounded-[6px] object-cover shadow-sm bg-gray-100 border border-gray-100"
                                            />
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex flex-col flex-1 min-w-0">
                                            {/* Top row */}
                                            <div className="flex justify-between items-center w-full relative">
                                                <span className="text-[13px] text-[#4B5563]">{story.id}</span>
                                                <div className="flex items-center gap-2 absolute right-0">
                                                    <span className={`inline-flex items-center justify-center px-[8px] py-[2px] rounded text-[11.5px] font-medium tracking-wide
                                                        ${story.estado === 'Activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#E0F2FE] text-[#0284C7]'}`}>
                                                        {story.estado}
                                                    </span>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const menuKey = `mobile-${idx}`;
                                                            setOpenMenuId(openMenuId === menuKey ? null : menuKey);
                                                        }}
                                                        className="text-[#4B5563] outline-none"
                                                    >
                                                        <FontAwesomeIcon icon={faEllipsisV} className="text-sm" />
                                                    </button>
                                                </div>
                                                
                                                {openMenuId === `mobile-${idx}` && (
                                                    <div className="absolute right-0 top-6 w-36 bg-white border border-[#E5E7EB] rounded-md shadow-lg z-20 py-1 text-left">
                                                        <button className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Editar</button>
                                                        <button className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Vista previa</button>
                                                        <button className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Duplicar</button>
                                                        <button className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Activar/Pausar</button>
                                                        <button className="w-full text-left px-4 py-2 text-[13px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Eliminar</button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Title */}
                                            <div className="text-[13.5px] text-[#4B5563] mt-1 pr-6 leading-tight max-w-[95%]">
                                                {story.nombre}
                                            </div>
                                            
                                            {/* Price */}
                                            <div className="text-[13px] text-[#4B5563] mt-1">
                                                Precio: {story.precio}
                                            </div>

                                            {/* Lower cols */}
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
                                Mostrando <span className="text-[#111827] font-semibold">
                                    {totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                                </span> a <span className="text-[#111827] font-semibold">
                                    {Math.min(currentPage * itemsPerPage, totalRecords)}
                                </span> de <span className="text-[#111827] font-semibold">{totalRecords}</span> registros
                            </span>
                            <span className="md:hidden">
                                Mostrando {totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} de {totalRecords} registros
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`flex items-center justify-center size-8 rounded-md transition-colors ${currentPage === 1 ? 'text-[#D1D5DB] cursor-not-allowed' : 'hover:bg-gray-100 text-[#7B7B7B]'}`}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                // Lógica simple para mostrar páginas con elipsis
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`flex items-center justify-center size-8 rounded-md transition-colors ${
                                                currentPage === page 
                                                    ? 'bg-[#1B3D6D] text-white font-semibold' 
                                                    : 'hover:bg-gray-100 text-[#7B7B7B] md:text-[#7B7B7B]'
                                            } ${currentPage !== page ? 'text-[#9CA3AF]' : ''}`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                ) {
                                    return <span key={page} className="px-1 text-[#A0A0A0]">...</span>;
                                }
                                return null;
                            })}

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`flex items-center justify-center size-8 rounded-md transition-colors ${currentPage === totalPages ? 'text-[#D1D5DB] cursor-not-allowed' : 'hover:bg-gray-100 text-[#7B7B7B]'}`}
                            >
                                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <CreateStoryModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </UserLayout>
    );
}
