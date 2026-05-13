import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, useForm } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import ForgotPasswordModal from '@/components/auth/forgot-password-modal';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register, home } from '@/routes';
import { store } from '@/routes/login';

type Props = {
    status?: string;
    /** Mostrar enlace de recuperación (OTP por modal). */
    canResetPassword?: boolean;
    canRegister: boolean;
    /** Ruta pública de retorno (validada en el servidor) tras autenticarse. */
    redirect?: string | null;
    /** Abrir modal de recuperación (query `?recuperar=1`). */
    openForgotPassword?: boolean;
};

export default function Login({
    status,
    canResetPassword = true,
    canRegister,
    redirect: redirectTo,
    openForgotPassword = false,
}: Props) {
    const [showForgotModal, setShowForgotModal] = useState(false);
    /** Fuerza remontar el modal en cada apertura para evitar estado residual. */
    const [forgotModalKey, setForgotModalKey] = useState(0);

    const openForgotModal = useCallback(() => {
        setForgotModalKey((k) => k + 1);
        setShowForgotModal(true);
    }, []);

    const form = useForm({
        email: '',
        password: '',
        redirect: redirectTo ?? '',
    });

    useEffect(() => {
        form.setData('redirect', redirectTo ?? '');
    }, [redirectTo]);

    useEffect(() => {
        if (openForgotPassword) {
            openForgotModal();
        }
    }, [openForgotPassword, openForgotModal]);

    useEffect(() => {
        if (!openForgotPassword || typeof window === 'undefined') {
            return;
        }

        const url = new URL(window.location.href);

        if (!url.searchParams.has('recuperar')) {
            return;
        }

        url.searchParams.delete('recuperar');
        const next = url.pathname + url.search + url.hash;
        window.history.replaceState({}, '', next);
    }, [openForgotPassword]);

    return (
        <AuthLayout
            title="Bienvenido de nuevo"
            description="Ingresa a tu cuenta"
        >
            <Head title="Iniciar Sesión" />

            <form
                className="flex w-full flex-col gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post(store.url(), {
                        onSuccess: () => {
                            form.reset('password');
                        },
                    });
                }}
            >
                {redirectTo ? (
                    <input
                        type="hidden"
                        name="redirect"
                        value={form.data.redirect}
                        readOnly
                    />
                ) : null}
                <div className="flex flex-col gap-1.5">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-[13px]">
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="size-[18px] text-[#A8A8A8] md:size-[23px]"
                            />
                        </div>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData('email', e.target.value)
                            }
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="Correo electrónico"
                            className="h-[44px] border-[#DEDDDD] bg-[#FAFAFA] pl-[40px] text-[14px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-[#49637F] focus:ring-0 md:h-[48px] md:pl-[46px] md:text-[16px]"
                        />
                    </div>
                    <InputError message={form.errors.email} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <PasswordInput
                        id="password"
                        name="password"
                        value={form.data.password}
                        onChange={(e) =>
                            form.setData('password', e.target.value)
                        }
                        required
                        tabIndex={2}
                        autoComplete="current-password"
                        placeholder="Contraseña"
                        leftIcon={
                            <FontAwesomeIcon
                                icon={faLock}
                                className="size-[18px] text-[#A8A8A8] md:size-[23px]"
                            />
                        }
                        className="h-[44px] border-[#DEDDDD] bg-[#FAFAFA] text-[14px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-[#49637F] focus:ring-0 md:h-[48px] md:text-[16px]"
                    />
                    <InputError message={form.errors.password} />
                </div>

                {canResetPassword ? (
                    <button
                        type="button"
                        onClick={openForgotModal}
                        className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-[14px] leading-[24px] font-medium text-[#49637F] underline underline-offset-2 transition hover:opacity-80 md:text-[16px]"
                        tabIndex={5}
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                ) : null}

                <Button
                    type="submit"
                    className="mt-2 h-[44px] w-full bg-linear-to-r from-[#385E88] to-[#4E76A0] text-[18px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] md:h-[50px] md:text-[22px]"
                    tabIndex={4}
                    disabled={form.processing}
                >
                    {form.processing && <Spinner />}
                    Iniciar sesión
                </Button>

                {canRegister && (
                    <div className="text-center text-[14px] leading-relaxed text-[#636363] md:text-[16px]">
                        ¿Aún no tienes cuenta?{' '}
                        <Link
                            href={
                                redirectTo
                                    ? register.url({
                                          query: {
                                              redirect: redirectTo,
                                          },
                                      })
                                    : register.url()
                            }
                            className="block font-medium text-[#49637F] underline transition hover:opacity-80"
                            tabIndex={5}
                        >
                            crear cuenta
                        </Link>
                    </div>
                )}
            </form>

            {status && (
                <div className="mt-2 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <Link
                href={home()}
                className="mt-8 text-center text-[14px] text-[#636363] transition hover:text-[#31374F] md:mt-12 md:text-[16px]"
            >
                Volver al inicio
            </Link>

            <ForgotPasswordModal
                key={forgotModalKey}
                open={showForgotModal}
                onClose={() => setShowForgotModal(false)}
            />
        </AuthLayout>
    );
}
