import { faImage, faPlus, faTimes, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { CSSProperties } from 'react';
import { MAX_IMAGENES_GALERIA } from './constants';

const checkerboardBackground: CSSProperties = {
    backgroundImage:
        'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 10px 10px',
};

interface MultimediaErrors {
    imagen?: string;
    video?: string;
    galeria?: string;
    estado?: string;
    destacada?: string;
}

interface HistoriaMultimediaPanelProps {
    imgPreview: string | null;
    videoPreview: string | null;
    galleryPreviews: string[];
    /** Claves estables por entrada (p. ej. `e-12` / `nuevo-0`); si faltan se usa el índice. */
    galleryPreviewKeys?: string[];
    galeriaLength: number;
    estado: string;
    estadoRadioName: string;
    onEstadoChange: (estado: 'activo' | 'pausado') => void;
    destacada: 'si' | 'no';
    destacadaRadioName: string;
    onDestacadaChange: (v: 'si' | 'no') => void;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveGalleryImage: (index: number) => void;
    errors: MultimediaErrors;
    fieldIds: { imagen: string; video: string };
}

/** Bloque de imagen principal, galería, video y estado de publicación. */
export function HistoriaMultimediaPanel({
    imgPreview,
    videoPreview,
    galleryPreviews,
    galleryPreviewKeys,
    galeriaLength,
    estado,
    estadoRadioName,
    onEstadoChange,
    destacada,
    destacadaRadioName,
    onDestacadaChange,
    onImageChange,
    onVideoChange,
    onGalleryChange,
    onRemoveGalleryImage,
    errors,
    fieldIds,
}: HistoriaMultimediaPanelProps) {
    const imageAreaStyle: CSSProperties | undefined = imgPreview ? undefined : checkerboardBackground;

    return (
        <div className="flex flex-col gap-4 mt-2">
            <h3 className="text-[14px] font-bold text-[#1B3D6D]">Imágenes y multimedia</h3>

            <div className="flex flex-col gap-2">
                <label htmlFor={fieldIds.imagen} className="text-[13px] font-semibold text-[#1B3D6D]">
                    Imagen principal (JPG, PNG, máx 2MB)
                </label>
                <div
                    className="w-full h-40 rounded-md border-2 border-dashed border-[#DFE4EA] bg-[#F9FAFB] flex relative overflow-hidden items-center justify-center"
                    style={imageAreaStyle}
                >
                    {imgPreview ? (
                        <img src={imgPreview} alt="Vista previa de la portada" className="w-full h-full object-contain" />
                    ) : (
                        <FontAwesomeIcon icon={faImage} className="text-[#DFE4EA] text-4xl" />
                    )}
                </div>
                <input
                    type="file"
                    id={fieldIds.imagen}
                    className="hidden"
                    onChange={onImageChange}
                    accept="image/*"
                />
                <label
                    htmlFor={fieldIds.imagen}
                    className="mx-auto mt-2 py-[7px] px-6 rounded-[4px] border border-[#1B3D6D] text-[13px] font-semibold text-[#1B3D6D] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    <FontAwesomeIcon icon={faPlus} className="text-[13px]" /> Subir Imagen
                </label>
                {errors.imagen && <span className="text-red-500 text-[11px] text-center">{errors.imagen}</span>}
            </div>

            <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-bold text-[#1B3D6D]">
                        Galería de imágenes ({MAX_IMAGENES_GALERIA} max)<span className="text-red-500">*</span>
                    </h3>
                    <span className="text-[11px] text-[#A0A0A0]">
                        {galeriaLength}/{MAX_IMAGENES_GALERIA}
                    </span>
                </div>

                <div className="flex flex-wrap gap-3">
                    {galleryPreviews.map((preview, idx) => (
                        <div
                            key={galleryPreviewKeys?.[idx] ?? `galeria-preview-${idx}`}
                            className="relative w-[68px] h-[68px] rounded-[6px] border border-[#DFE4EA] bg-white overflow-hidden group"
                        >
                            <img src={preview} alt={`Galería ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => onRemoveGalleryImage(idx)}
                                className="absolute top-[2px] right-[2px] w-4 h-4 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                            </button>
                        </div>
                    ))}

                    {Array.from({ length: Math.max(0, 3 - galeriaLength) }).map((_, i) => (
                        <div
                            key={`placeholder-${i}`}
                            className="w-[68px] h-[68px] rounded-[6px] border border-dashed border-[#DFE4EA] bg-[#F9FAFB]"
                        />
                    ))}

                    {galeriaLength < MAX_IMAGENES_GALERIA && (
                        <label className="flex items-center justify-center w-[68px] h-[68px] cursor-pointer hover:scale-105 transition-transform">
                            <input type="file" className="hidden" multiple onChange={onGalleryChange} accept="image/*" />
                            <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#1B3D6D] text-[#1B3D6D]">
                                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                            </div>
                        </label>
                    )}
                </div>
                {errors.galeria && <span className="text-red-500 text-[11px]">{errors.galeria}</span>}
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label htmlFor={fieldIds.video} className="text-[13px] font-semibold text-[#1B3D6D]">
                    Video<span className="text-red-500">*</span>
                </label>
                <div className="w-full h-40 rounded-md border-2 border-dashed border-[#DFE4EA] bg-[#F9FAFB] flex relative overflow-hidden items-center justify-center">
                    {videoPreview ? (
                        <video src={videoPreview} className="w-full h-full object-cover" controls />
                    ) : (
                        <FontAwesomeIcon icon={faVideo} className="text-[#DFE4EA] text-4xl" />
                    )}
                </div>
                <input
                    type="file"
                    id={fieldIds.video}
                    className="hidden"
                    onChange={onVideoChange}
                    accept="video/*"
                />
                <label
                    htmlFor={fieldIds.video}
                    className="mx-auto mt-2 py-[7px] px-6 rounded-[4px] border border-[#1B3D6D] text-[13px] font-semibold text-[#1B3D6D] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    <FontAwesomeIcon icon={faPlus} className="text-[13px]" /> Subir Video
                </label>
                {errors.video && <span className="text-red-500 text-[11px] text-center">{errors.video}</span>}
            </div>

            <div className="flex flex-col gap-4 mt-6 mb-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                        <input
                            type="radio"
                            name={estadoRadioName}
                            value="activo"
                            checked={estado === 'activo'}
                            onChange={() => onEstadoChange('activo')}
                            className="peer w-4 h-4 rounded-full border-[#DFE4EA] text-[#1B3D6D] focus:ring-[#1B3D6D] outline-none transition-all appearance-none border checked:border-[5px] checked:border-[#1B3D6D]"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[#1B3D6D]">Activo</span>
                        <span className="text-[11.5px] text-[#A0A0A0]">
                            Esta publicado en el sitio web y recibiendo ventas.
                        </span>
                    </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                        <input
                            type="radio"
                            name={estadoRadioName}
                            value="pausado"
                            checked={estado === 'pausado'}
                            onChange={() => onEstadoChange('pausado')}
                            className="peer w-4 h-4 rounded-full border-[#DFE4EA] text-[#1B3D6D] focus:ring-[#1B3D6D] outline-none transition-all appearance-none border checked:border-[5px] checked:border-[#1B3D6D]"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[#1B3D6D]">Pausado</span>
                        <span className="text-[11.5px] text-[#A0A0A0]">
                            No aparece en el sitio web pero sigue en la base de datos y en la &quot;lista de historias&quot;.
                        </span>
                    </div>
                </label>
                {errors.estado && <span className="text-red-500 text-[11px]">{errors.estado}</span>}
            </div>

            <div className="flex flex-col gap-4 mt-6 border-t border-[#F3F4F6] pt-6">
                <span className="text-[13px] font-bold text-[#1B3D6D]">Destacada</span>
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                        <input
                            type="radio"
                            name={destacadaRadioName}
                            value="no"
                            checked={destacada === 'no'}
                            onChange={() => onDestacadaChange('no')}
                            className="peer w-4 h-4 rounded-full border-[#DFE4EA] text-[#1B3D6D] focus:ring-[#1B3D6D] outline-none transition-all appearance-none border checked:border-[5px] checked:border-[#1B3D6D]"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[#1B3D6D]">No destacada</span>
                        <span className="text-[11.5px] text-[#A0A0A0]">
                            Aparece con el resto de historias según el listado habitual.
                        </span>
                    </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                        <input
                            type="radio"
                            name={destacadaRadioName}
                            value="si"
                            checked={destacada === 'si'}
                            onChange={() => onDestacadaChange('si')}
                            className="peer w-4 h-4 rounded-full border-[#DFE4EA] text-[#1B3D6D] focus:ring-[#1B3D6D] outline-none transition-all appearance-none border checked:border-[5px] checked:border-[#1B3D6D]"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[#1B3D6D]">Destacada</span>
                        <span className="text-[11.5px] text-[#A0A0A0]">
                            Priorizar en portadas o bloques especiales donde se muestren historias destacadas.
                        </span>
                    </div>
                </label>
                {errors.destacada && <span className="text-red-500 text-[11px]">{errors.destacada}</span>}
            </div>
        </div>
    );
}
