export const MAX_IMAGENES_GALERIA = 5;

export const MENSAJE_MAX_IMAGENES_GALERIA = 'Máximo 5 imágenes en la galería.';

/** 5 MB — alineado con reglas Laravel `max:5120` (kilobytes). */
export const MAX_IMAGEN_BYTES = 5 * 1024 * 1024;

export const MENSAJE_MAX_IMAGEN = 'La imagen no puede superar 5 MB.';

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

export function validateMediaFileSize(
    file: File,
    maxBytes: number,
    message: string,
): string | null {
    if (file.size > maxBytes) {
        return message;
    }

    return null;
}

/** 50 MB — alineado con reglas Laravel `max:51200` (kilobytes). */
export const MAX_AUDIO_BYTES = 50 * 1024 * 1024;

export const MENSAJE_MAX_AUDIO = 'El audio no puede superar 50 MB.';

export const AUDIO_ALLOWED_TYPES = [
    'audio/mpeg',
    'audio/mp4',
    'audio/x-m4a',
    'audio/wav',
    'audio/ogg',
] as const;

export const MENSAJE_AUDIO_TIPO = 'El formato de audio no está permitido.';
