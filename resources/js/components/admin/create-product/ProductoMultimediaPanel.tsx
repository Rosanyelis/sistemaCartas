import { faImage, faPlus, faTimes, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ChangeEvent, CSSProperties } from 'react';
import { MAX_IMAGENES_GALERIA } from '@/components/admin/create-story/constants';

const checkerboardBackground: CSSProperties = {
    backgroundImage:
        'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 10px 10px',
};

interface ProductoMultimediaErrors {
    imagen?: string;
    video?: string;
    galeria?: string;
    estado?: string;
}

export interface ProductoMultimediaPanelProps {
    imgPreview: string | null;
    videoPreview: string | null;
    galleryPreviews: string[];
    galleryPreviewKeys?: string[];
    galeriaLength: number;
    estado: string;
    estadoRadioName: string;
    onEstadoChange: (estado: 'activo' | 'pausado') => void;
    onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onVideoChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onGalleryChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onRemoveGalleryImage: (index: number) => void;
    errors: ProductoMultimediaErrors;
    fieldIds: { imagen: string; video: string };
}

/**
 * Bloque de imagen principal, galería, vídeo y estado para el formulario de producto (admin).
 * Misma idea operativa que en historias, pero sin campos propios de historia (p. ej. destacada).
 */
export function ProductoMultimediaPanel({
    imgPreview,
    videoPreview,
    galleryPreviews,
    galleryPreviewKeys,
    galeriaLength,
    estado,
    estadoRadioName,
    onEstadoChange,
    onImageChange,
    onVideoChange,
    onGalleryChange,
    onRemoveGalleryImage,
    errors,
    fieldIds,
}: ProductoMultimediaPanelProps) {
    const imageAreaStyle: CSSProperties | undefined = imgPreview ? undefined : checkerboardBackground;

    return (
        <div className="mt-2 flex flex-col gap-4">
            <h3 className="text-[14px] font-bold text-[#1B3D6D]">Imágenes y multimedia</h3>

            <div className="flex flex-col gap-2">
                <label htmlFor={fieldIds.imagen} className="text-[13px] font-semibold text-[#1B3D6D]">
                    Imagen principal (JPG, PNG, máx 2MB)
                </label>
                <div
                    className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-[#DFE4EA] bg-[#F9FAFB]"
                    style={imageAreaStyle}
                >
                    {imgPreview ? (
                        <img src={imgPreview} alt="Vista previa de la portada" className="h-full w-full object-contain" />
                    ) : (
                        <FontAwesomeIcon icon={faImage} className="text-4xl text-[#DFE4EA]" />
                    )}
                </div>
                <input type="file" id={fieldIds.imagen} className="hidden" onChange={onImageChange} accept="image/*" />
                <label
                    htmlFor={fieldIds.imagen}
                    className="mx-auto mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-[#1B3D6D] px-6 py-[7px] text-[13px] font-semibold text-[#1B3D6D] transition-colors hover:bg-gray-50"
                >
                    <FontAwesomeIcon icon={faPlus} className="text-[13px]" /> Subir imagen
                </label>
                {errors.imagen ? <span className="text-center text-[11px] text-red-500">{errors.imagen}</span> : null}
            </div>

            <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-bold text-[#1B3D6D]">
                        Galería de imágenes ({MAX_IMAGENES_GALERIA} max)
                    </h3>
                    <span className="text-[11px] text-[#A0A0A0]">
                        {galeriaLength}/{MAX_IMAGENES_GALERIA}
                    </span>
                </div>

                <div className="flex flex-wrap gap-3">
                    {galleryPreviews.map((preview, idx) => (
                        <div
                            key={galleryPreviewKeys?.[idx] ?? `galeria-preview-${idx}`}
                            className="group relative h-[68px] w-[68px] overflow-hidden rounded-[6px] border border-[#DFE4EA] bg-white"
                        >
                            <img src={preview} alt={`Galería ${idx + 1}`} className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => onRemoveGalleryImage(idx)}
                                className="absolute right-[2px] top-[2px] z-10 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                            </button>
                        </div>
                    ))}

                    {Array.from({ length: Math.max(0, 3 - galeriaLength) }).map((_, i) => (
                        <div
                            key={`placeholder-${i}`}
                            className="h-[68px] w-[68px] rounded-[6px] border border-dashed border-[#DFE4EA] bg-[#F9FAFB]"
                        />
                    ))}

                    {galeriaLength < MAX_IMAGENES_GALERIA ? (
                        <label className="flex h-[68px] w-[68px] cursor-pointer items-center justify-center transition-transform hover:scale-105">
                            <input type="file" className="hidden" multiple onChange={onGalleryChange} accept="image/*" />
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#1B3D6D] text-[#1B3D6D]">
                                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                            </div>
                        </label>
                    ) : null}
                </div>
                {errors.galeria ? <span className="text-[11px] text-red-500">{errors.galeria}</span> : null}
            </div>

            <div className="mt-4 flex flex-col gap-2">
                <label htmlFor={fieldIds.video} className="text-[13px] font-semibold text-[#1B3D6D]">
                    Vídeo (opcional)
                </label>
                <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-[#DFE4EA] bg-[#F9FAFB]">
                    {videoPreview ? (
                        <video src={videoPreview} className="h-full w-full object-cover" controls />
                    ) : (
                        <FontAwesomeIcon icon={faVideo} className="text-4xl text-[#DFE4EA]" />
                    )}
                </div>
                <input type="file" id={fieldIds.video} className="hidden" onChange={onVideoChange} accept="video/*" />
                <label
                    htmlFor={fieldIds.video}
                    className="mx-auto mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-[#1B3D6D] px-6 py-[7px] text-[13px] font-semibold text-[#1B3D6D] transition-colors hover:bg-gray-50"
                >
                    <FontAwesomeIcon icon={faPlus} className="text-[13px]" /> Subir vídeo
                </label>
                {errors.video ? <span className="text-center text-[11px] text-red-500">{errors.video}</span> : null}
            </div>

            <div className="mb-2 mt-6 flex flex-col gap-4">
                <label className="group flex cursor-pointer items-start gap-3">
                    <div className="relative mt-0.5 flex items-center justify-center">
                        <input
                            type="radio"
                            name={estadoRadioName}
                            value="activo"
                            checked={estado === 'activo'}
                            onChange={() => onEstadoChange('activo')}
                            className="peer appearance-none rounded-full border border-[#DFE4EA] text-[#1B3D6D] outline-none transition-all checked:border-[5px] checked:border-[#1B3D6D] focus:ring-[#1B3D6D] h-4 w-4"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[#1B3D6D]">Activo</span>
                        <span className="text-[11.5px] text-[#A0A0A0]">
                            Está publicado en el sitio web y puede recibir ventas.
                        </span>
                    </div>
                </label>

                <label className="group flex cursor-pointer items-start gap-3">
                    <div className="relative mt-0.5 flex items-center justify-center">
                        <input
                            type="radio"
                            name={estadoRadioName}
                            value="pausado"
                            checked={estado === 'pausado'}
                            onChange={() => onEstadoChange('pausado')}
                            className="peer appearance-none rounded-full border border-[#DFE4EA] text-[#1B3D6D] outline-none transition-all checked:border-[5px] checked:border-[#1B3D6D] focus:ring-[#1B3D6D] h-4 w-4"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[#1B3D6D]">Pausado</span>
                        <span className="text-[11.5px] text-[#A0A0A0]">
                            No aparece en el sitio web pero sigue en la base de datos y en la lista de productos.
                        </span>
                    </div>
                </label>
                {errors.estado ? <span className="text-[11px] text-red-500">{errors.estado}</span> : null}
            </div>
        </div>
    );
}
