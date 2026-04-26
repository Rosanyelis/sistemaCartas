import { Link } from '@inertiajs/react';
import { show } from '@/routes/historias';
import type { LaravelPaginator } from '@/types/historias-tienda';
import type { Story } from '@/types/welcome';

function stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
}

interface GridStoriesSectionProps {
    stories: Story[];
    pagination: LaravelPaginator<Story> | null;
}

export default function GridStoriesSection({
    stories,
    pagination,
}: GridStoriesSectionProps) {
    const showPager =
        pagination !== null && pagination.last_page > 1;

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

                {showPager && pagination ? (
                    <nav
                        className="mt-[30px] flex w-full max-w-[640px] items-center justify-between gap-4 sm:gap-8"
                        aria-label="Paginación de historias"
                    >
                        {pagination.prev_page_url ? (
                            <Link
                                href={pagination.prev_page_url}
                                preserveScroll
                                preserveState
                                only={[
                                    'historias',
                                    'destacadas',
                                    'categorias',
                                    'filters',
                                ]}
                                className="flex shrink-0 items-center justify-center p-2 text-[#637381] transition-colors hover:text-[#1B3D6D]"
                                aria-label="Página anterior"
                            >
                                <i className="fa-solid fa-chevron-left text-sm"></i>
                            </Link>
                        ) : (
                            <span
                                className="flex shrink-0 cursor-not-allowed items-center justify-center p-2 text-[#C4C4C4]"
                                aria-hidden="true"
                            >
                                <i className="fa-solid fa-chevron-left text-sm"></i>
                            </span>
                        )}
                        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto scrollbar-hide font-['Inter',sans-serif] text-[15px] font-normal sm:gap-3 sm:text-[16px]">
                            {pagination.links
                                .filter((l) => {
                                    const lab = l.label
                                        .replace(/&laquo;|&raquo;/g, '')
                                        .trim();

                                    return lab !== 'Previous' && lab !== 'Next';
                                })
                                .map((link, idx) => {
                                    const labelText = stripHtmlTags(link.label);

                                    return link.url ? (
                                        <Link
                                            key={`${link.label}-${idx}`}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            only={[
                                                'historias',
                                                'destacadas',
                                                'categorias',
                                                'filters',
                                            ]}
                                            className={`flex h-10 min-w-[2.25rem] shrink-0 items-center justify-center rounded-lg px-2 transition-colors ${
                                                link.active
                                                    ? 'bg-[#1B3D6D] font-semibold text-white'
                                                    : 'text-[#637381] hover:text-[#1B3D6D]'
                                            }`}
                                        >
                                            {labelText}
                                        </Link>
                                    ) : (
                                        <span
                                            key={`${link.label}-${idx}`}
                                            className="shrink-0 px-1.5 text-[#637381] select-none"
                                        >
                                            {labelText}
                                        </span>
                                    );
                                })}
                        </div>
                        {pagination.next_page_url ? (
                            <Link
                                href={pagination.next_page_url}
                                preserveScroll
                                preserveState
                                only={[
                                    'historias',
                                    'destacadas',
                                    'categorias',
                                    'filters',
                                ]}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#1B3D6D] transition-colors hover:bg-[#E8EAED]"
                                aria-label="Página siguiente"
                            >
                                <i className="fa-solid fa-chevron-right text-sm"></i>
                            </Link>
                        ) : (
                            <span className="flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-lg bg-[#F3F4F6] text-[#C4C4C4]">
                                <i className="fa-solid fa-chevron-right text-sm"></i>
                            </span>
                        )}
                    </nav>
                ) : null}
            </div>
        </section>
    );
}
