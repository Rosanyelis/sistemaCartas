import { faArrowDown, faArrowUp, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { HISTORIA_DETALLE_INCLUSION_ICONS } from '@/constants/historia-detalle-inclusion-icons';
import type { HistoriaDetalleInclusionIconName } from '@/constants/historia-detalle-inclusion-icons';
import { inclusionIconOrFallback } from '@/lib/historia-detalle-inclusion-lucide-map';
import { cn } from '@/lib/utils';
import type { HistoriaDetalleInclusionRow } from './types';

const fieldClass =
    'w-full rounded-[4px] border border-[#DFE4EA] bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all';

const fieldErrorClass =
    'w-full rounded-[4px] border border-red-500 bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-red-600 focus:ring-1 focus:ring-red-200 outline-none transition-all';

interface HistoriaDetalleInclusionsEditorProps {
    items: HistoriaDetalleInclusionRow[];
    onChange: (items: HistoriaDetalleInclusionRow[]) => void;
    errors: Record<string, string | string[] | undefined>;
    rootId: string;
}

export function HistoriaDetalleInclusionsEditor({
    items,
    onChange,
    errors,
    rootId,
}: HistoriaDetalleInclusionsEditorProps) {
    const err = (key: string): string | undefined => {
        const v = errors[key];

        if (Array.isArray(v)) {
            return v[0];
        }

        return typeof v === 'string' ? v : undefined;
    };

    const addRow = (): void => {
        onChange([
            ...items,
            {
                icon: '',
                title: '',
                description: '',
            },
        ]);
    };

    const updateRow = (index: number, patch: Partial<HistoriaDetalleInclusionRow>): void => {
        const next = [...items];
        next[index] = { ...next[index], ...patch };

        onChange(next);
    };

    const removeRow = (index: number): void => {
        onChange(items.filter((_, i) => i !== index));
    };

    const moveRow = (index: number, direction: -1 | 1): void => {
        const j = index + direction;

        if (j < 0 || j >= items.length) {
            return;
        }

        const next = [...items];
        [next[index], next[j]] = [next[j], next[index]];
        onChange(next);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <span className="text-[13px] font-semibold text-[#1B3D6D]">¿Qué incluye cada envío?</span>
                    <p className="text-[11.5px] text-[#A0A0A0] mt-0.5">
                        Lista (icono, título obligatorio, descripción opcional).
                    </p>
                </div>
                <button
                    type="button"
                    onClick={addRow}
                    className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#1B3D6D] px-3 py-2 text-[13px] font-semibold text-[#1B3D6D] hover:bg-[#1B3D6D]/5"
                >
                    <FontAwesomeIcon icon={faPlus} className="text-[12px]" />
                    Añadir ítem
                </button>
            </div>

            {typeof errors.detalle === 'string' ? (
                <span className="text-red-500 text-[11px]">{errors.detalle}</span>
            ) : null}

            {items.length === 0 ? (
                <p className="text-[12px] text-[#7B7B7B] border border-dashed border-[#DFE4EA] rounded-[4px] px-3 py-4 text-center">
                    Sin ítems. Añade filas para mostrar la sección en la ficha pública.
                </p>
            ) : null}

            <div className="flex flex-col gap-3">
                {items.map((row, index) => (
                    <div
                        key={`${rootId}-inclusion-${index}`}
                        className="rounded-[4px] border border-[#DFE4EA] bg-[#FAFBFC] p-3 flex flex-col gap-2"
                    >
                        <div className="flex flex-wrap items-end gap-2">
                            <div className="flex flex-col gap-1 min-w-[140px] flex-1">
                                <span
                                    id={`${rootId}-inclusion-icon-label-${index}`}
                                    className="text-[11px] font-medium text-[#6B7280]"
                                >
                                    Icono
                                </span>
                                <Select
                                    value={row.icon === '' ? undefined : row.icon}
                                    onValueChange={(value) =>
                                        updateRow(index, {
                                            icon: value as HistoriaDetalleInclusionIconName,
                                        })
                                    }
                                >
                                    <SelectTrigger
                                        id={`${rootId}-inclusion-icon-${index}`}
                                        aria-labelledby={`${rootId}-inclusion-icon-label-${index}`}
                                        aria-invalid={Boolean(err(`detalle.${index}.icon`))}
                                        className={cn(
                                            'h-auto min-h-10 w-full max-w-none justify-between border-[#DFE4EA] bg-white py-2 text-[14px] text-gray-800 shadow-sm hover:bg-white focus-visible:border-[#1B3D6D] focus-visible:ring-[#1B3D6D]/20',
                                            err(`detalle.${index}.icon`) ? 'border-red-500' : '',
                                        )}
                                    >
                                        <SelectValue placeholder="Seleccione icono..." />
                                    </SelectTrigger>
                                    <SelectContent
                                        position="popper"
                                        className="max-h-[min(280px,50vh)] w-[var(--radix-select-trigger-width)] border-[#DFE4EA]"
                                        sideOffset={4}
                                    >
                                        {HISTORIA_DETALLE_INCLUSION_ICONS.map((name) => {
                                            const IconOption = inclusionIconOrFallback(name);

                                            return (
                                                <SelectItem
                                                    key={name}
                                                    value={name}
                                                    textValue={name}
                                                    className="cursor-pointer py-2 pl-2 pr-8 text-[13px] text-[#1B3D6D] focus:bg-[#1B3D6D]/8"
                                                >
                                                    <IconOption
                                                        className="size-[18px] shrink-0 text-[#1B3D6D]"
                                                        strokeWidth={1.75}
                                                    />
                                                    <span className="font-medium">{name}</span>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                {err(`detalle.${index}.icon`) ? (
                                    <span className="text-red-500 text-[11px]">{err(`detalle.${index}.icon`)}</span>
                                ) : null}
                            </div>
                            <div className="flex gap-1 shrink-0">
                                <button
                                    type="button"
                                    title="Subir"
                                    disabled={index === 0}
                                    onClick={() => moveRow(index, -1)}
                                    className="rounded px-2 py-2 text-[#1B3D6D] border border-[#DFE4EA] bg-white disabled:opacity-40"
                                >
                                    <FontAwesomeIcon icon={faArrowUp} />
                                </button>
                                <button
                                    type="button"
                                    title="Bajar"
                                    disabled={index === items.length - 1}
                                    onClick={() => moveRow(index, 1)}
                                    className="rounded px-2 py-2 text-[#1B3D6D] border border-[#DFE4EA] bg-white disabled:opacity-40"
                                >
                                    <FontAwesomeIcon icon={faArrowDown} />
                                </button>
                                <button
                                    type="button"
                                    title="Quitar"
                                    onClick={() => removeRow(index)}
                                    className="rounded px-2 py-2 text-red-600 border border-red-200 bg-white hover:bg-red-50"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor={`${rootId}-inclusion-title-${index}`}
                                className="text-[11px] font-medium text-[#6B7280]"
                            >
                                Título<span className="text-[#EF4444]">*</span>
                            </label>
                            <input
                                id={`${rootId}-inclusion-title-${index}`}
                                type="text"
                                value={row.title}
                                onChange={(ev) => updateRow(index, { title: ev.target.value })}
                                placeholder="Ej. La carta escrita a mano"
                                className={err(`detalle.${index}.title`) ? fieldErrorClass : fieldClass}
                            />
                            {err(`detalle.${index}.title`) ? (
                                <span className="text-red-500 text-[11px]">{err(`detalle.${index}.title`)}</span>
                            ) : null}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor={`${rootId}-inclusion-desc-${index}`}
                                className="text-[11px] font-medium text-[#6B7280]"
                            >
                                Descripción (opcional)
                            </label>
                            <textarea
                                id={`${rootId}-inclusion-desc-${index}`}
                                value={row.description}
                                onChange={(ev) => updateRow(index, { description: ev.target.value })}
                                placeholder="Texto secundario bajo el título"
                                rows={2}
                                className={err(`detalle.${index}.description`) ? fieldErrorClass : fieldClass}
                            />
                            {err(`detalle.${index}.description`) ? (
                                <span className="text-red-500 text-[11px]">{err(`detalle.${index}.description`)}</span>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
