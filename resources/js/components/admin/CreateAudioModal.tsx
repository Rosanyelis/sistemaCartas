import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@inertiajs/react';
import { useEffect, useId, useState } from 'react';
import { AdminFormSidePanel } from '@/components/admin/AdminFormSidePanel';
import {
    AUDIO_ALLOWED_TYPES,
    MAX_AUDIO_BYTES,
    MENSAJE_AUDIO_TIPO,
    MENSAJE_MAX_AUDIO,
    validateMediaFileSize,
} from '@/components/admin/constants/media-limits';
import {
    SearchableHistoriaSelect,
    type HistoriaSelectOption,
} from '@/components/admin/SearchableHistoriaSelect';
import {
    store as audiosStore,
    update as audiosUpdate,
} from '@/actions/App/Http/Controllers/Admin/AudioController';

export interface AudioParaFormulario {
    id: number;
    slug: string;
    titulo: string;
    historia_id: number;
    estado: string;
    qr_path: string | null;
}

interface CreateAudioModalProps {
    isOpen: boolean;
    onClose: () => void;
    historias: HistoriaSelectOption[];
    audioToEdit?: AudioParaFormulario | null;
}

const inputClass = (hasError: boolean) =>
    `w-full rounded-[4px] border ${hasError ? 'border-red-500' : 'border-[#DFE4EA]'} bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all`;

export function CreateAudioModal({
    isOpen,
    onClose,
    historias,
    audioToEdit,
}: CreateAudioModalProps) {
    const rootId = useId();
    const estadoRadioName = `${rootId}-estado`;

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        historia_id: '',
        titulo: '',
        estado: 'activo',
        audio: null as File | null,
    });

    const [audioClientError, setAudioClientError] = useState<string | null>(null);
    const [audioFileName, setAudioFileName] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (audioToEdit) {
            setData({
                historia_id: String(audioToEdit.historia_id),
                titulo: audioToEdit.titulo,
                estado: audioToEdit.estado,
                audio: null,
            });
            setAudioFileName(null);
            setAudioClientError(null);
        } else {
            reset();
            setAudioFileName(null);
            setAudioClientError(null);
        }
    }, [audioToEdit, isOpen, setData, reset]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';

        if (!file) {
            return;
        }

        if (!AUDIO_ALLOWED_TYPES.includes(file.type as (typeof AUDIO_ALLOWED_TYPES)[number])) {
            setAudioClientError(MENSAJE_AUDIO_TIPO);
            return;
        }

        const sizeError = validateMediaFileSize(file, MAX_AUDIO_BYTES, MENSAJE_MAX_AUDIO);
        if (sizeError) {
            setAudioClientError(sizeError);
            return;
        }

        setAudioClientError(null);
        setData('audio', file);
        setAudioFileName(file.name);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!audioToEdit && !data.audio) {
            setAudioClientError('El archivo de audio es obligatorio.');
            return;
        }

        transform((formData) => {
            const base = {
                ...formData,
                historia_id: Number(formData.historia_id),
            };

            if (audioToEdit) {
                return { ...base, _method: 'patch' as const };
            }

            return base;
        });

        const options = {
            preserveScroll: true,
            forceFormData: true as const,
            onSuccess: () => {
                reset();
                onClose();
            },
        };

        if (audioToEdit) {
            post(audiosUpdate.url(audioToEdit.slug), options);

            return;
        }

        post(audiosStore.url(), options);
    };

    return (
        <AdminFormSidePanel
            open={isOpen}
            onClose={onClose}
            title={audioToEdit ? 'Editar audio' : 'Crear audio'}
        >
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-5 md:px-8">
                    <div className="flex flex-col gap-5">
                        <div>
                            <label className="mb-1.5 block text-[13px] font-medium text-[#1B3D6D]">
                                Historia *
                            </label>
                            <SearchableHistoriaSelect
                                historias={historias}
                                value={data.historia_id}
                                onChange={(historiaId) => setData('historia_id', historiaId)}
                                error={errors.historia_id}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[13px] font-medium text-[#1B3D6D]">
                                Título *
                            </label>
                            <input
                                type="text"
                                value={data.titulo}
                                onChange={(e) => setData('titulo', e.target.value)}
                                className={inputClass(!!errors.titulo)}
                                placeholder="Título corto del audio"
                            />
                            {errors.titulo && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.titulo}</p>
                            )}
                        </div>

                        <div>
                            <span className="mb-2 block text-[13px] font-medium text-[#1B3D6D]">
                                Estado *
                            </span>
                            <div className="flex gap-6">
                                {(['activo', 'pausado'] as const).map((value) => (
                                    <label
                                        key={value}
                                        className="flex cursor-pointer items-center gap-2 text-[14px] text-gray-700"
                                    >
                                        <input
                                            type="radio"
                                            name={estadoRadioName}
                                            checked={data.estado === value}
                                            onChange={() => setData('estado', value)}
                                            className="text-[#1B3D6D]"
                                        />
                                        {value === 'activo' ? 'Activo' : 'Pausado'}
                                    </label>
                                ))}
                            </div>
                            {errors.estado && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.estado}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[13px] font-medium text-[#1B3D6D]">
                                Archivo de audio {!audioToEdit && '*'}
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 rounded-[4px] border border-dashed border-[#DFE4EA] bg-[#F9FAFB] px-4 py-6 text-center transition-colors hover:border-[#1B3D6D]/40">
                                <FontAwesomeIcon icon={faPencil} className="text-[#1B3D6D]" />
                                <span className="text-[13px] text-[#4B5563]">
                                    {audioFileName ?? 'Seleccionar archivo (MP3, M4A, WAV, OGG)'}
                                </span>
                                <input
                                    type="file"
                                    accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,audio/ogg"
                                    className="hidden"
                                    onChange={handleAudioChange}
                                />
                            </label>
                            {(audioClientError || errors.audio) && (
                                <p className="mt-1 text-[12px] text-red-500">
                                    {audioClientError ?? errors.audio}
                                </p>
                            )}
                            {audioToEdit && (
                                <p className="mt-1 text-[12px] text-[#7B7B7B]">
                                    Deja vacío para conservar el audio actual.
                                </p>
                            )}
                        </div>

                        {audioToEdit?.qr_path && (
                            <div>
                                <span className="mb-2 block text-[13px] font-medium text-[#1B3D6D]">
                                    Código QR
                                </span>
                                <img
                                    src={audioToEdit.qr_path}
                                    alt="Código QR del audio"
                                    className="mx-auto h-40 w-40 rounded border border-[#E5E7EB] bg-white p-2"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="shrink-0 border-t border-[#F3F4F6] px-6 py-4 md:px-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-[4px] bg-[#1B3D6D] py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                        {processing ? 'Guardando…' : audioToEdit ? 'Guardar cambios' : 'Crear audio'}
                    </button>
                </div>
            </form>
        </AdminFormSidePanel>
    );
}
