import { Link } from '@inertiajs/react';
import CatalogGridPagination from '@/components/tienda/CatalogGridPagination';
import { show } from '@/routes/historias';
import type { LaravelPaginator } from '@/types/historias-tienda';
import type { Story } from '@/types/welcome';

const HISTORIAS_INERTIA_ONLY = [
    'historias',
    'destacadas',
    'categorias',
    'filters',
] as const;

interface GridStoriesSectionProps {
    stories: Story[];
    pagination: LaravelPaginator<Story> | null;
}

export default function GridStoriesSection({
    stories,
    pagination,
}: GridStoriesSectionProps) {
    return (
        <section className="flex w-full flex-col items-center justify-center bg-white px-6 py-20 lg:px-[72px] lg:pt-[70px] lg:pb-[100px]">
            <div className="flex w-full max-w-[1296px] flex-col items-center gap-[44px]">
                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {stories.map((story) => (
                        <div
                            key={story.slug}
                            className="group relative flex h-[460px] w-full flex-col overflow-hidden rounded-[4px] bg-black"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{
                                    backgroundImage: `url('${story.img}')`,
                                }}
                            ></div>
                            <div className="absolute top-[18px] right-6 flex items-center justify-center rounded-[2px] bg-[#1B3D6D] px-[10px] py-[3px] shadow">
                                <span className="font-['Inter',sans-serif] text-[13px] leading-[16px] font-normal text-white">
                                    Suscripción disponible
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 flex w-full flex-col items-start gap-4 bg-[rgba(0,0,0,0.65)] px-6 py-4">
                                <div className="flex w-full flex-col items-start gap-2">
                                    <h3 className="font-['Playfair_Display',serif] text-[25px] leading-[33px] font-semibold text-white">
                                        {story.title}
                                    </h3>
                                    <p className="line-clamp-2 font-['Inter',sans-serif] text-[16px] leading-[22px] font-normal text-white">
                                        {story.desc}
                                    </p>
                                    <h4 className="mt-1 font-['Playfair_Display',serif] text-[22px] leading-[29px] font-bold text-white">
                                        {story.price}{' '}
                                        <span className="text-sm font-normal">
                                            por entrega
                                        </span>
                                    </h4>
                                </div>
                                <Link
                                    href={show({ slug: story.slug }).url}
                                    className="flex h-[39px] w-[140px] items-center justify-center rounded-[2px] border border-white bg-[rgba(255,255,255,0.2)] px-5 py-[10px] text-white transition duration-300 hover:bg-white hover:text-[#1B3D6D]"
                                >
                                    <span className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold transition group-hover:text-[#111]">
                                        Ver historia
                                    </span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {pagination ? (
                    <CatalogGridPagination
                        pagination={pagination}
                        inertiaOnly={[...HISTORIAS_INERTIA_ONLY]}
                        ariaLabel="Paginación de historias"
                    />
                ) : null}
            </div>
        </section>
    );
}
