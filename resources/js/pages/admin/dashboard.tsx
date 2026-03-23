import React, { useRef, useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faFileLines,
    faBoxOpen,
    faArrowUp,
    faArrowDown,
    faCheck,
    faTimes,
    faChevronDown,
    faDollarSign,
    faBars,
    faCalendarDays,
} from '@fortawesome/free-solid-svg-icons';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// Datos ficticios para el gráfico de líneas suavizado (similar a la imagen)
const salesData = [
    { name: '', historias: 140, productos: 220, cancelados: 30 },
    { name: '', historias: 150, productos: 200, cancelados: 150 },
    { name: '', historias: 80, productos: 190, cancelados: 160 },
    { name: 'Ene', historias: 160, productos: 195, cancelados: 180 },
    { name: '', historias: 170, productos: 220, cancelados: 200 },
    { name: '', historias: 220, productos: 230, cancelados: 210 },
    { name: '', historias: 200, productos: 240, cancelados: 220 },
    { name: '', historias: 120, productos: 250, cancelados: 220 },
    { name: '', historias: 90, productos: 250, cancelados: 230 },
    { name: 'Feb', historias: 200, productos: 255, cancelados: 220 },
    { name: '', historias: 100, productos: 255, cancelados: 210 },
    { name: '', historias: 90, productos: 250, cancelados: 170 },
    { name: '', historias: 120, productos: 220, cancelados: 140 },
    { name: '', historias: 100, productos: 255, cancelados: 120 },
    { name: '', historias: 50, productos: 150, cancelados: 90 },
    { name: 'Mar', historias: 50, productos: 200, cancelados: 85 },
    { name: '', historias: 50, productos: 200, cancelados: 95 },
    { name: '', historias: 50, productos: 190, cancelados: 90 },
    { name: '', historias: 100, productos: 140, cancelados: 90 },
    { name: '', historias: 150, productos: 180, cancelados: 140 },
    { name: '', historias: 220, productos: 240, cancelados: 200 },
    { name: 'Apr', historias: 260, productos: 250, cancelados: 240 },
    { name: '', historias: 265, productos: 260, cancelados: 250 },
    { name: '', historias: 260, productos: 270, cancelados: 260 },
    { name: '', historias: 270, productos: 290, cancelados: 285 },
    { name: '', historias: 270, productos: 300, cancelados: 290 },
    { name: '', historias: 240, productos: 300, cancelados: 290 },
];

const donughtData = [
    { name: 'Historia 1', value: 2 },
    { name: 'Historia 2', value: 4 },
    { name: 'Historia 3', value: 4 },
    { name: 'Historia 4', value: 5 },
    { name: 'Historia 5', value: 6 },
];

const DONUGHT_COLORS = ['#96674C', '#6B7144', '#1B3D6D', '#F3F4F6', '#BFDBFE'];

export default function Dashboard() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <UserLayout>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-5 px-3 py-3 font-['Inter'] md:gap-6 md:px-6 md:py-4 lg:px-8">
                {/* Cabecera: apilada en móvil como en el diseño de referencia */}
                <div className="flex flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-3">
                    <h1 className="text-[22px] leading-tight font-bold text-[#1B3D6D] lg:text-2xl">
                        ¡Hola, Admin bienvenido! 👋
                    </h1>
                    <span className="text-sm font-medium text-[#A0A0A0] lg:shrink-0">
                        Dale un vistazo a tu resumen
                    </span>
                </div>

                {/* Métricas: scroll horizontal en móvil; grid desde md */}
                <div
                    ref={scrollContainerRef}
                    onMouseDown={onMouseDown}
                    onMouseLeave={onMouseLeave}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                    className={`flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-3 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden ${
                        isDragging
                            ? 'cursor-grabbing select-none'
                            : 'cursor-grab select-none md:cursor-auto md:select-auto'
                    }`}
                >
                    {/* Tarjeta 1 */}
                    <div className="flex max-w-[300px] min-w-[260px] shrink-0 snap-start flex-col bg-white p-4 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:w-auto md:max-w-none md:min-w-0 md:shrink md:p-5">
                        <div className="mb-3 flex items-center gap-2 text-[#7B7B7B]">
                            <FontAwesomeIcon
                                icon={faUsers}
                                className="text-[#A0A0A0]"
                            />
                            <span className="text-sm font-semibold text-[#111827]">
                                Registrados
                            </span>
                        </div>
                        <div className="mb-0 text-xs font-medium text-[#A0A0A0]">
                            +25 este mes
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-[#111827]">
                                487
                            </span>
                            <span className="text-xs font-semibold text-[#10B981]">
                                0.43% <FontAwesomeIcon icon={faArrowUp} />
                            </span>
                        </div>
                    </div>

                    {/* Tarjeta 2 */}
                    <div className="flex max-w-[300px] min-w-[260px] shrink-0 snap-start flex-col bg-white p-4 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:w-auto md:max-w-none md:min-w-0 md:shrink md:p-5">
                        <div className="mb-3 flex items-center gap-2 text-[#7B7B7B]">
                            <FontAwesomeIcon
                                icon={faFileLines}
                                className="text-[#A0A0A0]"
                            />
                            <span className="text-sm font-semibold text-[#111827]">
                                Suscripciones
                            </span>
                        </div>
                        <div className="mb-0 text-xs font-medium text-[#A0A0A0]">
                            +25 este mes
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-bold text-[#111827]">
                                198
                            </span>
                            <div className="flex flex-col leading-tight">
                                <span className="text-[10px] font-semibold text-[#10B981]">
                                    Activos: 174{' '}
                                    <FontAwesomeIcon icon={faArrowUp} />
                                </span>
                                <span className="text-[10px] font-semibold text-[#EF4444]">
                                    Bajas: 24{' '}
                                    <FontAwesomeIcon icon={faArrowDown} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 3 */}
                    <div className="flex max-w-[300px] min-w-[260px] shrink-0 snap-start flex-col bg-white p-4 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:w-auto md:max-w-none md:min-w-0 md:shrink md:p-5">
                        <div className="mb-3 flex items-center gap-2 text-[#7B7B7B]">
                            <FontAwesomeIcon
                                icon={faBoxOpen}
                                className="text-[#A0A0A0]"
                            />
                            <span className="text-sm font-semibold text-[#111827]">
                                Órdenes de día
                            </span>
                        </div>
                        <div className="mb-0 text-xs font-medium text-[#A0A0A0]">
                            +25 este mes
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-bold text-[#111827]">
                                32
                            </span>
                            <div className="flex flex-col leading-tight">
                                <span className="text-[10px] font-semibold text-[#10B981]">
                                    Completadas: 25{' '}
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className="text-[10px] font-semibold text-[#EF4444]">
                                    Rechazadas 7{' '}
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 4 */}
                    <div className="flex max-w-[300px] min-w-[260px] shrink-0 snap-start flex-col bg-white p-4 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:w-auto md:max-w-none md:min-w-0 md:shrink md:p-5">
                        <div className="mb-3 flex items-center gap-2 text-[#7B7B7B]">
                            <FontAwesomeIcon
                                icon={faFileLines}
                                className="text-[#A0A0A0]"
                            />
                            <span className="text-sm font-semibold text-[#111827]">
                                Historias activas
                            </span>
                        </div>
                        <div className="mt-auto flex items-end">
                            <span className="text-4xl font-bold text-[#111827]">
                                4
                            </span>
                        </div>
                    </div>

                    {/* Tarjeta 5 */}
                    <div className="flex max-w-[300px] min-w-[260px] shrink-0 snap-start flex-col bg-white p-4 pr-5 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:w-auto md:max-w-none md:min-w-0 md:shrink md:p-5 md:pr-5">
                        <div className="mb-3 flex items-center gap-2 text-[#7B7B7B]">
                            <FontAwesomeIcon
                                icon={faBoxOpen}
                                className="text-[#A0A0A0]"
                            />
                            <span className="text-sm font-semibold text-[#111827]">
                                Productos activos
                            </span>
                        </div>
                        <div className="mt-auto flex items-end">
                            <span className="text-4xl font-bold text-[#111827]">
                                5
                            </span>
                        </div>
                    </div>
                    {/* Espacio final para que el scroll horizontal no recorte la última tarjeta en móvil */}
                    <div className="w-2 shrink-0 md:hidden" aria-hidden />
                </div>

                {/* Contenido principal: apilado en móvil; gráfico + columna en xl */}
                <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:gap-6">
                    {/* Gráfico Rendimientos de Ventas */}
                    <div className="min-w-0 flex-1 bg-white p-4 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:p-6">
                        <div className="mb-4 flex flex-col items-stretch gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#EDF2F7] text-[#1B3D6D]">
                                    <FontAwesomeIcon
                                        icon={faBars}
                                        className="text-sm"
                                    />
                                </div>
                                <h2 className="text-[17px] font-bold text-[#7B7B7B] md:text-xl">
                                    Rendimientos de ventas
                                </h2>
                            </div>
                            <div className="flex w-full min-w-0 gap-2 md:w-auto md:shrink-0">
                                <button
                                    type="button"
                                    className="flex h-9 min-w-0 flex-[0_0_32%] items-center justify-between gap-1 rounded-md border border-[#E5E7EB] px-2 py-1.5 text-xs font-medium text-[#4B5563] shadow-sm sm:flex-initial md:w-32 md:px-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon
                                            icon={faCalendarDays}
                                            className="text-[#9CA3AF] opacity-60"
                                        />
                                        <span>Semana</span>
                                    </div>
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className="text-[#9CA3AF]"
                                    />
                                </button>
                                <button
                                    type="button"
                                    className="flex h-9 min-w-0 flex-1 items-center justify-between gap-1 rounded-md border border-[#E5E7EB] px-2 py-1.5 text-xs font-medium text-[#1B3D6D] shadow-sm md:w-auto md:gap-3 md:px-3"
                                >
                                    <span className="min-w-0 truncate sm:whitespace-nowrap">
                                        01/04/25 - 17/04/25
                                    </span>
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className="text-[#9CA3AF]"
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 md:flex-row">
                            {/* Panel Izquierdo Fltros */}
                            <div className="hidden w-32 flex-col gap-4 text-xs font-semibold md:flex">
                                <div className="cursor-pointer text-[#1B3D6D]">
                                    Todos
                                </div>
                                <div className="cursor-pointer text-[#A0A0A0] hover:text-[#7B7B7B]">
                                    Historias
                                </div>
                                <div className="cursor-pointer text-[#A0A0A0] hover:text-[#7B7B7B]">
                                    Productos
                                </div>
                                <div className="cursor-pointer text-[#A0A0A0] hover:text-[#7B7B7B]">
                                    Cancelados
                                </div>
                            </div>

                            {/* Área del Gráfico */}
                            <div className="flex-1">
                                <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-[#1B3D6D] md:flex-nowrap">
                                    <div className="hidden items-center gap-2 md:flex">
                                        <div className="size-3 rounded-sm bg-[#3B82F6] opacity-0" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="size-2 rounded-sm bg-[#6B7144]"></div>{' '}
                                        <span className="text-[#6B7144]">
                                            Historias
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="size-2 rounded-sm bg-[#1B3D6D]"></div>{' '}
                                        <span className="text-[#1B3D6D]">
                                            Productos
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="size-2 rounded-sm bg-[#93C5FD]"></div>{' '}
                                        <span className="text-[#93C5FD]">
                                            Cancelados
                                        </span>
                                    </div>
                                </div>
                                <div className="h-[240px] w-full min-w-0 sm:h-[280px] md:h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart
                                            data={salesData}
                                            margin={{
                                                top: 5,
                                                right: 4,
                                                left: -12,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="0"
                                                vertical={false}
                                                stroke="#E5E7EB"
                                            />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fontSize: 11,
                                                    fill: '#7B7B7B',
                                                }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fontSize: 11,
                                                    fill: '#7B7B7B',
                                                }}
                                                domain={[0, 600]}
                                                ticks={[
                                                    0, 100, 200, 300, 400, 500,
                                                    600,
                                                ]}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    backgroundColor: '#1B3D6D',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                }}
                                                itemStyle={{ color: '#fff' }}
                                                cursor={{
                                                    stroke: '#1B3D6D',
                                                    strokeWidth: 1,
                                                    strokeDasharray: '3 3',
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="historias"
                                                stroke="#6B7144"
                                                strokeWidth={2.5}
                                                dot={false}
                                                strokeDasharray="4 4"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="productos"
                                                stroke="#1B3D6D"
                                                strokeWidth={2.5}
                                                dot={false}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="cancelados"
                                                stroke="#93C5FD"
                                                strokeWidth={2.5}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 text-xs text-[#A0A0A0]">
                                    Promedio de los últimos 30 Días
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha de Tarjetas */}
                    <div className="flex w-full min-w-0 flex-col gap-5 xl:w-[320px] xl:shrink-0">
                        {/* Ventas totales */}
                        <div className="bg-white p-4 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:p-6">
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-[#7B7B7B]">
                                    Ventas totales
                                </h3>
                                <div className="flex size-7 items-center justify-center rounded-md bg-[#F3F4F6] text-[#1B3D6D]">
                                    <FontAwesomeIcon
                                        icon={faDollarSign}
                                        className="text-xs"
                                    />
                                </div>
                            </div>
                            <div className="mb-6 text-3xl font-bold text-[#111827]">
                                $3,500.00MX
                            </div>

                            <div className="flex flex-col gap-3 text-xs font-semibold">
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 bg-[#96674C]"></div>
                                        <span className="text-[#96674C]">
                                            Historias
                                        </span>
                                    </div>
                                    <span className="text-[#96674C]">
                                        $ 1,750.00 MX
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 bg-[#1B3D6D]"></div>
                                        <span className="text-[#1B3D6D]">
                                            Productos
                                        </span>
                                    </div>
                                    <span className="text-[#1B3D6D]">
                                        $ 1,750.00 MX
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Historias activas */}
                        <div className="flex-1 bg-white p-4 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:p-6">
                            <div className="mb-6 flex items-center justify-between gap-2">
                                <h3 className="text-sm font-bold text-[#7B7B7B]">
                                    Historias activas
                                </h3>
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-[#E5E7EB] text-[#A0A0A0]">
                                    <FontAwesomeIcon
                                        icon={faFileLines}
                                        className="text-xs"
                                    />
                                </div>
                            </div>

                            <div className="relative mx-auto mb-6 h-40 w-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donughtData}
                                            innerRadius={55}
                                            outerRadius={75}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {donughtData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        DONUGHT_COLORS[
                                                            index %
                                                                DONUGHT_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-[#1B3D6D]">
                                        500
                                    </span>
                                    <span className="text-center text-[8px] leading-tight font-medium text-[#A0A0A0]">
                                        Total suscripciones
                                        <br />
                                        activas
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2.5 text-xs font-medium text-[#7B7B7B]">
                                <div className="flex justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div className="size-2.5 shrink-0 bg-[#96674C]"></div>
                                        <span className="truncate">
                                            Historia 1 texto de ejemplo
                                        </span>
                                    </div>
                                    <span className="shrink-0 font-bold text-[#1B3D6D]">
                                        2
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div className="size-2.5 shrink-0 bg-[#6B7144]"></div>
                                        <span className="truncate">
                                            Historia 2 texto de ejemplo
                                        </span>
                                    </div>
                                    <span className="shrink-0 font-bold text-[#1B3D6D]">
                                        4
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div className="size-2.5 shrink-0 bg-[#1B3D6D]"></div>
                                        <span className="truncate">
                                            Historia texto de ejemplo
                                        </span>
                                    </div>
                                    <span className="shrink-0 font-bold text-[#1B3D6D]">
                                        4
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div className="size-2.5 shrink-0 border border-[#D1D5DB] bg-transparent"></div>
                                        <span className="truncate">
                                            Historia 4 texto de ejemplo
                                        </span>
                                    </div>
                                    <span className="shrink-0 font-bold text-[#1B3D6D]">
                                        5
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div className="size-2.5 shrink-0 border border-[#93C5FD] bg-transparent"></div>
                                        <span className="truncate">
                                            Historia 5 texto de ejemplo
                                        </span>
                                    </div>
                                    <span className="shrink-0 font-bold text-[#1B3D6D]">
                                        6
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
