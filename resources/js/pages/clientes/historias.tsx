import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ClienteLayout from '@/layouts/cliente-layout';
import { Estampilla1Icon } from '@/components/icons/Estampilla1Icon';
import { Estampilla2Icon } from '@/components/icons/Estampilla2Icon';

export default function Historias() {
    const [activeCategory, setActiveCategory] = useState('Todas');

    const categories = [
        'Todas',
        'Aventura',
        'Misterio',
        'Romance Histórico',
        'Bélico',
    ];

    const gridStories = [
        {
            title: 'El Enigma del Galeón',
            desc: 'Una aventura de piratería y tesoros olvidados en las cristalinas aguas...',
            price: 'Desde $24,90',
            img: '/images/cards/cards-1.png',
        },
        {
            title: 'Cartas desde Versalles',
            desc: 'Intrigas palaciegas y secretos de estado en la fastuosa corte del Rey...',
            price: 'Desde $24,90',
            img: '/images/cards/cards-2.png',
        },
        {
            title: 'El Secreto de la Alhambra',
            desc: 'Un romance prohibido entre los muros geométricos del último...',
            price: 'Desde $24,90',
            img: '/images/cards/cards-3.png',
        },
        {
            title: 'Cartas desde Versalles',
            desc: 'Intrigas palaciegas y secretos de estado en la fastuosa corte del Rey...',
            price: 'Desde $24,90',
            img: '/images/cards/cards-4.png',
        },
        {
            title: 'El Enigma del Galeón',
            desc: 'Una aventura de piratería y tesoros olvidados en las cristalinas aguas...',
            price: 'Desde $24,90',
            img: '/images/cards/cards-5.png',
        },
        {
            title: 'El Enigma del Galeón',
            desc: 'Una aventura de piratería y tesoros olvidados en las cristalinas aguas...',
            price: 'Desde $24,90',
            img: '/images/cards/cards-6.png',
        },
    ];

    const destacadasStories = [
        {
            title: 'Secretos que Solo el Viento Conoce',
            desc: 'Cada una de estas historias es un fragmento de una vida en el mar. Son diarios de a bordo ocultos en sobres lacrados, mensajes que han...',
            price: 'Desde $24,90',
            img: '/images/sliders/slider-1.png',
        },
        {
            title: 'Secretos que Solo el Viento Conoce',
            desc: 'Cada una de estas historias es un fragmento de una vida en el mar. Son diarios de a bordo ocultos en sobres lacrados, mensajes que han...',
            price: 'Desde $24,90',
            img: '/images/sliders/slider-2.jpg',
        },
    ];

    return (
        <ClienteLayout>
            <Head>
                <title>Historias | Historias por Correo</title>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=playfair-display:400,600,700,700i|inter:400,500,600,700|cormorant-garamond:400,700,700i|roboto:400,500"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
            </Head>

            {/* 2. Hero Section */}
            <section className="relative isolate mt-20 flex w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-[50px] lg:h-[495px] lg:py-[70px]">
                {/* Ellipses decoration */}
                <div className="pointer-events-none absolute top-[332px] left-1/2 -z-10 h-[242px] w-[1976px] -translate-x-1/2 -rotate-[4deg] rounded-[100%] bg-[rgba(27,61,109,0.1)] blur-[25px]"></div>
                <div className="pointer-events-none absolute top-[413px] left-1/2 -z-10 h-[249px] w-[1679px] -translate-x-1/2 -rotate-[0.16deg] rounded-[100%] bg-white blur-[50px]"></div>

                {/* Stamps */}
                <Estampilla1Icon className="pointer-events-none absolute -top-[19px] -left-[80px] -z-[1] h-[126px] w-[147px] lg:top-[88px] lg:left-[calc(50%-749px)]" />
                <Estampilla2Icon className="pointer-events-none absolute top-[calc(50%-77px)] -right-[58px] -z-[1] h-[131px] w-[181px] lg:top-[156px] lg:right-auto lg:left-[calc(50%+562px)]" />

                <div className="z-10 flex w-full max-w-[1030px] flex-col items-center gap-[60px] lg:flex-row lg:gap-[76px]">
                    <div className="flex w-full flex-col items-start gap-[12px] lg:w-[654px]">
                        <h1 className="font-['Playfair_Display',serif] text-[44px] leading-[1.1] font-bold tracking-[-1.4px] text-[#1B3D6D] lg:text-[69px] lg:leading-[82px]">
                            Catálogo de
                            <br className="lg:hidden" /> Historias
                        </h1>
                        <p className="w-full font-['Cormorant_Garamond',serif] text-[18px] leading-[1.3] font-bold text-[#7B7B7B] italic lg:text-[24px]">
                            Sumérgete en el pasado a través de nuestras
                            correspondencias epistolares narradas en tiempo
                            real. Cada sobre es una puerta a otra época.
                        </p>
                    </div>

                    {/* Hero Images Right */}
                    <div className="relative -left-[10%] isolate mt-[5px] flex h-[250px] w-[190px] shrink-0 items-center justify-center sm:-left-[5%] sm:h-[300px] sm:w-[230px] lg:left-0 lg:mt-0 lg:h-[351px] lg:w-[300px]">
                        <div className="absolute -inset-[14%] z-0 bg-[url('/images/catalogo.png')] bg-cover bg-center shadow-md"></div>
                        <img
                            src="/images/catalogo2.png"
                            className="absolute top-[78%] -right-[40%] z-10 h-[120px] w-[95px] object-cover p-0 sm:-right-[20%] sm:h-[150px] sm:w-[110px] lg:-right-[25%] lg:h-[193px] lg:w-[148px]"
                            alt="Carta detalle"
                        />
                    </div>
                </div>
            </section>

            {/* 3. Filter Bar */}
            <section className="flex w-full items-center justify-between border-b border-[#F2F2F2] bg-white px-[20px] py-[16px] lg:px-[72px]">
                <div className="mx-auto flex w-full max-w-[1296px] flex-col items-center justify-between gap-4 lg:flex-row lg:gap-[98px]">
                    {/* Input Search */}
                    <div className="order-1 flex w-full shrink-0 items-center gap-[10px] rounded-[6px] border border-[#DFE4EA] bg-white px-5 py-3 lg:order-2 lg:max-w-[350px]">
                        <i className="fa-solid fa-search text-[#1B3D6D]"></i>
                        <input
                            type="text"
                            placeholder="Buscar historia..."
                            className="m-0 w-full flex-1 border-none bg-transparent p-0 font-['Inter',sans-serif] text-[16px] text-[#1B3D6D] placeholder-[#1B3D6D]/70 outline-none focus:ring-0"
                        />
                    </div>

                    {/* Categories/Filters */}
                    <div className="scrollbar-hide order-2 flex w-full flex-row items-center gap-4 overflow-x-auto py-2 lg:order-1 lg:w-auto">
                        <i className="fa-solid fa-filter flex h-6 w-6 shrink-0 items-center justify-center text-[#1B3D6D]"></i>
                        <div className="flex shrink-0 items-center gap-2 lg:gap-1">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`flex h-[32px] items-center justify-center rounded-[4px] px-[14px] py-[6px] transition lg:h-[22px] lg:rounded-[2px] lg:px-[10px] lg:py-[3px] ${
                                        activeCategory === cat
                                            ? 'bg-[#1B3D6D] text-white'
                                            : 'bg-[rgba(27,61,109,0.1)] text-[#1B3D6D] hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="font-['Inter',sans-serif] text-[14px] leading-[1.2] font-medium whitespace-nowrap lg:text-[13px] lg:leading-[16px] lg:font-normal">
                                        {cat}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Historias Grid List */}
            <section className="flex w-full flex-col items-center justify-center bg-white px-6 py-20 lg:px-[72px] lg:pt-[70px] lg:pb-[100px]">
                <div className="flex w-full max-w-[1296px] flex-col items-center gap-[44px]">
                    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {gridStories.map((story, i) => (
                            <div
                                key={i}
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
                                    <button className="flex h-[39px] w-[140px] items-center justify-center rounded-[2px] border border-white bg-[rgba(255,255,255,0.2)] px-5 py-[10px] text-white transition duration-300 hover:bg-white hover:text-[#1B3D6D]">
                                        <span className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold transition group-hover:text-[#111]">
                                            Ver historia
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-[30px] flex h-[46px] w-[284px] flex-row items-center justify-between rounded-[3px] border border-[#F3F4F6] bg-white p-1 shadow-sm">
                        <button className="flex h-full w-[10%] items-center justify-center text-[#637381] hover:text-[#1B3D6D]">
                            <i className="fa-solid fa-chevron-left text-sm"></i>
                        </button>
                        <div className="flex items-center gap-3 font-['Inter',sans-serif] text-[16px] font-normal text-[#637381]">
                            <span className="cursor-pointer hover:font-bold">
                                1
                            </span>
                            <span className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[3px] bg-[#1B3D6D] font-bold text-white">
                                2
                            </span>
                            <span className="cursor-pointer hover:font-bold">
                                3
                            </span>
                            <span className="cursor-pointer hover:font-bold">
                                4
                            </span>
                            <span className="cursor-pointer hover:font-bold">
                                5
                            </span>
                            <span>...</span>
                            <span className="cursor-pointer hover:font-bold">
                                12
                            </span>
                        </div>
                        <button className="flex h-full w-[10%] flex-col items-center justify-center rounded-r-[3px] bg-[#F3F4F6] text-[#637381] hover:text-[#1B3D6D]">
                            <i className="fa-solid fa-chevron-right text-sm"></i>
                        </button>
                    </div>
                </div>
            </section>

            {/* 5. Historias Destacadas */}
            <section className="flex w-full flex-col items-center justify-center bg-white px-6 pt-[50px] pb-20 lg:px-[72px] lg:pt-0 lg:pb-[70px]">
                <div className="flex w-full max-w-[1296px] flex-col items-center gap-[44px]">
                    <div className="flex w-full flex-col items-center gap-1 text-center lg:items-start lg:text-left">
                        <h2 className="font-['Playfair_Display',serif] text-[36px] leading-[1.1] font-semibold text-[#1B3D6D] lg:text-[39px] lg:leading-[52px]">
                            Historias
                            <br className="lg:hidden" /> destacadas
                        </h2>
                        <p className="font-['Inter',sans-serif] text-[14px] leading-[20px] font-normal text-[#7B7B7B] lg:text-[16px] lg:leading-[22px]">
                            Favoritas de nuestros usuarios
                        </p>
                    </div>

                    <div className="flex w-full flex-col items-start gap-8 lg:flex-row">
                        {destacadasStories.map((story, i) => (
                            <div
                                key={i}
                                className="group relative flex h-[460px] w-full flex-col overflow-hidden rounded-[4px] bg-black lg:w-1/2"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{
                                        backgroundImage: `url('${story.img}')`,
                                    }}
                                ></div>
                                <div className="absolute top-[18px] right-6 flex items-center justify-center rounded-[2px] bg-[#1B3D6D] px-[10px] py-[3px]">
                                    <span className="font-['Inter',sans-serif] text-[13px] leading-[16px] font-normal text-white">
                                        Suscripción disponible
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 flex w-full flex-col items-start justify-center gap-4 bg-[rgba(0,0,0,0.65)] px-6 py-4 lg:h-[216px]">
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
                                    <button className="flex h-[39px] w-[129px] items-center justify-center rounded-[2px] border border-white bg-[rgba(255,255,255,0.2)] px-5 py-[10px] text-white transition duration-300 hover:bg-white hover:text-[#1B3D6D]">
                                        <span className="font-['Inter',sans-serif] text-[16px] leading-[19px] font-semibold transition group-hover:text-[#111]">
                                            Ver historia
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Slider Controls */}
                    <div className="flex flex-row items-center gap-[24px] lg:gap-[48px]">
                        <button className="group flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#1B3D6D] text-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] hover:text-white lg:h-[60px] lg:w-[60px]">
                            <i className="fa-solid fa-chevron-left text-sm lg:text-xl"></i>
                        </button>
                        <button className="group flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#1B3D6D] text-[#1B3D6D] transition duration-300 hover:bg-[#1B3D6D] hover:text-white lg:h-[60px] lg:w-[60px]">
                            <i className="fa-solid fa-chevron-right text-sm lg:text-xl"></i>
                        </button>
                    </div>
                </div>
            </section>

            {/* 6. Cierre CTA */}
            <section className="flex w-full flex-col items-center justify-center bg-[#FFFCF4] px-6 py-[70px] lg:py-[100px]">
                <div className="relative isolate flex w-full max-w-[850px] flex-col items-center justify-center gap-[32px] overflow-hidden rounded-[2px] bg-[#1B3D6D] px-6 py-[44px] text-center shadow-[0px_0px_16px_rgba(0,0,0,0.04)] md:px-[56px]">
                    {/* Bg Decorative */}
                    <div className="absolute inset-0 bg-[rgba(255,255,255,0.03)] opacity-50"></div>

                    <div className="z-10 flex w-full flex-col items-center gap-[16px]">
                        <h2 className="font-['Playfair_Display',serif] text-[36px] leading-[1.2] font-bold text-[#D7C181] italic md:text-[49px] md:leading-[65px]">
                            ¿Buscas un regalo especial?
                        </h2>
                        <div className="h-[4px] w-[250px] rounded-[4px] bg-[#FDF6E3]"></div>
                        <p className="mx-auto mt-2 max-w-[688px] font-['Inter',sans-serif] text-[15px] leading-[22px] font-normal text-white md:text-[16px]">
                            Nuestras historias son el regalo perfecto para los
                            amantes de la lectura y las historias. Sorprende a
                            esa persona especial y regálale una historia
                        </p>
                    </div>

                    <button className="z-10 flex h-[47px] w-full max-w-[310px] items-center justify-center rounded-[2px] border border-white bg-transparent px-[10px] py-[14px] text-white transition duration-300 hover:bg-white hover:text-[#1B3D6D] md:px-[20px]">
                        <span className="font-['Inter',sans-serif] text-[14px] leading-[19px] font-semibold md:text-[16px]">
                            Encontrar una historia para regalar
                        </span>
                    </button>
                </div>
            </section>
        </ClienteLayout>
    );
}
