import {
    HISTORIA_DETALLE_INCLUSION_ICONS
    
} from '@/constants/historia-detalle-inclusion-icons';
import type {HistoriaDetalleInclusionIconName} from '@/constants/historia-detalle-inclusion-icons';
import { MAX_PALABRAS_TEXTO_LARGO } from './constants';
import type {
    HistoriaDestacadaForm,
    HistoriaDetalleInclusionRow,
    HistoriaFormData,
    HistoriaParaFormulario,
    HistoriaVarianteForm,
} from './types';
import { clampToMaxWords } from './wordLimit';

function str(v: unknown, fallback = ''): string {
    if (v === null || v === undefined) {
        return fallback;
    }

    return String(v);
}

/** Texto plano: recorta palabras. HTML (TipTap): se deja tal cual para no romper etiquetas. */
function clampLargoFormulario(raw: string): string {
    if (/<[a-z][\s\S]*>/i.test(raw)) {
        return raw;
    }

    return clampToMaxWords(raw, MAX_PALABRAS_TEXTO_LARGO);
}

const allowedInclusionIcons = new Set<string>(HISTORIA_DETALLE_INCLUSION_ICONS);

function normalizeDestacada(raw: unknown): HistoriaDestacadaForm {
    const s = str(raw).toLowerCase();

    return s === 'si' ? 'si' : 'no';
}

/**
 * Normaliza `detalle` desde API (array), JSON string o datos legacy (HTML → sin filas).
 */
export function normalizeDetalleInclusiones(raw: unknown): HistoriaDetalleInclusionRow[] {
    if (Array.isArray(raw)) {
        return raw
            .filter((x): x is Record<string, unknown> => x !== null && typeof x === 'object' && !Array.isArray(x))
            .map((x) => {
                const iconRaw = typeof x.icon === 'string' ? x.icon : '';
                const icon: HistoriaDetalleInclusionRow['icon'] = allowedInclusionIcons.has(iconRaw)
                    ? (iconRaw as HistoriaDetalleInclusionIconName)
                    : iconRaw === ''
                      ? ''
                      : 'FileText';

                return {
                    icon,
                    title: typeof x.title === 'string' ? x.title : '',
                    description: typeof x.description === 'string' ? x.description : '',
                };
            });
    }

    if (typeof raw === 'string' && raw.trim() !== '') {
        try {
            const parsed: unknown = JSON.parse(raw);

            if (Array.isArray(parsed)) {
                return normalizeDetalleInclusiones(parsed);
            }
        } catch {
            /* legacy HTML u otro texto: ignorar */
        }
    }

    return [];
}

export function buildHistoriaFormData(source?: HistoriaParaFormulario | null): HistoriaFormData {
    if (!source) {
        return {
            nombre: '',
            descripcion_corta: '',
            descripcion_larga: '',
            detalle: [],
            categoria: '',
            autor: '',
            precio_base: '',
            precio_promocional: '',
            impuesto: '18',
            codigo: '',
            imagen: null,
            video: null,
            peso: '',
            dimensiones: '',
            estado: 'activo',
            destacada: 'no',
            duracion_meses: '12',
            variantes: [],
            galeria: [],
        };
    }

    const variantes: HistoriaVarianteForm[] = (source.variantes ?? []).map((v) => {
        const raw = v as HistoriaVarianteForm & {
            nombre?: string;
            es_papel?: boolean;
            tipo_papel?: string;
            color_hex?: string;
        };

        if (raw.tipo === 'papel' || raw.tipo === 'color') {
            return {
                tipo: raw.tipo,
                valor: str(raw.valor),
            };
        }

        const esPapel = Boolean(raw.es_papel);

        if (esPapel) {
            const parts = [str(raw.tipo_papel), str(raw.nombre), str(raw.color_hex)].filter((x) => x !== '');

            return {
                tipo: 'papel',
                valor: parts.length > 0 ? parts.join(' | ') : '',
            };
        }

        return {
            tipo: 'color',
            valor: str(raw.color_hex) || str(raw.nombre) || '',
        };
    });

    return {
        nombre: str(source.nombre),
        descripcion_corta: str(source.descripcion_corta),
        descripcion_larga: clampLargoFormulario(str(source.descripcion_larga)),
        detalle: normalizeDetalleInclusiones(source.detalle),
        categoria: str(source.categoria),
        autor: str(source.autor),
        precio_base: str(source.precio_base),
        precio_promocional: str(source.precio_promocional),
        impuesto: str(source.impuesto, '18'),
        codigo: str(source.codigo),
        imagen: null,
        video: null,
        peso: str(source.peso),
        dimensiones: str(source.dimensiones),
        estado: str(source.estado, 'activo') || 'activo',
        destacada: normalizeDestacada(source.destacada),
        duracion_meses: str(
            source.duracion_meses !== undefined && source.duracion_meses !== null ? String(source.duracion_meses) : '',
            '12',
        ),
        variantes,
        galeria: [],
    };
}
