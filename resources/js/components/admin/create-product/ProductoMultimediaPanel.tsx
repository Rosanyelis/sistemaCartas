import { faImage, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
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
    galeria?: string;
    estado?: string;
}

export interface ProductoMultimediaPanelProps {
    imgPreview: string | null;
    galleryPreviews: string[];
    galleryPreviewKeys?: string[];
    galeriaLength: number;
    estado: string;
    estadoRadioName: string;
    onEstadoChange: (estado: 'activo' | 'pausado') => void;
    onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onGalleryChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onRemoveGalleryImage: (index: number) => void;
    errors: ProductoMultimediaErrors;
    fieldIds: { imagen: string };
}

/**
 * Bloque de imagen principal, galería y estado para el formulario de producto (admin).
 */
export function ProductoMultimediaPanel({
    imgPreview,
    galleryPreviews,
    galleryPreviewKeys,
    galeriaLength,
    estado,
    estadoRadioName,
    onEstadoChange,
    onImageChange,
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

            <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#1B3D6D]">Galería (máx. {MAX_IMAGENES_GALERIA} imágenes)</label>
                <div className="flex flex-wrap gap-2">
                    {galleryPreviews.map((preview, i) => (
                        <div key={galleryPreviewKeys?.[i] ?? `gallery-${i}`} className="relative">
                            <img
                                src={preview}
                                alt={`Galería ${i + 1}`}
                                className="h-[68px] w-[68px] rounded-[6px] border border-[#DFE4EA] object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveGalleryImage(i)}
                                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-sm"
                                aria-label="Quitar imagen de galería"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-[9px]" />
                            </button>
                        </div>
                    ))}

                    {Array.from({ length: Math.max(0, MAX_IMAGENES_GALERIA - galeriaLength) }).map((_, i) => (
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

            <div className="mb-2 mt-6 flex flex-col gap-4">
                <label className="group flex cursor-pointer items-start gap-3">
                    <div className="relative mt-0.5 flex items-center justify-center">
                        <input
                            type="radio"
                            name={estadoRadioName}
                            value="activo"
                            checked={estado === 'activo'}
                            onChange={() => onEstadoChange('activo')}
                            className="peer h-4 w-4 appearance-none rounded-full border border-[#DFE4EA] text-[#1B3D6D] outline-none transition-all checked:border-[5px] checked:border-[#1B3D6D] focus:ring-[#1B3D6D]"
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
                            className="peer h-4 w-4 appearance-none rounded-full border border-[#DFE4EA] text-[#1B3D6D] outline-none transition-all checked:border-[5px] checked:border-[#1B3D6D] focus:ring-[#1B3D6D]"
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
