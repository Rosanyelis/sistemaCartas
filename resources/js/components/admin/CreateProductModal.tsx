import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faImage } from '@fortawesome/free-solid-svg-icons';

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose }) => {
    
    // Bloquear scroll al abrir
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-['Inter']">
            {/* Ovelay background */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-white w-[90%] md:w-[850px] max-h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#F3F4F6]">
                    <h2 className="text-[17px] font-semibold text-[#1B3D6D]">
                        Crear producto
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-[#7B7B7B] hover:text-[#111827] transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                    
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        
                        {/* Columna Izquierda */}
                        <div className="flex flex-col gap-5">
                            
                            {/* Nombre del producto */}
                            <div>
                                <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-1.5">
                                    Nombre del producto<span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Papel de Hilo Prensado"
                                    className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] outline-none placeholder:text-[#9CA3AF]"
                                />
                            </div>

                            {/* Descripción corta */}
                            <div>
                                <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-1.5">
                                    Descripción corta<span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Papel"
                                    className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] outline-none placeholder:text-[#9CA3AF]"
                                />
                                <span className="text-[11px] text-[#A0A0A0] mt-1 block">
                                    Se mostrará en la sección principal de productos
                                </span>
                            </div>

                            {/* Descripción larga */}
                            <div>
                                <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-1.5">
                                    Descripción larga<span className="text-red-500">*</span>
                                </label>
                                <div className="border border-[#E5E7EB] rounded-[4px] overflow-hidden">
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
                                        rows={4}
                                        placeholder="Versátil y de alta calidad, ideal para manualidades..."
                                        className="w-full p-3 text-[13px] text-[#4B5563] border-none focus:ring-0 outline-none resize-none placeholder:text-[#9CA3AF]"
                                    ></textarea>
                                </div>
                                <div className="text-right text-[11px] text-[#A0A0A0] mt-1">0/50</div>
                            </div>

                            {/* Detalle */}
                            <div>
                                <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-1.5">
                                    Detalle
                                </label>
                                <div className="border border-[#E5E7EB] rounded-[4px] overflow-hidden">
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
                                        rows={3}
                                        placeholder="Aquí detalles del producto"
                                        className="w-full p-3 text-[13px] text-[#4B5563] border-none focus:ring-0 outline-none resize-none placeholder:text-[#9CA3AF]"
                                    ></textarea>
                                </div>
                                <div className="text-right text-[11px] text-[#A0A0A0] mt-1">0/50</div>
                            </div>

                            {/* Categoría */}
                            <div>
                                <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-1.5">
                                    Categoría<span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Papelería"
                                    className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] outline-none placeholder:text-[#9CA3AF]"
                                />
                            </div>

                            {/* Subcategoría */}
                            <div>
                                <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-1.5">
                                    Subcategoría
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Subcategoría"
                                    className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D] outline-none placeholder:text-[#9CA3AF]"
                                />
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
                                            placeholder="250.00"
                                            className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                            Precio promocional<span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="199.00"
                                            className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                            Impuesto<span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="16%"
                                            className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] outline-none"
                                        />
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
                                            Peso<span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="0kg"
                                            className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                            Dimensiones<span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="0x0x0"
                                            className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                            Tipo de envío<span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="Estándar"
                                            className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] outline-none"
                                        />
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
                                            Código de producto
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="#1018"
                                            className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12.5px] font-medium text-[#1B3D6D] mb-1.5">
                                            Stock
                                        </label>
                                        <input 
                                            type="number" 
                                            placeholder="20"
                                            className="w-full rounded-[4px] border border-[#E5E7EB] px-3 py-2 text-[13.5px] text-[#4B5563] outline-none"
                                        />
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
                                    Imágenes y multimedia<span className="text-red-500">*</span>
                                </label>
                                
                                <div className="w-full h-[150px] rounded-[6px] border border-[#E5E7EB] flex items-center justify-center relative overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPC9zdmc+')]">
                                </div>
                                <div className="text-center mt-3">
                                    <button type="button" className="text-[#1B3D6D] border border-[#1B3D6D] rounded-[4px] px-4 py-1.5 text-[12px] font-medium hover:bg-[#F8F9FA] transition-colors inline-flex items-center gap-2">
                                        <FontAwesomeIcon icon={faImage} className="text-[11px]" />
                                        Subir Imagen
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-[13.5px] font-semibold text-[#1B3D6D] mb-2">Galería</label>
                                    <div className="flex gap-2 items-center">
                                        <div className="w-16 h-16 rounded-[4px] border border-[#E5E7EB] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPC9zdmc+')]"></div>
                                        <div className="w-16 h-16 rounded-[4px] border border-[#E5E7EB] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPC9zdmc+')]"></div>
                                        <div className="w-16 h-16 rounded-[4px] border border-[#E5E7EB] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPC9zdmc+')]"></div>
                                        
                                        <button type="button" className="w-8 h-8 rounded-full border border-[#1B3D6D] text-[#1B3D6D] flex items-center justify-center hover:bg-[#F8F9FA] transition-colors shadow-sm ml-1">
                                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Status Radios */}
                            <div className="mt-4 flex flex-col gap-4">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center mt-0.5">
                                        <input type="radio" name="status" defaultChecked className="peer sr-only" />
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
                                        <input type="radio" name="status" className="peer sr-only" />
                                        <div className="w-4 h-4 border border-[#D1D5DB] rounded-[3px] peer-checked:bg-[#1B3D6D] peer-checked:border-[#1B3D6D] transition-all"></div>
                                        <FontAwesomeIcon icon={faPlus} className="text-white text-[9px] absolute opacity-0 peer-checked:opacity-100 rotate-45" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13.5px] font-medium text-[#111827]">Pausado</span>
                                        <span className="text-[12px] text-[#A0A0A0]">No aparece en el sitio web pero sigue en la base de datos y en la "lista de productos".</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                    </form>

                </div>

                {/* Footer */}
                <div className="bg-white border-t border-[#F3F4F6] px-6 py-4 flex justify-end gap-3 z-10 shrink-0">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-6 py-2 rounded-md border border-[#1B3D6D] text-[#1B3D6D] text-[13.5px] font-semibold hover:bg-[#F8F9FA] transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="px-6 py-2 rounded-md bg-[#1B3D6D] text-white text-[13.5px] font-semibold hover:bg-[#1B3D6D]/90 transition-colors shadow-sm"
                    >
                        Guardar producto
                    </button>
                </div>
                
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
