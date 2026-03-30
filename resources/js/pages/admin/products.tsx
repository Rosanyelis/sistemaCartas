import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faFilter, 
    faChevronDown, 
    faChevronLeft, 
    faChevronRight, 
    faFileExcel, 
    faPlus, 
    faEllipsisV 
} from '@fortawesome/free-solid-svg-icons';
import { CreateProductModal } from '@/components/admin/CreateProductModal';

interface Product {
    id: string;
    nombre: string;
    imagen: string;
    categoria: string;
    subcategoria: string;
    precio: string;
    stock: number;
    estado: string; // 'Activo' or 'Pausado'
}

interface Props {
    products: Product[];
}

export default function Products({ products }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Filtros
    const [selectedCategory, setSelectedCategory] = useState('');
    
    // Menús
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const categoryMenuRef = useRef<HTMLDivElement>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const itemsPerPage = 8;
    
    // Categorías únicas para el filtro
    const categories = useMemo(() => Array.from(new Set(products.map(p => p.categoria))), [products]);

    // Cerrar menús al hacer click afuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
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

    // Filtrado de los productos
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Filter por búsqueda
            const matchesSearch =
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.subcategoria.toLowerCase().includes(searchTerm.toLowerCase());
                
            // Filter por categoría
            const matchesCategory = selectedCategory ? product.categoria === selectedCategory : true;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    // Paginación
    const totalRecords = filteredProducts.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
    
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <UserLayout title="Productos">
            <Head title="Gestión de Productos publicados" />

            <div className="flex flex-col gap-6 px-4 md:px-8 py-6 font-['Inter']">
                {/* Header Section */}
                <div className="flex flex-col gap-1 items-center text-center md:items-start md:text-left mb-2 md:mb-0">
                    <h1 className="text-[25px] md:text-2xl font-bold text-[#1B3D6D]">
                        Productos publicados
                    </h1>
                    <p className="text-[13.5px] md:text-sm text-[#1B3D6D] md:text-[#7B7B7B]">
                        Crea y gestiona los productos de la página
                    </p>
                </div>

                {/* Filters/Actions Bar */}
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
                                placeholder="Filtrar por nombre del producto o código de producto"
                                className="block w-full rounded-[4px] md:rounded-md border border-[#DFE4EA] md:border-[#E5E7EB] bg-white py-[10px] md:py-2.5 pl-[34px] md:pl-10 pr-3 text-[13px] md:text-sm text-[#1B3D6D] md:text-gray-900 placeholder:text-[#1B3D6D]/60 md:placeholder:text-[#A0A0A0] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/15 outline-none transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.05)] md:shadow-none"
                            />
                        </div>

                        {/* Mobile category button */}
                        <div className="md:hidden relative" ref={categoryMenuRef}>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsCategoryMenuOpen(!isCategoryMenuOpen); }}
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
                                onClick={(e) => { e.stopPropagation(); setIsCategoryMenuOpen(!isCategoryMenuOpen); }}
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

                        {/* Botones de acción */}
                        <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-3 ml-0 lg:ml-8">
                            <button className="flex w-full md:w-auto justify-center items-center gap-2 rounded-[4px] md:rounded-md border border-[#1B3D6D] bg-white px-4 py-[10px] md:py-2.5 text-[14px] md:text-sm font-bold md:font-semibold text-[#1B3D6D] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] md:shadow-sm hover:bg-[#F8F9FA] transition-colors">
                                <span>Exportar a excel</span>
                                <FontAwesomeIcon icon={faFileExcel} className="text-[12px] md:text-[14px]" />
                            </button>

                            <button 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex w-full md:w-auto justify-center items-center gap-2 rounded-[4px] md:rounded-md bg-[#1B3D6D] px-4 py-[10px] md:py-2.5 text-[14px] md:text-sm font-bold md:font-semibold text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] md:shadow-sm hover:bg-[#1B3D6D]/90 transition-colors"
                            >
                                <span>Crear producto</span>
                                <div className="rounded-full border border-white w-4 h-4 flex items-center justify-center -mr-1">
                                    <FontAwesomeIcon icon={faPlus} className="text-[9px]" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Container */}
                <div className="flex flex-col bg-transparent md:bg-white md:shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:rounded-lg overflow-hidden w-full">
                    
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1050px]">
                            <thead>
                                <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                                    <th className="px-5 py-4 text-[12px] font-bold text-[#4B5563] uppercase tracking-wider w-[100px]">
                                        Código
                                    </th>
                                    <th className="px-5 py-4 text-[12px] font-bold text-[#4B5563] uppercase tracking-wider w-[240px]">
                                        Producto
                                    </th>
                                    <th className="px-5 py-4 text-[12px] font-bold text-[#4B5563] uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-5 py-4 text-[12px] font-bold text-[#4B5563] uppercase tracking-wider">
                                        Subcategoría
                                    </th>
                                    <th className="px-5 py-4 text-[12px] font-bold text-[#4B5563] uppercase tracking-wider whitespace-nowrap">
                                        Precio
                                    </th>
                                    <th className="px-5 py-4 text-[12px] font-bold text-[#4B5563] uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-5 py-4 text-[12px] font-bold text-[#4B5563] uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            Estado <FontAwesomeIcon icon={faFilter} className="text-[10px] opacity-40" />
                                        </div>
                                    </th>
                                    <th className="px-5 py-4 text-[12px] font-bold text-[#4B5563] uppercase tracking-wider text-center">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {paginatedProducts.length > 0 ? (
                                    paginatedProducts.map((product, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4 text-[13.5px] text-[#4B5563]">{product.id}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img 
                                                        src={product.imagen} 
                                                        alt={product.nombre} 
                                                        className="w-[42px] h-[42px] rounded object-cover border border-gray-100/50"
                                                    />
                                                    <span className="text-[13.5px] text-[#4B5563]">{product.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-[13.5px] text-[#4B5563]">{product.categoria}</td>
                                            <td className="px-5 py-4 text-[13.5px] text-[#4B5563]">{product.subcategoria}</td>
                                            <td className="px-5 py-4 text-[13.5px] text-[#4B5563] whitespace-nowrap">{product.precio}</td>
                                            <td className="px-5 py-4 text-[13.5px] text-[#4B5563] pl-8">{product.stock}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-[8px] py-[1.5px] rounded text-[11.5px] font-medium tracking-wide
                                                    ${product.estado === 'Activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#FEE2E2] text-[#EF4444]'}`}>
                                                    {product.estado}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center relative">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const menuKey = `desktop-${idx}`;
                                                        setOpenMenuId(openMenuId === menuKey ? null : menuKey);
                                                    }}
                                                    className="p-2 text-[#4B5563] hover:text-[#1B3D6D] transition-colors rounded-full hover:bg-gray-100 outline-none"
                                                >
                                                    <FontAwesomeIcon icon={faEllipsisV} className="text-[15px]" />
                                                </button>
                                                
                                                {openMenuId === `desktop-${idx}` && (
                                                    <div className="absolute right-14 top-1/2 transform -translate-y-1/2 mt-0 w-[150px] bg-white border border-[#F3F4F6] rounded-[6px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] z-20 py-1 text-left">
                                                        <button className="w-full text-left px-4 py-2.5 text-[14px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Editar</button>
                                                        <button className="w-full text-left px-4 py-2.5 text-[14px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Vista previa</button>
                                                        <button className="w-full text-left px-4 py-2.5 text-[14px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Ajustar stock</button>
                                                        <button className="w-full text-left px-4 py-2.5 text-[14px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Duplicar</button>
                                                        <button className="w-full text-left px-4 py-2.5 text-[14px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Activar/Pausar</button>
                                                        <button className="w-full text-left px-4 py-2.5 text-[14px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Eliminar</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-10 text-center text-sm text-[#7B7B7B]">
                                            No se encontraron productos que coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="flex flex-col bg-white rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.04)] block md:hidden mb-4">
                        <div className="flex flex-col divide-y divide-[#F3F4F6] w-full px-4">
                            {paginatedProducts.length > 0 ? (
                                paginatedProducts.map((product, idx) => (
                                    <div key={idx} className="flex py-[18px] gap-3 relative">
                                        {/* Image */}
                                        <div className="shrink-0">
                                            <img 
                                                src={product.imagen} 
                                                alt={product.nombre} 
                                                className="w-[88px] h-[88px] rounded-[6px] object-cover shadow-sm bg-gray-100 border border-gray-100"
                                            />
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex flex-col flex-1 min-w-0">
                                            {/* Top row */}
                                            <div className="flex justify-between items-center w-full relative">
                                                <span className="text-[13px] text-[#4B5563]">{product.id}</span>
                                                <div className="flex items-center gap-2 absolute right-0">
                                                    <span className={`inline-flex items-center justify-center px-[8px] py-[2px] rounded text-[11.5px] font-medium tracking-wide
                                                        ${product.estado === 'Activo' ? 'bg-[#D1F4E0] text-[#12A05B]' : 'bg-[#FEE2E2] text-[#EF4444]'}`}>
                                                        {product.estado}
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
                                                    <div className="absolute right-0 top-6 w-[150px] bg-white border border-[#F3F4F6] rounded-[6px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] z-20 py-1 text-left">
                                                        <button className="w-full text-left px-4 py-2.5 text-[14px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Editar</button>
                                                        <button className="w-full text-left px-4 py-2.5 text-[14px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Vista previa</button>
                                                        <button className="w-full text-left px-4 py-2.5 text-[14px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Ajustar stock</button>
                                                        <button className="w-full text-left px-4 py-2.5 text-[14px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Duplicar</button>
                                                        <button className="w-full text-left px-4 py-2.5 text-[14px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Activar/Pausar</button>
                                                        <button className="w-full text-left px-4 py-2.5 text-[14px] text-[#4B5563] hover:bg-gray-50 flex items-center justify-start transition-colors">Eliminar</button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Title */}
                                            <div className="text-[13.5px] text-[#4B5563] mt-1 pr-6 leading-tight max-w-[95%]">
                                                {product.nombre}
                                            </div>
                                            
                                            {/* Price & Stock */}
                                            <div className="flex justify-between items-center mt-1">
                                                <div className="text-[13px] text-[#4B5563]">
                                                    Precio: <span className="font-medium text-[#111827]">{product.precio}</span>
                                                </div>
                                                <div className="text-[13px] text-[#4B5563] pr-6">
                                                    Stock: <span className="font-medium text-[#111827]">{product.stock}</span>
                                                </div>
                                            </div>

                                            {/* Lower cols */}
                                            <div className="grid grid-cols-2 mt-2 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10.5px] text-[#A0A0A0]">Categoría</span>
                                                    <span className="text-[12px] text-[#4B5563]">{product.categoria}</span>
                                                </div>
                                                <div className="flex flex-col items-end text-right">
                                                    <span className="text-[10.5px] text-[#A0A0A0]">Subcategoría</span>
                                                    <span className="text-[12px] text-[#4B5563]">{product.subcategoria}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-[13px] text-[#7B7B7B]">
                                    No se encontraron productos que coincidan con la búsqueda.
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

            <CreateProductModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </UserLayout>
    );
}
