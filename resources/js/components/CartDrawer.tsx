import {
    faTimes,
    faTrashAlt,
    faPlus,
    faMinus,
    faExclamationCircle,
    faInfo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ShieldCheck, Truck, History } from 'lucide-react';
import React from 'react';

interface CartItem {
    id: number;
    title: string;
    subtitle: string;
    price: number;
    image: string;
    quantity?: number;
    type: 'unico' | 'recurrente';
    badge: string;
}

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    // Mock items based on the reference image
    const [items, setItems] = React.useState<CartItem[]>([
        {
            id: 1,
            title: 'Pluma Estilográfica Imperial',
            subtitle: 'Edición Limitada',
            price: 24.9,
            image: '/images/products/product-1.png',
            quantity: 1,
            type: 'unico',
            badge: 'Pago Único',
        },
        {
            id: 2,
            title: 'El Secreto del Galeón',
            subtitle: 'Suscripción Mensual',
            price: 24.9,
            image: '/images/story_cover.png',
            type: 'recurrente',
            badge: 'Recurrente',
        },
    ]);

    const updateQuantity = (id: number, delta: number) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = (item.quantity || 1) + delta;
                    return { ...item, quantity: Math.max(1, newQty) };
                }
                return item;
            }),
        );
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = items.reduce(
        (acc, item) => acc + item.price * (item.quantity || 1),
        0,
    );
    const iva = subtotal * 0.21;
    const total = subtotal;

    return (
        <div
            className={`fixed inset-0 z-[100] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
            {/* Overlay */}
            <div
                className={`fixed inset-0 top-[80px] bg-black/20 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <aside
                className={`fixed top-[80px] right-[0] z-[60] flex h-[calc(100vh-80px)] w-full max-w-[480px] flex-col bg-[#F2F2F2] shadow-[-20px_0px_60px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Scrollable Content */}
                <div className="custom-scrollbar flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="flex flex-col gap-2">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-[#DCDCDC] pb-3">
                            <h2 className="font-['Inter',sans-serif] text-[20px] font-bold text-[#1B3D6D] lg:text-[22px]">
                                Carrito de compras
                            </h2>
                            <button
                                onClick={onClose}
                                className="flex h-5 w-5 items-center justify-center text-[#333333] transition hover:opacity-50"
                            >
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className="text-sm"
                                />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex flex-col gap-2">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative flex gap-3 rounded-[2px] bg-white p-2.5 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]"
                                >
                                    {/* Delete icon top-right */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="absolute top-2 right-2 text-[#7B7B7B] transition hover:text-red-500"
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            className="text-[12px]"
                                        />
                                    </button>

                                    {/* Image */}
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-[48px] w-[48px] flex-shrink-0 rounded-[1px] object-cover"
                                    />

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col justify-between pr-4">
                                        <div className="flex flex-col">
                                            <h3 className="font-['Inter',sans-serif] text-[14px] font-bold text-[#1B3D6D] lg:text-[15px]">
                                                {item.title}
                                            </h3>
                                            <span className="font-['Inter',sans-serif] text-[12px] text-[#7B7B7B]">
                                                {item.subtitle}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="font-['Inter',sans-serif] text-[14px] font-semibold text-[#1B3D6D]">
                                                    $
                                                    {item.price
                                                        .toFixed(2)
                                                        .replace('.', ',')}
                                                </span>

                                                {item.type !== 'recurrente' &&
                                                    item.quantity !==
                                                        undefined && (
                                                        <div className="flex h-[20px] items-center rounded-[1px] bg-[#F5F5FF] px-1 shadow-[inset_0px_1px_2px_rgba(0,0,0,0.03)]">
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        -1,
                                                                    )
                                                                }
                                                                className="flex px-1.5 text-[#1B3D6D] transition hover:opacity-50"
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faMinus
                                                                    }
                                                                    className="text-[7px]"
                                                                />
                                                            </button>
                                                            <span className="min-w-[14px] text-center font-['Roboto',sans-serif] text-[12px] font-medium text-[#1B3D6D]">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        1,
                                                                    )
                                                                }
                                                                className="flex px-1.5 text-[#1B3D6D] transition hover:opacity-50"
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faPlus
                                                                    }
                                                                    className="text-[7px]"
                                                                />
                                                            </button>
                                                        </div>
                                                    )}

                                                {item.type !== 'recurrente' && (
                                                    <span className="font-['Inter',sans-serif] text-[14px] font-bold text-[#1B3D6D]">
                                                        $
                                                        {(
                                                            item.price *
                                                            (item.quantity || 1)
                                                        )
                                                            .toFixed(2)
                                                            .replace('.', ',')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Badge bottom-right */}
                                    <div className="absolute right-2 bottom-2 rounded-[1px] bg-[rgba(27,61,109,0.08)] px-[6px] py-[2px]">
                                        <span className="font-['Inter',sans-serif] text-[10px] font-medium text-[#1B3D6D]">
                                            {item.badge}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Divider Line */}
                        <div className="my-1 border-b border-[#DCDCDC]" />

                        {/* Summary Details */}
                        <div className="flex flex-col gap-3 py-1">
                            <div className="flex items-center justify-between">
                                <span className="font-['Inter',sans-serif] text-[15px] font-bold text-[#475569]">
                                    Subtotal
                                </span>
                                <span className="font-['Inter',sans-serif] text-[15px] font-medium text-[#475569]">
                                    ${subtotal.toFixed(2).replace('.', ',')}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-['Inter',sans-serif] text-[15px] font-bold text-[#1B3D6D]">
                                            Envío
                                        </span>
                                        <button className="flex h-4 w-4 items-center justify-center rounded-full border border-[#1B3D6D] text-[10px] text-[#1B3D6D] transition hover:bg-[#1B3D6D] hover:text-white">
                                            <FontAwesomeIcon icon={faInfo} className="text-[8px]" />
                                        </button>
                                    </div>
                                    <span className="font-['Inter',sans-serif] text-[15px] font-bold text-[#1B3D6D]">
                                        Gratis
                                    </span>
                                </div>
                                <p className="mt-1 text-right font-['Inter',sans-serif] text-[11px] font-light text-[#1B3D6D] italic opacity-60">
                                    Envío gratuito incluido por tu suscripción
                                    activa.
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="font-['Inter',sans-serif] text-[15px] font-bold text-[#475569]">
                                    IVA (21%)
                                </span>
                                <span className="font-['Inter',sans-serif] text-[15px] font-medium text-[#475569]">
                                    ${iva.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        </div>

                        {/* Divider Line */}
                        <div className="my-1 border-b border-[#DCDCDC]" />

                        {/* Total Section */}
                        <div className="flex items-end justify-between py-2">
                            <span className="font-['Inter',sans-serif] text-[20px] font-bold text-[#1B3D6D]">
                                Total
                            </span>
                            <div className="flex flex-col items-end">
                                <div className="flex items-baseline">
                                    <span className="mr-0.5 font-['Playfair_Display',serif] text-[28px] font-light text-[#1B3D6D] lg:text-[32px]">
                                        $
                                    </span>
                                    <span className="font-['Playfair_Display',serif] text-[38px] leading-none font-bold text-[#1B3D6D] lg:text-[42px]">
                                        {
                                            total
                                                .toFixed(2)
                                                .replace('.', ',')
                                                .split(',')[0]
                                        }
                                    </span>
                                    <span className="font-['Playfair_Display',serif] text-[24px] leading-none font-bold text-[#1B3D6D]">
                                        ,{total.toFixed(2).split('.')[1]}
                                    </span>
                                </div>
                                <span className="text-[10px] font-medium text-[#1B3D6D] opacity-60">
                                    IVA Incluido
                                </span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button className="mt-2 w-full rounded-[2px] bg-[#1B3D6D] py-[14px] text-white shadow-lg transition hover:bg-[#163158]">
                            <span className="font-['Inter',sans-serif] text-[15px] font-bold tracking-wide">
                                Proceder al pago
                            </span>
                        </button>

                        {/* Small Trust Badges */}
                        <div className="mt-4 flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-[#1B3D6D] opacity-80">
                                <ShieldCheck size={20} strokeWidth={1.5} />
                                <span className="font-['Inter',sans-serif] text-[12px] font-medium">
                                    Pago Seguro: Encriptación SSL 256 bits
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-[#1B3D6D] opacity-80">
                                <Truck size={20} strokeWidth={1.5} />
                                <span className="font-['Inter',sans-serif] text-[12px] font-medium">
                                    Envío Protegido: Embalaje sostenible y
                                    seguro
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-[#1B3D6D] opacity-80">
                                <History size={20} strokeWidth={1.5} />
                                <span className="font-['Inter',sans-serif] text-[12px] font-medium">
                                    Devolución garantizada en 14 días
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #F2F2F2;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #DCDCDC;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #C0C0C0;
                    }
                `,
                    }}
                />
            </aside>
        </div>
    );
};

export default CartDrawer;
