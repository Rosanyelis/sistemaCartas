export const MAX_IMAGENES_GALERIA = 5;

export const MENSAJE_MAX_IMAGENES_GALERIA = 'Máximo 5 imágenes en la galería.';

export type GalleryFilePickResult = {
    files: File[];
    limitMessage: string | null;
};

/**
 * Filtra archivos de galería respetando el cupo restante (máx. 5 en total).
 */
export function pickGalleryFiles(
    inputFiles: File[],
    currentLength: number,
    options?: { imagesOnly?: boolean },
): GalleryFilePickResult {
    let files = inputFiles;

    if (options?.imagesOnly) {
        files = files.filter((file) => file.type.startsWith('image/'));
    }

    const available = MAX_IMAGENES_GALERIA - currentLength;

    if (available <= 0) {
        return { files: [], limitMessage: MENSAJE_MAX_IMAGENES_GALERIA };
    }

    const accepted = files.slice(0, available);

    if (files.length > accepted.length) {
        return { files: accepted, limitMessage: MENSAJE_MAX_IMAGENES_GALERIA };
    }

    return { files: accepted, limitMessage: null };
}
