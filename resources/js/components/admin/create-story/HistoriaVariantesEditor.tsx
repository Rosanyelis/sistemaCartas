import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { HistoriaVarianteForm } from './types';

interface HistoriaVariantesEditorProps {
    variantes: HistoriaVarianteForm[];
    onAdd: () => void;
    onUpdate: (index: number, field: keyof HistoriaVarianteForm, value: string | number) => void;
    onRemove: (index: number) => void;
}

/** Tabla editable de variantes (SKU / precio / stock) desacoplada del modal principal. */
export function HistoriaVariantesEditor({ variantes, onAdd, onUpdate, onRemove }: HistoriaVariantesEditorProps) {
    return (
        <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-[#1B3D6D]">Variantes de la historia</h3>
                <button
                    type="button"
                    onClick={onAdd}
                    className="py-1.5 px-3 rounded-[4px] bg-[#1B3D6D]/10 text-[12px] font-bold text-[#1B3D6D] hover:bg-[#1B3D6D]/20 transition-colors flex items-center gap-1.5"
                >
                    <FontAwesomeIcon icon={faPlus} /> Añadir Variante
                </button>
            </div>

            {variantes.length > 0 ? (
                <div className="overflow-x-auto rounded-md border border-[#DFE4EA]">
                    <table className="w-full text-left border-collapse bg-[#F9FAFB]">
                        <thead>
                            <tr className="border-b border-[#DFE4EA] bg-white">
                                <th className="px-3 py-2 text-[11px] font-bold text-[#7B7B7B] uppercase">Nombre</th>
                                <th className="px-3 py-2 text-[11px] font-bold text-[#7B7B7B] uppercase">Código</th>
                                <th className="px-3 py-2 text-[11px] font-bold text-[#7B7B7B] uppercase">Precio</th>
                                <th className="px-3 py-2 text-[11px] font-bold text-[#7B7B7B] uppercase">Stock</th>
                                <th className="px-3 py-2 text-[11px] font-bold text-[#7B7B7B] uppercase text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DFE4EA]">
                            {variantes.map((v, idx) => (
                                <tr key={`variante-${idx}-${v.codigo_variante}`} className="hover:bg-white transition-colors">
                                    <td className="px-2 py-2">
                                        <input
                                            type="text"
                                            value={v.nombre}
                                            onChange={(e) => onUpdate(idx, 'nombre', e.target.value)}
                                            placeholder="Ej: Tapa Dura"
                                            className="w-full bg-transparent border-none p-1 text-[13px] text-gray-800 focus:ring-0 outline-none"
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <input
                                            type="text"
                                            value={v.codigo_variante}
                                            onChange={(e) => onUpdate(idx, 'codigo_variante', e.target.value)}
                                            className="w-full bg-transparent border-none p-1 text-[13px] text-gray-500 focus:ring-0 outline-none"
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <input
                                            type="text"
                                            value={v.precio}
                                            onChange={(e) => onUpdate(idx, 'precio', e.target.value)}
                                            placeholder="29.99"
                                            className="w-full bg-transparent border-none p-1 text-[13px] text-gray-800 focus:ring-0 outline-none"
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <input
                                            type="number"
                                            value={v.stock}
                                            onChange={(e) => onUpdate(idx, 'stock', parseInt(e.target.value, 10) || 0)}
                                            className="w-full bg-transparent border-none p-1 text-[13px] text-gray-800 focus:ring-0 outline-none"
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => onRemove(idx)}
                                            className="text-red-400 hover:text-red-600 p-1"
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
                <div className="py-4 text-center border border-dashed border-[#DFE4EA] rounded-md bg-[#F9FAFB]">
                    <p className="text-[12px] text-[#A0A0A0]">
                        No hay variantes añadidas. Haz clic en &quot;Añadir Variante&quot;.
                    </p>
                </div>
            )}
        </div>
    );
}
