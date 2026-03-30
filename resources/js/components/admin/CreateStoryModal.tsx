import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faImage, faPlus, faVideo, faBold, faItalic, faUnderline, faListUl, faAlignLeft, faParagraph, faLink, faFillDrip, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

interface CreateStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateStoryModal({ isOpen, onClose }: CreateStoryModalProps) {
    if (!isOpen) return null;

    // Fake toolbar component para el wysiwyg
    const RichTextToolbar = () => (
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 rounded-t-[4px]">
            <button type="button" className="text-[#4B5563] hover:text-[#1B3D6D]"><FontAwesomeIcon icon={faBold} className="text-[14px]" /></button>
            <button type="button" className="text-[#4B5563] hover:text-[#1B3D6D]"><FontAwesomeIcon icon={faItalic} className="text-[14px]" /></button>
            <button type="button" className="text-[#4B5563] hover:text-[#1B3D6D]"><span className="underline font-bold text-[14px]">I</span></button>
            <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
            <button type="button" className="text-[#4B5563] hover:text-[#1B3D6D]"><FontAwesomeIcon icon={faListUl} className="text-[14px]" /></button>
            <button type="button" className="text-[#4B5563] hover:text-[#1B3D6D]"><FontAwesomeIcon icon={faAlignLeft} className="text-[14px]" /></button>
            <button type="button" className="text-[#4B5563] hover:text-[#1B3D6D]"><FontAwesomeIcon icon={faParagraph} className="text-[14px]" /></button>
            <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
            <button type="button" className="text-[#4B5563] hover:text-[#1B3D6D]"><FontAwesomeIcon icon={faLink} className="text-[14px]" /></button>
            <button type="button" className="text-[#4B5563] hover:text-[#1B3D6D]"><FontAwesomeIcon icon={faFillDrip} className="text-[14px]" /></button>
            <button type="button" className="text-[#4B5563] hover:text-[#1B3D6D]"><FontAwesomeIcon icon={faImage} className="text-[14px]" /></button>
            <button type="button" className="ml-auto text-[#4B5563] hover:text-[#1B3D6D]"><FontAwesomeIcon icon={faEllipsisV} className="text-[14px]" /></button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B3D6D]/40 backdrop-blur-[2px] p-4 transition-opacity">
            <div 
                className="bg-white rounded-lg shadow-2xl flex flex-col w-full max-w-[1000px] max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-8 py-5 border-b border-[#F3F4F6]">
                    <h2 className="text-[16px] font-bold text-[#1B3D6D]">Crear Historia</h2>
                    <button 
                        onClick={onClose}
                        className="text-[#7B7B7B] hover:text-[#1B3D6D] transition-colors p-2 -mr-2 outline-none"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-[17px]" />
                    </button>
                </div>

                {/* Body form */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                        
                        {/* COLUMNA IZQUIERDA */}
                        <div className="flex flex-col gap-6">
                            
                            {/* Nombre */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                    Nombre de la historia<span className="text-[#EF4444]">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Historia en Londres"
                                    className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all"
                                />
                            </div>

                            {/* Descripción corta */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                    Descripción corta<span className="text-[#EF4444]">*</span>
                                </label>
                                <textarea 
                                    placeholder="Una apasionante aventura"
                                    rows={2}
                                    className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all resize-none"
                                />
                                <span className="text-[11.5px] text-[#A0A0A0]">Se mostrará en la sección principal de historias</span>
                            </div>

                            {/* Descripción larga */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                    Descripción larga<span className="text-[#EF4444]">*</span>
                                </label>
                                <div className="rounded-[4px] border border-[#DFE4EA] overflow-hidden">
                                    <RichTextToolbar />
                                    <textarea 
                                        placeholder="Una apasionante aventura por los rincones del Londres, una apasionante aventura por los rincones del Londres..."
                                        rows={4}
                                        className="w-full border-none bg-white px-3 py-3 text-[14px] text-gray-800 focus:ring-0 outline-none resize-none"
                                    />
                                    <div className="flex justify-end px-3 pb-2">
                                        <span className="text-[11px] text-[#A0A0A0]">0/500</span>
                                    </div>
                                </div>
                            </div>

                            {/* Detalle */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#1B3D6D]">Detalle</label>
                                <div className="rounded-[4px] border border-[#DFE4EA] overflow-hidden">
                                    <RichTextToolbar />
                                    <textarea 
                                        placeholder="Aquí detalles del producto"
                                        rows={4}
                                        className="w-full border-none bg-white px-3 py-3 text-[14px] text-gray-800 focus:ring-0 outline-none resize-none"
                                    />
                                    <div className="flex justify-end px-3 pb-2">
                                        <span className="text-[11px] text-[#A0A0A0]">0/500</span>
                                    </div>
                                </div>
                            </div>

                            {/* Categoría */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                    Categoría<span className="text-[#EF4444]">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Ficción"
                                    className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all"
                                />
                            </div>

                            {/* Autor */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                    Autor<span className="text-[#EF4444]">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Laura Pérez"
                                    className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all"
                                />
                            </div>

                            {/* Inventario */}
                            <div className="flex flex-col gap-4 mt-2">
                                <h3 className="text-[14px] font-bold text-[#1B3D6D]">Inventario</h3>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                        Código de historia<span className="text-[#EF4444]">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="HST-135790"
                                        className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Variantes */}
                            <div className="flex flex-col gap-4 mt-2">
                                <h3 className="text-[14px] font-bold text-[#1B3D6D]">Variantes(Opcional)</h3>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">Color</label>
                                    <select className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-700 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all appearance-none cursor-pointer">
                                        <option>Beige</option>
                                        <option>Blanco</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5 mt-1">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">Papel</label>
                                    <select className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-700 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all appearance-none cursor-pointer">
                                        <option>Papel Reciclado</option>
                                        <option>Papel Premium</option>
                                    </select>
                                </div>
                                <button className="mt-2 w-full md:w-[200px] mx-auto py-2 px-4 rounded-[4px] border border-[#1B3D6D] text-[13px] font-semibold text-[#1B3D6D] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    <FontAwesomeIcon icon={faPlus} className="text-[12px]" /> Agregar Variante
                                </button>
                            </div>

                        </div>

                        {/* COLUMNA DERECHA */}
                        <div className="flex flex-col gap-6">
                            
                            {/* Precios e Impuesto */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                    Precio Base<span className="text-[#EF4444]">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="25.00"
                                    className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                    Precio promocional<span className="text-[#EF4444]">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="0"
                                    className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                    Impuesto<span className="text-[#EF4444]">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="18%"
                                    className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all"
                                />
                                <span className="text-[11.5px] text-[#A0A0A0]">Impuesto que se va a cobrar por las transacciones</span>
                            </div>

                            {/* Información de envío */}
                            <div className="flex flex-col gap-4 mt-2">
                                <h3 className="text-[14px] font-bold text-[#1B3D6D]">Información de envío</h3>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                        Peso<span className="text-[#EF4444]">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="0kg"
                                        className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 mt-1">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                        Dimensiones<span className="text-[#EF4444]">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="0x0x0"
                                        className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 mt-1">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                        Tipo de envío<span className="text-[#EF4444]">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="0x0x0"
                                        className="w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Imágenes y multimedia */}
                            <div className="flex flex-col gap-4 mt-2">
                                <h3 className="text-[14px] font-bold text-[#1B3D6D]">Imágenes y multimedia</h3>
                                
                                {/* Imagen Principal */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                        Imagen principal<span className="text-[#EF4444]">*</span>
                                    </label>
                                    <div className="w-full h-32 rounded-md border-2 border-dashed border-[#DFE4EA] bg-[#F9FAFB] flex relative"
                                        style={{backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px'}}
                                    ></div>
                                    <button className="mx-auto mt-2 py-[7px] px-6 rounded-[4px] border border-[#1B3D6D] text-[13px] font-semibold text-[#1B3D6D] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 max-w-fit">
                                        <FontAwesomeIcon icon={faImage} className="text-[13px]" /> Subir Imagen
                                    </button>
                                </div>

                                {/* Galería */}
                                <div className="flex flex-col gap-2 mt-2">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                        Galería de imágenes (5 max)<span className="text-[#EF4444]">*</span>
                                    </label>
                                    <div className="flex gap-3 items-center">
                                        {/* Thumbs */}
                                        <div className="w-16 h-16 rounded-[4px] border border-[#DFE4EA] bg-[#F9FAFB]" style={{backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px'}}></div>
                                        <div className="w-16 h-16 rounded-[4px] border border-[#DFE4EA] bg-[#F9FAFB]" style={{backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px'}}></div>
                                        <div className="w-16 h-16 rounded-[4px] border border-[#DFE4EA] bg-[#F9FAFB]" style={{backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px'}}></div>
                                        {/* Botón Add Thumb */}
                                        <button className="w-8 h-8 rounded-full border border-[#1B3D6D] bg-white text-[#1B3D6D] flex flex-col justify-center items-center hover:bg-gray-50 flex-shrink-0 ml-1">
                                            <FontAwesomeIcon icon={faPlus} className="text-[12px]" />
                                        </button>
                                    </div>
                                </div>

                                {/* Video */}
                                <div className="flex flex-col gap-2 mt-4">
                                    <label className="text-[13px] font-semibold text-[#1B3D6D]">
                                        Video<span className="text-[#EF4444]">*</span>
                                    </label>
                                    <div className="w-full h-32 rounded-md border-2 border-dashed border-[#DFE4EA] bg-[#F9FAFB] flex relative"
                                        style={{backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px'}}
                                    ></div>
                                    <button className="mx-auto mt-2 py-[7px] px-6 rounded-[4px] border border-[#1B3D6D] text-[13px] font-semibold text-[#1B3D6D] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 max-w-fit">
                                        <FontAwesomeIcon icon={faVideo} className="text-[13px]" /> Subir Video
                                    </button>
                                </div>

                                {/* Estatus Checkboxes */}
                                <div className="flex flex-col gap-4 mt-6 mb-2">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center mt-0.5">
                                            <input type="checkbox" className="peer w-4 h-4 rounded border-[#DFE4EA] checked:bg-[#1B3D6D] checked:border-[#1B3D6D] outline-none hover:ring-2 hover:ring-[#1B3D6D]/20 transition-all appearance-none" checked readOnly/>
                                            <div className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100">
                                                <svg className="w-2.5 h-2.5" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-semibold text-[#1B3D6D]">Activo</span>
                                            <span className="text-[11.5px] text-[#A0A0A0]">Esta publicado en el sitio web y recibiendo ventas.</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center mt-0.5">
                                            <input type="checkbox" className="peer w-4 h-4 rounded border-[#DFE4EA] checked:bg-[#1B3D6D] checked:border-[#1B3D6D] outline-none hover:ring-2 hover:ring-[#1B3D6D]/20 transition-all appearance-none bg-white border"/>
                                            <div className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100">
                                                <svg className="w-2.5 h-2.5" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-semibold text-[#1B3D6D]">Pausado</span>
                                            <span className="text-[11.5px] text-[#A0A0A0]">No aparece en el sitio web pero sigue en la base de datos y en la "lista de historias".</span>
                                        </div>
                                    </label>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-[#F3F4F6] bg-white flex justify-end gap-3 rounded-b-lg shrink-0 mt-auto">
                    <button 
                        onClick={onClose}
                        className="py-[9px] px-[22px] rounded-[4px] border border-[#1B3D6D] text-[14px] font-semibold text-[#1B3D6D] hover:bg-[#F9FAFB] transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        className="py-[9px] px-[22px] rounded-[4px] bg-[#1B3D6D] text-[14px] font-semibold text-white shadow-sm hover:bg-[#1B3D6D]/90 transition-colors"
                    >
                        Guardar Historia
                    </button>
                </div>

            </div>
        </div>
    );
}
