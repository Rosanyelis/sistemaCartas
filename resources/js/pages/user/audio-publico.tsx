import type { PageProps } from '@inertiajs/core';
import { Head } from '@inertiajs/react';
import ClienteLayout from '@/layouts/cliente-layout';

export interface AudioPublicoDetalle {
    titulo: string;
    stream_url: string;
    historia: {
        nombre: string;
        imagen: string;
        descripcion_corta: string;
    };
}

type AudioPublicoPageProps = PageProps & {
    audio: AudioPublicoDetalle;
};

export default function AudioPublico({ audio }: AudioPublicoPageProps) {
    return (
        <ClienteLayout>
            <Head title={`${audio.titulo} — ${audio.historia.nombre}`}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="mx-auto max-w-3xl px-4 py-10 font-['Inter'] md:px-6 md:py-14">
                <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                    <div className="aspect-[16/9] w-full overflow-hidden bg-[#F3F4F6]">
                        <img
                            src={audio.historia.imagen}
                            alt={audio.historia.nombre}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col gap-4 p-6 md:p-8">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-wide text-[#7B7B7B]">
                                {audio.historia.nombre}
                            </p>
                            <h1 className="mt-1 text-2xl font-bold text-[#1B3D6D] md:text-3xl">
                                {audio.titulo}
                            </h1>
                            {audio.historia.descripcion_corta && (
                                <p className="mt-3 text-[15px] leading-relaxed text-[#4B5563]">
                                    {audio.historia.descripcion_corta}
                                </p>
                            )}
                        </div>

                        <div className="select-none rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                            <audio
                                controls
                                controlsList="nodownload noplaybackrate"
                                playsInline
                                preload="metadata"
                                src={audio.stream_url}
                                className="w-full"
                            >
                                Tu navegador no soporta la reproducción de audio.
                            </audio>
                            <p className="mt-2 text-center text-xs text-[#9CA3AF]">
                                Reproducción en línea — no disponible para descarga
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ClienteLayout>
    );
}
