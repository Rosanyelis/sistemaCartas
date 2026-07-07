import type { PageProps } from '@inertiajs/core';
import { Head, Link } from '@inertiajs/react';
import { AudioPublicPlayer } from '@/components/tienda/AudioPublicPlayer';
import ClienteLayout from '@/layouts/cliente-layout';

export interface AudioPublicoDetalle {
    titulo: string;
    stream_url: string;
    historia: {
        nombre: string;
        slug: string;
        categoria: string;
        imagen: string;
        descripcion_corta: string;
        show_url: string | null;
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
                    href="https://fonts.bunny.net/css?family=playfair-display:400,600,700,700i|inter:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex w-full flex-col items-center bg-white">
                <div className="mt-[50px] w-full max-w-[1440px]">
                    <section className="flex flex-col gap-8 border-b-[0.5px] border-[#F2F2F2] px-4 py-8 lg:mt-[50px] lg:flex-row lg:items-start lg:gap-[72px] lg:px-[72px] lg:py-[70px]">
                        <div className="w-full shrink-0 lg:max-w-[624px]">
                            <div className="aspect-[4/3] w-full overflow-hidden rounded-[2px] bg-[#F3F4F6] lg:aspect-auto lg:min-h-[420px]">
                                <img
                                    src={audio.historia.imagen}
                                    alt={audio.historia.nombre}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex w-full flex-1 flex-col gap-6 lg:max-w-[624px]">
                            <nav className="flex flex-wrap items-center gap-2 font-['Inter',sans-serif] text-[13px] font-semibold text-[#1E3E6C]">
                                <Link href="/historias">Colecciones</Link>
                                <span className="text-[#A4A4A4]">/</span>
                                <span>
                                    {audio.historia.categoria || 'Historia'}
                                </span>
                            </nav>

                            <div className="flex flex-col gap-2">
                                {audio.historia.show_url ? (
                                    <Link
                                        href={audio.historia.show_url}
                                        className="font-['Inter',sans-serif] text-[14px] font-semibold text-[#1E3E6C] hover:underline"
                                    >
                                        {audio.historia.nombre}
                                    </Link>
                                ) : (
                                    <span className="font-['Inter',sans-serif] text-[14px] font-semibold text-[#1E3E6C]">
                                        {audio.historia.nombre}
                                    </span>
                                )}

                                <h1 className="font-['Playfair_Display',serif] text-[32px] leading-tight font-semibold text-[#1B3D6D] md:text-[39px]">
                                    {audio.titulo}
                                </h1>

                                {audio.historia.descripcion_corta && (
                                    <p className="font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-[#7B7B7B]">
                                        {audio.historia.descripcion_corta}
                                    </p>
                                )}
                            </div>

                            <AudioPublicPlayer
                                streamUrl={audio.stream_url}
                                title={audio.titulo}
                            />

                            {audio.historia.show_url && (
                                <Link
                                    href={audio.historia.show_url}
                                    className="inline-flex h-[47px] w-full items-center justify-center rounded-[2px] border border-[#1B3D6D] bg-white px-5 py-[14px] text-[#1B3D6D] transition hover:bg-[#F9FAFB] sm:w-auto sm:min-w-[240px]"
                                >
                                    <span className="font-['Inter',sans-serif] text-base font-semibold">
                                        Ver la historia completa
                                    </span>
                                </Link>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </ClienteLayout>
    );
}
