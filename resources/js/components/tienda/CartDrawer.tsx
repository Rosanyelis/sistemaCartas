import {
    faTimes,
    faTrashAlt,
    faPlus,
    faMinus,
    faInfo,
    faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router, usePage } from '@inertiajs/react';
import { ShieldCheck, Truck, History } from 'lucide-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import PayPalCheckoutButtons from '@/components/tienda/PayPalCheckoutButtons';
import PayPalSubscriptionButtons from '@/components/tienda/PayPalSubscriptionButtons';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { cartLineKey } from '@/types/cart-line';
import {
    flushSaveCartToStorage,
    setResumeCheckoutIntent,
} from '@/lib/cart-storage';
import { login } from '@/routes';
import profile from '@/routes/user/profile';

const RESUME_CART_PATH = '/?openCart=1&checkout=1';

type AuthUserPayload = {
    id: number;
    name: string;
    email: string;
    direction?: string | null;
    zip_code?: string | null;
    phone?: string | null;
};

type TiendaPageProps = {
    auth: { user: AuthUserPayload | null };
    tienda?: {
        iva_percentage: number;
    };
    paymentMethods?: {
        id: number;
        titular: string | null;
        detalles: string | null;
        is_default: boolean;
        tipo_nombre: string | null;
    }[];
};

const CartDrawer: React.FC = () => {
    const {
        items,
        derivedCartMode,
        updateQuantity,
        removeItem,
        clearCart,
        clearProductLines,
        clearHistoriaSubscriptionLines,
        isDrawerOpen: isOpen,
        closeCart,
        consumePendingDrawerView,
    } = useCart();
    const { auth, paymentMethods = [], tienda } =
        usePage().props as TiendaPageProps;
    const [view, setView] = React.useState<'cart' | 'checkout'>('cart');
    const [selectedPayment, setSelectedPayment] = useState<string>(() => {
        const d = paymentMethods.find((m) => m.is_default);

        return d ? `saved-${d.id}` : 'paypal';
    });
    const [purchaseSuccessOpen, setPurchaseSuccessOpen] = useState(false);
    const [purchaseSuccessKind, setPurchaseSuccessKind] = useState<
        'products' | 'subscriptions' | null
    >(null);
    const prevIsOpen = useRef(false);
    const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
    const subscriptionAwaitingShippingRef = useRef(false);
    const [shippingName, setShippingName] = useState('');
    const [shippingEmail, setShippingEmail] = useState('');
    const [shippingDirection, setShippingDirection] = useState('');
    const [shippingZip, setShippingZip] = useState('');
    const [shippingPhone, setShippingPhone] = useState('');

    const syncShippingFromProfile = useCallback(() => {
        const u = auth?.user;
        if (!u) {
            return;
        }

        setShippingName(u.name ?? '');
        setShippingEmail(u.email ?? '');
        setShippingDirection(
            typeof u.direction === 'string' ? u.direction : '',
        );
        setShippingZip(typeof u.zip_code === 'string' ? u.zip_code : '');
        setShippingPhone(typeof u.phone === 'string' ? u.phone : '');
    }, [auth?.user]);

    useEffect(() => {
        if (isOpen && view === 'checkout' && auth?.user) {
            syncShippingFromProfile();
        }
    }, [isOpen, view, auth?.user, syncShippingFromProfile]);

    useEffect(() => {
        if (view === 'cart') {
            setCheckoutStep(1);
        }
    }, [view]);

    useEffect(() => {
        if (!isOpen && subscriptionAwaitingShippingRef.current) {
            subscriptionAwaitingShippingRef.current = false;
            clearHistoriaSubscriptionLines();
        }
    }, [isOpen, clearHistoriaSubscriptionLines]);

    const handleProceedToPay = useCallback(() => {
        if (auth?.user) {
            setCheckoutStep(1);
            setView('checkout');

            return;
        }

        flushSaveCartToStorage(items);
        setResumeCheckoutIntent(true);
        const url = login.url({
            query: { redirect: RESUME_CART_PATH },
        });
        router.visit(url, { preserveScroll: false, preserveState: false });
    }, [auth?.user, items]);

    useEffect(() => {
        if (!isOpen) {
            const id = requestAnimationFrame(() => {
                setView('cart');
            });

            return () => cancelAnimationFrame(id);
        }

        return undefined;
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && !prevIsOpen.current) {
            const v = consumePendingDrawerView();

            if (v === 'checkout') {
                const id = requestAnimationFrame(() => {
                    setCheckoutStep(1);
                    setView('checkout');
                });

                return () => cancelAnimationFrame(id);
            }

            if (v === 'cart') {
                const id = requestAnimationFrame(() => {
                    setCheckoutStep(1);
                    setView('cart');
                });

                return () => cancelAnimationFrame(id);
            }
        }

        prevIsOpen.current = isOpen;

        return undefined;
    }, [isOpen, consumePendingDrawerView]);

    const subtotal = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );
    const ivaPct =
        typeof tienda?.iva_percentage === 'number' && tienda.iva_percentage >= 0
            ? tienda.iva_percentage
            : 16;
    const ivaRaw = subtotal * (ivaPct / 100);
    const iva = Math.round(ivaRaw * 100) / 100;
    const total = Math.round((subtotal + iva) * 100) / 100;

    const productLines = useMemo(
        () => items.filter((i) => i.kind === 'product'),
        [items],
    );

    const historiaLines = useMemo(
        () => items.filter((i) => i.kind === 'historia_suscripcion'),
        [items],
    );

    const paypalLines = useMemo(
        () =>
            productLines.map((i) => ({
                slug: i.slug,
                quantity: i.quantity,
            })),
        [productLines],
    );

    const handlePayPalSuccess = useCallback(
        (_info?: { localOrderId?: number }) => {
            clearProductLines();
            setView('cart');
            closeCart();
            setPurchaseSuccessKind('products');
            setPurchaseSuccessOpen(true);
        },
        [clearProductLines, closeCart],
    );

    const finalizeSubscriptionPurchase = useCallback(() => {
        subscriptionAwaitingShippingRef.current = false;
        clearHistoriaSubscriptionLines();
        setView('cart');
        closeCart();
        setCheckoutStep(1);
        setPurchaseSuccessKind('subscriptions');
        setPurchaseSuccessOpen(true);
    }, [clearHistoriaSubscriptionLines, closeCart]);

    const handleSubscriptionPayPalApproved = useCallback(() => {
        subscriptionAwaitingShippingRef.current = true;
        setCheckoutStep(2);
    }, []);

    const handleFinalizeSubscriptionShipping = useCallback(() => {
        if (!auth?.user) {
            return;
        }

        router.post(
            profile.update().url,
            {
                name: shippingName,
                email: shippingEmail,
                direction: shippingDirection || null,
                zip_code: shippingZip || null,
                phone: shippingPhone || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    finalizeSubscriptionPurchase();
                },
            },
        );
    }, [
        auth?.user,
        shippingName,
        shippingEmail,
        shippingDirection,
        shippingZip,
        shippingPhone,
        finalizeSubscriptionPurchase,
    ]);

    const handleProductContinueToPayment = useCallback(() => {
        if (!auth?.user) {
            setCheckoutStep(2);

            return;
        }

        router.post(
            profile.update().url,
            {
                name: shippingName,
                email: shippingEmail,
                direction: shippingDirection || null,
                zip_code: shippingZip || null,
                phone: shippingPhone || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCheckoutStep(2);
                },
            },
        );
    }, [
        auth?.user,
        shippingName,
        shippingEmail,
        shippingDirection,
        shippingZip,
        shippingPhone,
    ]);

    const handleGoToOrdersPanel = useCallback(() => {
        setPurchaseSuccessOpen(false);
        setPurchaseSuccessKind(null);
        router.visit('/user/orders');
    }, []);

    const handleGoToSubscriptionsPanel = useCallback(() => {
        setPurchaseSuccessOpen(false);
        setPurchaseSuccessKind(null);
        router.visit('/user/subscriptions');
    }, []);

    const handleCloseSuccessModal = useCallback(() => {
        setPurchaseSuccessOpen(false);
        setPurchaseSuccessKind(null);
    }, []);

    const renderShippingForm = (opts: {
        stepLabel: string;
        title: string;
        note?: string;
    }) => (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#1B3D6D] font-bold text-white">
                    {opts.stepLabel}
                </div>
                <h3 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#1B3D6D]">
                    {opts.title}
                </h3>
            </div>
            {opts.note ? (
                <p className="font-['Inter',sans-serif] text-[12px] text-[#7B7B7B]">
                    {opts.note}
                </p>
            ) : null}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter',sans-serif] text-[14px] font-medium text-[#1B3D6D]">
                        Nombre completo
                    </label>
                    <input
                        type="text"
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        placeholder="Ej. Alejandro Magno"
                        className="rounded-[2px] border border-[#DCDCDC] bg-white p-3 font-['Inter',sans-serif] text-[14px] outline-none focus:border-[#1B3D6D]"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter',sans-serif] text-[14px] font-medium text-[#1B3D6D]">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        value={shippingEmail}
                        onChange={(e) => setShippingEmail(e.target.value)}
                        className="rounded-[2px] border border-[#DCDCDC] bg-white p-3 font-['Inter',sans-serif] text-[14px] outline-none focus:border-[#1B3D6D]"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter',sans-serif] text-[14px] font-medium text-[#1B3D6D]">
                        Dirección postal
                    </label>
                    <input
                        type="text"
                        value={shippingDirection}
                        onChange={(e) =>
                            setShippingDirection(e.target.value)
                        }
                        placeholder="Calle, número, piso..."
                        className="rounded-[2px] border border-[#DCDCDC] bg-white p-3 font-['Inter',sans-serif] text-[14px] outline-none focus:border-[#1B3D6D]"
                    />
                </div>
                <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <label className="font-['Inter',sans-serif] text-[14px] font-medium text-[#1B3D6D]">
                            Código postal
                        </label>
                        <input
                            type="text"
                            value={shippingZip}
                            onChange={(e) => setShippingZip(e.target.value)}
                            placeholder="CP"
                            className="rounded-[2px] border border-[#DCDCDC] bg-white p-3 font-['Inter',sans-serif] text-[14px] outline-none focus:border-[#1B3D6D]"
                        />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <label className="font-['Inter',sans-serif] text-[14px] font-medium text-[#1B3D6D]">
                            Teléfono / móvil
                        </label>
                        <input
                            type="tel"
                            value={shippingPhone}
                            onChange={(e) => setShippingPhone(e.target.value)}
                            placeholder="Móvil"
                            className="rounded-[2px] border border-[#DCDCDC] bg-white p-3 font-['Inter',sans-serif] text-[14px] outline-none focus:border-[#1B3D6D]"
                        />
                    </div>
                </div>
            </div>
            {auth?.user ? (
                <button
                    type="button"
                    onClick={syncShippingFromProfile}
                    className="self-start font-['Inter',sans-serif] text-[12px] font-semibold text-[#1B3D6D] underline"
                >
                    Restaurar datos de mi perfil
                </button>
            ) : null}
        </div>
    );

    return (
        <>
        <div
            className={`fixed inset-0 z-[100] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
            <div
                className={`fixed inset-0 top-[80px] bg-black/20 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={closeCart}
            />

            <aside
                className={`fixed top-[80px] right-[0] z-[60] flex h-[calc(100vh-80px)] w-full max-w-[480px] flex-col bg-[#F2F2F2] shadow-[-20px_0px_60px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="custom-scrollbar flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between border-b border-[#DCDCDC] pb-3">
                            <h2 className="font-['Inter',sans-serif] text-[20px] font-bold text-[#1B3D6D] lg:text-[22px]">
                                {view === 'cart'
                                    ? 'Carrito de compras'
                                    : 'Finalizar compra'}
                            </h2>
                            <button
                                type="button"
                                onClick={closeCart}
                                className="flex h-5 w-5 items-center justify-center text-[#333333] transition hover:opacity-50"
                            >
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className="text-sm"
                                />
                            </button>
                        </div>

                        {view === 'cart' ? (
                            <>
                                {items.length === 0 ? (
                                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                                        <p className="font-['Inter',sans-serif] text-[15px] text-[#7B7B7B]">
                                            Tu carrito está vacío.
                                        </p>
                                        <p className="font-['Inter',sans-serif] text-[13px] text-[#A0A0A0]">
                                            Puedes añadir{' '}
                                            <strong>productos</strong> desde
                                            el catálogo o una{' '}
                                            <strong>suscripción</strong> desde
                                            el detalle de una historia. No se
                                            pueden mezclar ambos en el mismo
                                            carrito.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {items.map((item) => (
                                            <div
                                                key={cartLineKey(item)}
                                                className="relative flex gap-3 rounded-[2px] bg-white p-2.5 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItem(
                                                            cartLineKey(item),
                                                        )
                                                    }
                                                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-[2px] bg-[#EFEFEF] text-[#7B7B7B] transition hover:bg-[#E5E5E5] hover:text-red-500"
                                                    aria-label="Quitar del carrito"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrashAlt}
                                                        className="text-[11px]"
                                                    />
                                                </button>

                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-[52px] w-[52px] shrink-0 rounded-[2px] object-cover"
                                                />

                                                <div className="flex min-w-0 flex-1 flex-col justify-between pr-10">
                                                    <div className="flex flex-col gap-0.5 pr-1">
                                                        <h3 className="font-['Inter',sans-serif] text-[14px] font-bold leading-tight text-[#1B3D6D] lg:text-[15px]">
                                                            {item.name}
                                                        </h3>
                                                        <span className="line-clamp-2 font-['Inter',sans-serif] text-[12px] leading-snug text-[#7B7B7B]">
                                                            {item.subtitle}
                                                        </span>
                                                    </div>

                                                    {/* Una sola fila: precio unitario + cantidad | total + badge (diseño referencia) */}
                                                    <div className="mt-2.5 flex w-full min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-2">
                                                        <div className="flex min-w-0 items-center gap-3">
                                                            <span className="shrink-0 font-['Inter',sans-serif] text-[14px] font-semibold text-[#1B3D6D]">
                                                                $
                                                                {item.price
                                                                    .toFixed(
                                                                        2,
                                                                    )
                                                                    .replace(
                                                                        '.',
                                                                        ',',
                                                                    )}
                                                            </span>
                                                            <div className="flex h-[22px] shrink-0 items-center rounded-[2px] bg-[#F5F5FF] px-1 shadow-[inset_0px_1px_2px_rgba(0,0,0,0.04)]">
                                                                {item.kind ===
                                                                'product' ? (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                updateQuantity(
                                                                                    cartLineKey(
                                                                                        item,
                                                                                    ),
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
                                                                        <span className="min-w-[16px] text-center font-['Roboto',sans-serif] text-[12px] font-medium text-[#1B3D6D]">
                                                                            {
                                                                                item.quantity
                                                                            }
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                updateQuantity(
                                                                                    cartLineKey(
                                                                                        item,
                                                                                    ),
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
                                                                    </>
                                                                ) : (
                                                                    <span className="px-2 font-['Roboto',sans-serif] text-[11px] font-medium text-[#1B3D6D]">
                                                                        1 ciclo
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="font-['Inter',sans-serif] text-[14px] font-bold text-[#1B3D6D]">
                                                                $
                                                                {(
                                                                    item.price *
                                                                    item.quantity
                                                                )
                                                                    .toFixed(2)
                                                                    .replace(
                                                                        '.',
                                                                        ',',
                                                                    )}
                                                            </span>
                                                        </div>
                                                        <div className="ml-auto flex shrink-0 items-center gap-2.5 sm:gap-3">
                                                            
                                                            <span className="rounded-[2px] bg-[rgba(27,61,109,0.08)] px-2 py-0.5 font-['Inter',sans-serif] text-[10px] font-medium whitespace-nowrap text-[#1B3D6D]">
                                                                {item.badge}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {items.length > 0 && (
                                    <>
                                        <div className="my-1 border-b border-[#DCDCDC]" />

                                        <div className="flex flex-col gap-3 py-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-['Inter',sans-serif] text-[15px] font-bold text-[#475569]">
                                                    Subtotal
                                                </span>
                                                <span className="font-['Inter',sans-serif] text-[15px] font-medium text-[#475569]">
                                                    $
                                                    {subtotal
                                                        .toFixed(2)
                                                        .replace('.', ',')}
                                                </span>
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-['Inter',sans-serif] text-[15px] font-bold text-[#1B3D6D]">
                                                            Envío
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="flex h-4 w-4 items-center justify-center rounded-full border border-[#1B3D6D] text-[10px] text-[#1B3D6D] transition hover:bg-[#1B3D6D] hover:text-white"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faInfo}
                                                                className="text-[8px]"
                                                            />
                                                        </button>
                                                    </div>
                                                    <span className="font-['Inter',sans-serif] text-[15px] font-bold text-[#1B3D6D]">
                                                        Gratis
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-right font-['Inter',sans-serif] text-[11px] font-light text-[#1B3D6D] italic opacity-60">
                                                    Envío gratuito incluido en
                                                    esta demo.
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="font-['Inter',sans-serif] text-[15px] font-bold text-[#475569]">
                                                    IVA ({ivaPct}%)
                                                </span>
                                                <span className="font-['Inter',sans-serif] text-[15px] font-medium text-[#475569]">
                                                    $
                                                    {iva
                                                        .toFixed(2)
                                                        .replace('.', ',')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="my-1 border-b border-[#DCDCDC]" />

                                        <div className="flex items-end justify-between py-2">
                                            <span className="font-['Inter',sans-serif] text-[20px] font-bold text-[#1B3D6D]">
                                                Total
                                            </span>
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-baseline">
                                                    <span className="mr-0.5 font-['Playfair_Display',serif] text-[28px] font-light text-[#1B3D6D] lg:text-[32px]">
                                                        $
                                                    </span>
                                                    <span className="font-['Playfair_Display',serif] text-[38px] font-bold leading-none text-[#1B3D6D] lg:text-[42px]">
                                                        {
                                                            total
                                                                .toFixed(2)
                                                                .replace(
                                                                    '.',
                                                                    ',',
                                                                )
                                                                .split(',')[0]
                                                        }
                                                    </span>
                                                    <span className="font-['Playfair_Display',serif] text-[24px] font-bold leading-none text-[#1B3D6D]">
                                                        ,
                                                        {
                                                            total
                                                                .toFixed(2)
                                                                .split('.')[1]
                                                        }
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-medium text-[#1B3D6D] opacity-60">
                                                    IVA Incluido
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleProceedToPay}
                                            disabled={items.length === 0}
                                            className="mt-2 w-full rounded-[2px] bg-[#1B3D6D] py-[14px] text-white shadow-lg transition hover:bg-[#163158] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <span className="font-['Inter',sans-serif] text-[15px] font-bold tracking-wide">
                                                {auth?.user
                                                    ? 'Proceder al pago'
                                                    : 'Iniciar sesión y pagar'}
                                            </span>
                                        </button>

                                        <div className="mt-4 flex flex-col gap-3">
                                            <div className="flex items-center gap-3 text-[#1B3D6D] opacity-80">
                                                <ShieldCheck
                                                    size={20}
                                                    strokeWidth={1.5}
                                                />
                                                <span className="font-['Inter',sans-serif] text-[12px] font-medium">
                                                    Pago seguro con PayPal
                                                    (sandbox en esta demo)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[#1B3D6D] opacity-80">
                                                <Truck
                                                    size={20}
                                                    strokeWidth={1.5}
                                                />
                                                <span className="font-['Inter',sans-serif] text-[12px] font-medium">
                                                    Envío protegido (demo)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[#1B3D6D] opacity-80">
                                                <History
                                                    size={20}
                                                    strokeWidth={1.5}
                                                />
                                                <span className="font-['Inter',sans-serif] text-[12px] font-medium">
                                                    Devolución garantizada en 14
                                                    días (condiciones reales al
                                                    lanzar)
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col gap-6 py-4">
                                {/*
                                  Suscripciones: paso 1 = aprobación en PayPal; paso 2 = confirmar envío y guardarlo en el perfil antes de cerrar.
                                  Productos: paso 1 = datos de envío; paso 2 = método de pago y cobro PayPal (tras guardar envío si hay sesión).
                                */}
                                {derivedCartMode === 'subscriptions' &&
                                checkoutStep === 1 &&
                                historiaLines.length > 0 ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#1B3D6D] font-bold text-white">
                                                1
                                            </div>
                                            <h3 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#1B3D6D]">
                                                Pago con PayPal (suscripción)
                                            </h3>
                                        </div>
                                        <p className="font-['Inter',sans-serif] text-[11px] leading-relaxed text-[#7B7B7B]">
                                            Aprueba el plan recurrente en la
                                            ventana de PayPal. Tras la
                                            aprobación, el paso 2 solo confirma
                                            y guarda tu dirección de envío en
                                            el perfil antes de cerrar el
                                            carrito.
                                        </p>
                                        {!auth?.user ? (
                                            <p className="font-['Inter',sans-serif] text-[12px] text-amber-800">
                                                Inicia sesión para suscribirte
                                                a las historias del carrito.
                                            </p>
                                        ) : (
                                            historiaLines.map((h) => (
                                                <div
                                                    key={cartLineKey(h)}
                                                    className="flex flex-col gap-2 rounded-[2px] border border-[#DCDCDC] bg-white p-3"
                                                >
                                                    <p className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#1B3D6D]">
                                                        {h.name}
                                                    </p>
                                                    <PayPalSubscriptionButtons
                                                        historiaSlug={h.slug}
                                                        onSuccess={
                                                            handleSubscriptionPayPalApproved
                                                        }
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ) : null}

                                {derivedCartMode === 'subscriptions' &&
                                checkoutStep === 2 ? (
                                    <>
                                        {renderShippingForm({
                                            stepLabel: '2',
                                            title: 'Confirmar envío',
                                            note: 'Tras aprobar PayPal, guarda tu dirección en el perfil y finaliza.',
                                        })}
                                        <Button
                                            type="button"
                                            className="w-full rounded-[2px] bg-[#1B3D6D] py-[14px] font-['Inter',sans-serif] text-[15px] font-bold text-white hover:bg-[#163158]"
                                            onClick={
                                                handleFinalizeSubscriptionShipping
                                            }
                                            disabled={!auth?.user}
                                        >
                                            Guardar envío y finalizar
                                        </Button>
                                    </>
                                ) : null}

                                {derivedCartMode === 'products' &&
                                checkoutStep === 1 ? (
                                    <>
                                        {renderShippingForm({
                                            stepLabel: '1',
                                            title: 'Información de envío',
                                            note: 'El cobro con PayPal ocurre en el paso 2. Si iniciaste sesión, estos datos se guardan en tu perfil al continuar.',
                                        })}
                                        <Button
                                            type="button"
                                            className="w-full rounded-[2px] bg-[#1B3D6D] py-[14px] font-['Inter',sans-serif] text-[15px] font-bold text-white hover:bg-[#163158]"
                                            onClick={
                                                handleProductContinueToPayment
                                            }
                                        >
                                            Continuar al pago
                                        </Button>
                                    </>
                                ) : null}

                                {derivedCartMode === 'products' &&
                                checkoutStep === 2 ? (
                                    <>
                                        <div className="border-b border-[#DCDCDC]" />
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#1B3D6D] font-bold text-white">
                                                    2
                                                </div>
                                                <h3 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#1B3D6D]">
                                                    Método de pago
                                                </h3>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                {paymentMethods.length > 0 ? (
                                                    <>
                                                        <p className="font-['Inter',sans-serif] text-[11px] leading-relaxed text-[#7B7B7B]">
                                                            Métodos guardados en
                                                            tu perfil
                                                            (referencia). El
                                                            cobro de esta tienda
                                                            usa PayPal: productos
                                                            con Orders y
                                                            suscripciones a
                                                            historias con PayPal
                                                            Subscriptions (no se
                                                            tokeniza aquí el
                                                            recurrente).
                                                        </p>
                                                        {paymentMethods.map(
                                                            (m) => (
                                                                <label
                                                                    key={m.id}
                                                                    className={`relative flex cursor-pointer items-center justify-between rounded-[2px] border p-4 transition-all duration-300 ${selectedPayment === `saved-${m.id}` ? 'border-[#1B3D6D] bg-[#E1EFFF]' : 'border-[#DCDCDC] bg-white'}`}
                                                                    onClick={() =>
                                                                        setSelectedPayment(
                                                                            `saved-${m.id}`,
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div
                                                                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${selectedPayment === `saved-${m.id}` ? 'border-[#1B3D6D] bg-[#1B3D6D]' : 'border-[#DCDCDC]'}`}
                                                                        >
                                                                            {selectedPayment ===
                                                                                `saved-${m.id}` && (
                                                                                <div className="h-2 w-2 rounded-full bg-white" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="font-['Inter',sans-serif] text-[14px] font-bold text-[#1B3D6D]">
                                                                                {m.titular ??
                                                                                    'Método'}
                                                                            </span>
                                                                            <span className="font-['Inter',sans-serif] text-[11px] text-[#7B7B7B]">
                                                                                {m.tipo_nombre ??
                                                                                    '—'}
                                                                                {m.is_default
                                                                                    ? ' · Predeterminado'
                                                                                    : ''}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </label>
                                                            ),
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedPayment(
                                                                    'paypal',
                                                                )
                                                            }
                                                            className="text-left font-['Inter',sans-serif] text-[12px] font-semibold text-[#1B3D6D] underline"
                                                        >
                                                            Usar otro método
                                                            (PayPal)
                                                        </button>
                                                    </>
                                                ) : null}

                                                <label
                                                    className={`relative flex cursor-pointer items-center justify-between rounded-[2px] border p-4 transition-all duration-300 ${selectedPayment === 'paypal' ? 'border-[#1B3D6D] bg-[#E1EFFF]' : 'border-[#DCDCDC] bg-white'}`}
                                                    onClick={() =>
                                                        setSelectedPayment(
                                                            'paypal',
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${selectedPayment === 'paypal' ? 'border-[#1B3D6D] bg-[#1B3D6D]' : 'border-[#DCDCDC]'}`}
                                                        >
                                                            {selectedPayment ===
                                                                'paypal' && (
                                                                <div className="h-2 w-2 rounded-full bg-white" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-['Inter',sans-serif] text-[15px] font-bold text-[#1B3D6D]">
                                                                PayPal
                                                            </span>
                                                            <i className="fa-brands fa-paypal text-[#003087]"></i>
                                                        </div>
                                                    </div>
                                                    <div className="rounded-[1px] bg-[rgba(27,61,109,0.08)] px-[6px] py-[2px]">
                                                        <span className="font-['Inter',sans-serif] text-[10px] font-medium text-[#1B3D6D]">
                                                            Sandbox activo
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        {productLines.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                <p className="font-['Inter',sans-serif] text-[12px] text-[#7B7B7B]">
                                                    Pago único de productos:
                                                    inicia sesión en PayPal
                                                    (sandbox) para completar el
                                                    cobro.
                                                </p>
                                                <PayPalCheckoutButtons
                                                    lines={paypalLines}
                                                    onSuccess={
                                                        handlePayPalSuccess
                                                    }
                                                />
                                            </div>
                                        ) : null}
                                    </>
                                ) : null}

                                <button
                                    type="button"
                                    onClick={() => setView('cart')}
                                    className="text-center font-['Inter',sans-serif] text-[13px] font-semibold text-[#1B3D6D] underline opacity-70 hover:opacity-100"
                                >
                                    Volver al carrito
                                </button>
                            </div>
                        )}
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

        {purchaseSuccessOpen ? (
            <div
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="purchase-success-title"
            >
                <button
                    type="button"
                    className="absolute inset-0 bg-black/40 transition-opacity hover:bg-black/45"
                    aria-label="Cerrar diálogo"
                    onClick={handleCloseSuccessModal}
                />
                <div className="relative z-[1] w-full max-w-[420px] rounded-[2px] border border-[#DCDCDC] bg-white p-6 shadow-[0px_12px_40px_rgba(0,0,0,0.12)] md:p-8">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-[2px] bg-[#E8F0FA]">
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                                className="text-2xl text-[#1B3D6D]"
                            />
                        </div>
                    </div>
                    <h2
                        id="purchase-success-title"
                        className="mb-3 text-center font-['Inter',sans-serif] text-[20px] font-bold text-[#1B3D6D] md:text-[22px]"
                    >
                        {purchaseSuccessKind === 'subscriptions'
                            ? 'Suscripción registrada'
                            : 'Compra exitosa'}
                    </h2>
                    <p className="text-center font-['Inter',sans-serif] text-[14px] leading-relaxed text-[#5C5C5C] md:text-[15px]">
                        {purchaseSuccessKind === 'subscriptions'
                            ? 'PayPal está procesando tu suscripción. En unos instantes debería aparecer como activa en tu panel; si tarda, revisa también tu cuenta PayPal.'
                            : 'Puedes revisar el detalle del pedido en tu panel de compras.'}
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseSuccessModal}
                            className="h-[44px] rounded-[2px] border-2 border-[#1B3D6D] bg-white font-['Inter',sans-serif] text-[14px] font-semibold text-[#1B3D6D] shadow-none hover:bg-[#F5F8FC] hover:text-[#1B3D6D] dark:bg-white dark:text-[#1B3D6D] dark:border-[#1B3D6D] dark:hover:bg-[#F5F8FC] sm:min-w-[140px]"
                        >
                            Cerrar
                        </Button>
                        <Button
                            type="button"
                            onClick={
                                purchaseSuccessKind === 'subscriptions'
                                    ? handleGoToSubscriptionsPanel
                                    : handleGoToOrdersPanel
                            }
                            className="h-[44px] rounded-[2px] bg-[#1B3D6D] font-['Inter',sans-serif] text-[14px] font-semibold text-white shadow-sm hover:bg-[#254a7a] sm:min-w-[180px]"
                        >
                            {purchaseSuccessKind === 'subscriptions'
                                ? 'Ir a suscripciones'
                                : 'Ir a mis pedidos'}
                        </Button>
                    </div>
                </div>
            </div>
        ) : null}
        </>
    );
};

export default CartDrawer;
