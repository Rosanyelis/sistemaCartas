import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { HistoriaVarianteForm, HistoriaVarianteTipoForm } from './types';

interface HistoriaVariantesEditorProps {
    variantes: HistoriaVarianteForm[];
    onAdd: () => void;
    onUpdate: (index: number, field: keyof HistoriaVarianteForm, value: string | number | boolean) => void;
    onRemove: (index: number) => void;
}

/** Variantes asociadas a la historia: tipo `papel` o `color` y valor en texto libre. */
export function HistoriaVariantesEditor({ variantes, onAdd, onUpdate, onRemove }: HistoriaVariantesEditorProps) {
    return (
        <div className="mt-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-[#1B3D6D]">Variantes</h3>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-1.5 rounded-[4px] bg-[#1B3D6D]/10 px-3 py-1.5 text-[12px] font-bold text-[#1B3D6D] transition-colors hover:bg-[#1B3D6D]/20"
                >
                    <FontAwesomeIcon icon={faPlus} /> Añadir variante
                </button>
            </div>

            {variantes.length > 0 ? (
                <div className="overflow-x-auto rounded-md border border-[#DFE4EA]">
                    <table className="w-full border-collapse bg-[#F9FAFB] text-left">
                        <thead>
                            <tr className="border-b border-[#DFE4EA] bg-white">
                                <th className="min-w-[120px] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#7B7B7B]">
                                    Tipo
                                </th>
                                <th className="min-w-[220px] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#7B7B7B]">
                                    Valor
                                </th>
                                <th className="px-3 py-2 text-center text-[11px] font-bold uppercase tracking-wide text-[#7B7B7B]" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DFE4EA]">
                            {variantes.map((v, idx) => (
                                <tr
                                    key={`variante-${idx}`}
                                    className="hover:bg-white transition-colors"
                                >
                                    <td className="px-3 py-2 align-middle">
                                        <select
                                            value={v.tipo}
                                            onChange={(e) =>
                                                onUpdate(idx, 'tipo', e.target.value as HistoriaVarianteTipoForm)
                                            }
                                            className="w-full rounded border border-transparent bg-white px-2 py-1.5 text-[13px] text-gray-800 outline-none focus:border-[#1B3D6D]/40"
                                        >
                                            <option value="papel">Papel</option>
                                            <option value="color">Color</option>
                                        </select>
                                    </td>
                                    <td className="px-3 py-2 align-middle">
                                        <input type="text"
                                            value={v.valor}
                                            onChange={(e) => onUpdate(idx, 'valor', e.target.value)}
                                                placeholder="Ej. Couché 300 g, mate… o Azul marino, #1B3D6D o nombre del tono…"
                                            className="w-full rounded border border-transparent bg-white px-2 py-1.5 text-[13px] text-gray-800 outline-none focus:border-[#1B3D6D]/40"
                                        />
                                    </td>
                                    <td className="px-3 py-2 text-center align-middle">
                                        <button
                                            type="button"
                                            onClick={() => onRemove(idx)}
                                            className="p-1 text-red-400 hover:text-red-600"
                                            title="Quitar variante"
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="rounded-md border border-dashed border-[#DFE4EA] bg-[#F9FAFB] py-4 text-center">
                    <p className="text-[12px] text-[#A0A0A0]">
                        No hay variantes. Añade filas para describir papel o color (texto libre en cada caso).
                    </p>
                </div>
            )}
        </div>
    );
}
