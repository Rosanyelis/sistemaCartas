interface FilterBarSectionProps {
    categories: string[];
    activeCategory: string;
    setActiveCategory: (category: string) => void;
}

export default function FilterBarSection({
    categories,
    activeCategory,
    setActiveCategory,
}: FilterBarSectionProps) {
    return (
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
    );
}
