import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register, home } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Bienvenido de nuevo"
            description="Ingresa a tu cuenta"
        >
            <Head title="Iniciar Sesión" />

            <Form
                {...((store as any).form
                    ? (store as any).form()
                    : { action: store.url(), method: 'post' })}
                resetOnSuccess={['password']}
                className="flex w-full flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
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
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Correo electrónico"
                                    className="h-[44px] border-[#DEDDDD] bg-[#FAFAFA] pl-[40px] text-[14px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-[#49637F] focus:ring-0 md:h-[48px] md:pl-[46px] md:text-[16px]"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <PasswordInput
                                id="password"
                                name="password"
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
                            <InputError message={errors.password} />
                        </div>

                        {canResetPassword && (
                            <Link
                                href={request()}
                                className="block w-full text-left text-[14px] leading-[24px] font-medium text-[#49637F] transition hover:opacity-80 md:text-[16px]"
                                tabIndex={5}
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}

                        <Button
                            type="submit"
                            className="mt-2 h-[44px] w-full bg-linear-to-r from-[#385E88] to-[#4E76A0] text-[18px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] md:h-[50px] md:text-[22px]"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Iniciar sesión
                        </Button>

                        <div className="my-2 border-b border-[#DEDDDD]" />

                        {canRegister && (
                            <div className="text-center text-[14px] leading-relaxed text-[#636363] md:text-[16px]">
                                ¿Aún no tienes cuenta?{' '}
                                <Link
                                    href={register()}
                                    className="block font-bold underline"
                                    tabIndex={5}
                                >
                                    crear cuenta
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-2 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <Link
                href={home()}
                className="mt-2 text-center text-[14px] text-[#636363] transition hover:text-[#31374F] md:text-[16px]"
            >
                Volver al inicio
            </Link>
        </AuthLayout>
    );
}
