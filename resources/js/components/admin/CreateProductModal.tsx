import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faImage } from '@fortawesome/free-solid-svg-icons';

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose }) => {
    
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        descripcion_corta: '',
        descripcion_larga: '',
        detalle: '',
        categoria: '',
        subcategoria: '',
        precio_base: '',
        precio_promocional: '',
        impuesto: '',
        codigo: '',
        stock: 0,
        imagen: '',
        peso: '',
        dimensiones: '',
        tipo_envio: '',
        estado: 'activo'
    });

    // Bloquear scroll al abrir
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            reset();
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/productos', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-['Inter']">
            {/* Ovelay background */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-white w-[90%] md:w-[850px] max-h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#F3F4F6]">
                    <h2 className="text-[17px] font-semibold text-[#1B3D6D]">
                        Crear producto
                    </h2>
                    <button 
                        onClick={handleClose}
                        className="text-[#7B7B7B] hover:text-[#111827] transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
                    <div className="flex-1 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            
                            {/* Columna Izquierda */}
                            <div className="flex flex-col gap-5">
                                
                                {/* Nombre del producto */}
                                <div>
                                    <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-1.5">
                                        Nombre del producto<span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.nombre}
                                        onChange={e => setData('nombre', e.target.value)}
                                        placeholder="Papel de Hilo Prensado"
                                        className={`w-full rounded-[4px] border ${errors.nombre ? 'border-red-500' : 'border-[#E5E7EB]'} px-3 py-2 text-[13.5px] text-[#4B5563] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] outline-none placeholder:text-[#9CA3AF]`}
                                    />
                                    {errors.nombre && <span className="text-red-500 text-[11px]">{errors.nombre}</span>}
                                </div>

                                {/* Descripción corta */}
                                <div>
                                    <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-1.5">
                                        Descripción corta<span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.descripcion_corta}
                                        onChange={e => setData('descripcion_corta', e.target.value)}
                                        placeholder="Papel"
                                        className={`w-full rounded-[4px] border ${errors.descripcion_corta ? 'border-red-500' : 'border-[#E5E7EB]'} px-3 py-2 text-[13.5px] text-[#4B5563] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] outline-none placeholder:text-[#9CA3AF]`}
                                    />
                                    {errors.descripcion_corta ? (
                                        <span className="text-red-500 text-[11px]">{errors.descripcion_corta}</span>
                                    ) : (
                                        <span className="text-[11px] text-[#A0A0A0] mt-1 block">
                                            Se mostrará en la sección principal de productos
                                        </span>
                                    )}
                                </div>

                                {/* Descripción larga */}
                                <div>
                                    <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-1.5">
                                        Descripción larga<span className="text-red-500">*</span>
                                    </label>
                                    <div className={`border ${errors.descripcion_larga ? 'border-red-500' : 'border-[#E5E7EB]'} rounded-[4px] overflow-hidden`}>
                                        {/* Fake Toolbar */}
                                        <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-3 py-2 flex items-center gap-3 text-[#7B7B7B] overflow-x-auto">
                                            <span className="font-serif font-bold text-sm cursor-pointer hover:text-black">B</span>
                                            <span className="font-serif italic text-sm cursor-pointer hover:text-black">I</span>
                                            <span className="font-serif underline text-sm cursor-pointer hover:text-black">U</span>
                                            <div className="w-[1px] h-4 bg-[#E5E7EB]"></div>
                                            <span className="text-xs cursor-pointer hover:text-black">≡</span>
                                            <span className="text-xs cursor-pointer hover:text-black">≣</span>
                                            <div className="w-[1px] h-4 bg-[#E5E7EB]"></div>
                                            <span className="text-xs cursor-pointer hover:text-black">⚲</span>
                                            <span className="text-xs cursor-pointer hover:text-black">🗨</span>
                                            <span className="text-xs cursor-pointer hover:text-black">▧</span>
                                            <span className="text-xs cursor-pointer hover:text-black">🖼</span>
                                            <span className="text-xs cursor-pointer hover:text-black">⋮</span>
                                        </div>
                                        <textarea 
                                            value={data.descripcion_larga}
                                            onChange={e => setData('descripcion_larga', e.target.value)}
                                            rows={4}
                                            placeholder="Versátil y de alta calidad, ideal para manualidades..."
                                            className="w-full p-3 text-[13px] text-[#4B5563] border-none focus:ring-0 outline-none resize-none placeholder:text-[#9CA3AF]"
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <div className="text-[11px]">
                                            {errors.descripcion_larga && <span className="text-red-500">{errors.descripcion_larga}</span>}
                                        </div>
                                        <div className="text-[11px] text-[#A0A0A0]">{data.descripcion_larga.length}/500</div>
                                    </div>
                                </div>

                                {/* Detalle */}
                                <div>
                                    <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-1.5">
                                        Detalle
                                    </label>
                                    <div className={`border ${errors.detalle ? 'border-red-500' : 'border-[#E5E7EB]'} rounded-[4px] overflow-hidden`}>
                                        {/* Fake Toolbar */}
                                        <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-3 py-2 flex items-center gap-3 text-[#7B7B7B] overflow-x-auto">
                                            <span className="font-serif font-bold text-sm cursor-pointer hover:text-black">B</span>
                                            <span className="font-serif italic text-sm cursor-pointer hover:text-black">I</span>
                                            <span className="font-serif underline text-sm cursor-pointer hover:text-black">U</span>
                                            <div className="w-[1px] h-4 bg-[#E5E7EB]"></div>
                                            <span className="text-xs cursor-pointer hover:text-black">≡</span>
                                            <span className="text-xs cursor-pointer hover:text-black">≣</span>
                                            <div className="w-[1px] h-4 bg-[#E5E7EB]"></div>
                                            <span className="text-xs cursor-pointer hover:text-black">⚲</span>
                                            <span className="text-xs cursor-pointer hover:text-black">🗨</span>
                                            <span className="text-xs cursor-pointer hover:text-black">▧</span>
                                            <span className="text-xs cursor-pointer hover:text-black">🖼</span>
                                            <span className="text-xs cursor-pointer hover:text-black">⋮</span>
                                        </div>
                                        <textarea 
                                            value={data.detalle}
                                            onChange={e => setData('detalle', e.target.value)}
                                            rows={3}
                                            placeholder="Aquí detalles del producto"
                                            className="w-full p-3 text-[13px] text-[#4B5563] border-none focus:ring-0 outline-none resize-none placeholder:text-[#9CA3AF]"
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <div className="text-[11px]">
                                            {errors.detalle && <span className="text-red-500">{errors.detalle}</span>}
                                        </div>
                                        <div className="text-[11px] text-[#A0A0A0]">{data.detalle?.length || 0}/500</div>
                                    </div>
                                </div>

                                {/* Categoría */}
                                <div>
                                    <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-1.5">
                                        Categoría<span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.categoria}
                                        onChange={e => setData('categoria', e.target.value)}
                                        placeholder="Papelería"
                                        className={`w-full rounded-[4px] border ${errors.categoria ? 'border-red-500' : 'border-[#E5E7EB]'} px-3 py-2 text-[13.5px] text-[#4B5563] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] outline-none placeholder:text-[#9CA3AF]`}
                                    />
                                    {errors.categoria && <span className="text-red-500 text-[11px]">{errors.categoria}</span>}
                                </div>

                                {/* Subcategoría */}
                                <div>
                                    <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-1.5">
                                        Subcategoría
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.subcategoria}
                                        onChange={e => setData('subcategoria', e.target.value)}
                                        placeholder="Subcategoría"
                                        className={`w-full rounded-[4px] border ${errors.subcategoria ? 'border-red-500' : 'border-[#E5E7EB]'} px-3 py-2 text-[13.5px] text-[#4B5563] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] outline-none placeholder:text-[#9CA3AF]`}
                                    />
                                    {errors.subcategoria && <span className="text-red-500 text-[11px]">{errors.subcategoria}</span>}
                                </div>

                                {/* Precio Section */}
                                <div>
                                    <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-3">
                                        Precio<span className="text-red-500">*</span>
                                    </label>
                                    
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                                Precio base<span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                value={data.precio_base}
                                                onChange={e => setData('precio_base', e.target.value)}
                                                placeholder="250.00"
                                                className={`w-full rounded-[4px] border ${errors.precio_base ? 'border-red-500' : 'border-[#E5E7EB]'} px-3 py-2 text-[13.5px] text-[#4B5563] outline-none`}
                                            />
                                            {errors.precio_base && <span className="text-red-500 text-[11px]">{errors.precio_base}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                                Precio promocional
                                            </label>
                                            <input 
                                                type="text" 
                                                value={data.precio_promocional}
                                                onChange={e => setData('precio_promocional', e.target.value)}
                                                placeholder="199.00"
                                                className={`w-full rounded-[4px] border ${errors.precio_promocional ? 'border-red-500' : 'border-[#E5E7EB]'} px-3 py-2 text-[13.5px] text-[#4B5563] outline-none`}
                                            />
                                            {errors.precio_promocional && <span className="text-red-500 text-[11px]">{errors.precio_promocional}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                                Impuesto
                                            </label>
                                            <input 
                                                type="text" 
                                                value={data.impuesto}
                                                onChange={e => setData('impuesto', e.target.value)}
                                                placeholder="16"
                                                className={`w-full rounded-[4px] border ${errors.impuesto ? 'border-red-500' : 'border-[#E5E7EB]'} px-3 py-2 text-[13.5px] text-[#4B5563] outline-none`}
                                            />
                                            {errors.impuesto && <span className="text-red-500 text-[11px]">{errors.impuesto}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha */}
                            <div className="flex flex-col gap-5">

                                {/* Información de envío */}
                                <div>
                                    <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-3">
                                        Información de envío
                                    </label>
                                    
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                                Peso
                                            </label>
                                            <input 
                                                type="text" 
                                                value={data.peso}
                                                onChange={e => setData('peso', e.target.value)}
                                                placeholder="0kg"
                                                className={`w-full rounded-[4px] border ${errors.peso ? 'border-red-500' : 'border-[#E5E7EB]'} px-3 py-2 text-[13.5px] text-[#4B5563] outline-none`}
                                            />
                                            {errors.peso && <span className="text-red-500 text-[11px]">{errors.peso}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                                Dimensiones
                                            </label>
                                            <input 
                                                type="text" 
                                                value={data.dimensiones}
                                                onChange={e => setData('dimensiones', e.target.value)}
                                                placeholder="0x0x0"
                                                className={`w-full rounded-[4px] border ${errors.dimensiones ? 'border-red-500' : 'border-[#E5E7EB]'} px-3 py-2 text-[13.5px] text-[#4B5563] outline-none`}
                                            />
                                            {errors.dimensiones && <span className="text-red-500 text-[11px]">{errors.dimensiones}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                                Tipo de envío
                                            </label>
                                            <input 
                                                type="text" 
                                                value={data.tipo_envio}
                                                onChange={e => setData('tipo_envio', e.target.value)}
                                                placeholder="Estándar"
                                                className={`w-full rounded-[4px] border ${errors.tipo_envio ? 'border-red-500' : 'border-[#E5E7EB]'} px-3 py-2 text-[13.5px] text-[#4B5563] outline-none`}
                                            />
                                            {errors.tipo_envio && <span className="text-red-500 text-[11px]">{errors.tipo_envio}</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Inventario */}
                                <div className="mt-2">
                                    <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-3">
                                        Inventario
                                    </label>
                                    
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                                Código de producto<span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                value={data.codigo}
                                                onChange={e => setData('codigo', e.target.value)}
                                                placeholder="#1018"
                                                className={`w-full rounded-[4px] border ${errors.codigo ? 'border-red-500' : 'border-[#E5E7EB]'} px-3 py-2 text-[13.5px] text-[#4B5563] outline-none`}
                                            />
                                            {errors.codigo && <span className="text-red-500 text-[11px]">{errors.codigo}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                                Stock<span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                value={data.stock}
                                                onChange={e => setData('stock', parseInt(e.target.value) || 0)}
                                                placeholder="20"
                                                className={`w-full rounded-[4px] border ${errors.stock ? 'border-red-500' : 'border-[#E5E7EB]'} px-3 py-2 text-[13.5px] text-[#4B5563] outline-none`}
                                            />
                                            {errors.stock && <span className="text-red-500 text-[11px]">{errors.stock}</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Variantes */}
                                <div className="mt-2">
                                    <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-3">
                                        Variantes(Opcional)
                                    </label>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-[12.5px] text-[#4B5563] mb-1.5">Color</label>
                                            <select className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] outline-none appearance-none bg-white">
                                                <option>Beige</option>
                                                <option>Blanco</option>
                                                <option>Negro</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[12.5px] text-[#4B5563] mb-1.5">Material</label>
                                            <select className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] outline-none appearance-none bg-white">
                                                <option>Papel</option>
                                                <option>Cartón</option>
                                            </select>
                                        </div>
                                        <div className="text-center mt-1">
                                            <button type="button" className="text-[#1B3D6D] border border-[#1B3D6D] rounded-[4px] px-4 py-1.5 text-[12px] font-medium hover:bg-[#F8F9FA] transition-colors inline-flex items-center gap-2">
                                                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                                                Agregar Variante
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Imágenes y Multimedia */}
                                <div className="mt-2">
                                    <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-3">
                                        Imágenes y multimedia
                                    </label>
                                    
                                    <div className="w-full h-[150px] rounded-[6px] border border-[#E5E7EB] flex items-center justify-center relative overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPC9zdmc+')]">
                                    </div>
                                    <div className="text-center mt-3">
                                        <button type="button" className="text-[#1B3D6D] border border-[#1B3D6D] rounded-[4px] px-4 py-1.5 text-[12px] font-medium hover:bg-[#F8F9FA] transition-colors inline-flex items-center gap-2">
                                            <FontAwesomeIcon icon={faImage} className="text-[11px]" />
                                            Subir Imagen
                                        </button>
                                        {errors.imagen && <span className="text-red-500 text-[11px] block mt-1">{errors.imagen}</span>}
                                    </div>

                                </div>

                                {/* Status Radios */}
                                <div className="mt-4 flex flex-col gap-4">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center mt-0.5">
                                            <input 
                                                type="radio" 
                                                name="estado" 
                                                value="activo"
                                                checked={data.estado === 'activo'}
                                                onChange={() => setData('estado', 'activo')}
                                                className="peer sr-only" 
                                            />
                                            <div className="w-4 h-4 border border-[#D1D5DB] rounded-[3px] peer-checked:bg-[#1B3D6D] peer-checked:border-[#1B3D6D] transition-all"></div>
                                            <FontAwesomeIcon icon={faPlus} className="text-white text-[9px] absolute opacity-0 peer-checked:opacity-100 rotate-45" style={{clipPath: 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)', content: '"\f00c"'}} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13.5px] font-medium text-[#111827]">Activo</span>
                                            <span className="text-[12px] text-[#A0A0A0]">Está publicado en el sitio web y recibiendo ventas.</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center mt-0.5">
                                            <input 
                                                type="radio" 
                                                name="estado" 
                                                value="pausado"
                                                checked={data.estado === 'pausado'}
                                                onChange={() => setData('estado', 'pausado')}
                                                className="peer sr-only" 
                                            />
                                            <div className="w-4 h-4 border border-[#D1D5DB] rounded-[3px] peer-checked:bg-[#1B3D6D] peer-checked:border-[#1B3D6D] transition-all"></div>
                                            <FontAwesomeIcon icon={faPlus} className="text-white text-[9px] absolute opacity-0 peer-checked:opacity-100 rotate-45" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13.5px] font-medium text-[#111827]">Pausado</span>
                                            <span className="text-[12px] text-[#A0A0A0]">No aparece en el sitio web pero sigue en la base de datos y en la "lista de productos".</span>
                                        </div>
                                    </label>
                                    {errors.estado && <span className="text-red-500 text-[11px]">{errors.estado}</span>}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-white border-t border-[#F3F4F6] px-6 py-4 flex justify-end gap-3 z-10 shrink-0 sticky bottom-0">
                        <button 
                            type="button" 
                            onClick={handleClose}
                            disabled={processing}
                            className="px-6 py-2 rounded-md border border-[#1B3D6D] text-[#1B3D6D] text-[13.5px] font-semibold hover:bg-[#F8F9FA] transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="px-6 py-2 rounded-md bg-[#1B3D6D] text-white text-[13.5px] font-semibold hover:bg-[#1B3D6D]/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing ? 'Guardando...' : 'Guardar producto'}
                        </button>
                    </div>
                </form>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #D1D5DB;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
}
