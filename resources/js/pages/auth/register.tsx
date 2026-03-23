import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login, home } from '@/routes';
import { store } from '@/routes/register';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faLock,
    faUser,
    faArrowRight,
    faArrowLeft,
    faCheck,
} from '@fortawesome/free-solid-svg-icons';

export default function Register() {
    return (
        <AuthLayout
            title="Crear tu cuenta"
            description="Únete a nuestra comunidad de lectores y recibe historias increíbles."
        >
            <Head title="Registro" />

            {/* Stepper Header */}
            <div className="mb-8 w-full">
                <div className="flex items-center justify-between text-[11.6px] font-bold tracking-tight text-[#49637F]">
                    <span>PASO 1 DE 3</span>
                    <span className="text-[#A8A8A8]">50% completado</span>
                </div>
                <div className="mt-2 h-[5.8px] w-full overflow-hidden rounded-full border border-[#EEEEEE] bg-[#FAFAFA]">
                    <div
                        className="h-full bg-[#49637F] transition-all duration-500"
                        style={{ width: '50%' }}
                    />
                </div>
                <p className="mt-2 text-[11.6px] font-medium text-[#A8A8A8]">
                    Registro de información personal
                </p>
            </div>

            <Form
                {...((store as any).form
                    ? (store as any).form()
                    : { action: store.url(), method: 'post' })}
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex w-full flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="flex flex-col gap-1">
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-[13px]">
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="size-[18px] text-[#A8A8A8] md:size-[23px]"
                                    />
                                </div>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder="Nombre completo"
                                    className="h-[44px] border-[#DEDDDD] bg-[#FAFAFA] pl-[40px] text-[14px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-[#49637F] focus:ring-0 md:h-[48px] md:pl-[46px] md:text-[16px]"
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        <div className="flex flex-col gap-1">
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
                                    tabIndex={2}
                                    autoComplete="email"
                                    placeholder="Correo electrónico"
                                    className="h-[44px] border-[#DEDDDD] bg-[#FAFAFA] pl-[40px] text-[14px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-[#49637F] focus:ring-0 md:h-[48px] md:pl-[46px] md:text-[16px]"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
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

                            <div className="flex flex-col gap-1">
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="Confirmar"
                                    leftIcon={
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className="size-[18px] text-[#A8A8A8] md:size-[23px]"
                                        />
                                    }
                                    className="h-[44px] border-[#DEDDDD] bg-[#FAFAFA] text-[14px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-[#49637F] focus:ring-0 md:h-[48px] md:text-[16px]"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 h-[44px] w-full bg-linear-to-r from-[#385E88] to-[#4E76A0] text-[18px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] md:h-[50px] md:text-[22px]"
                            tabIndex={5}
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Siguiente{' '}
                            <FontAwesomeIcon
                                icon={faArrowRight}
                                className="ml-2 size-[18px]"
                            />
                        </Button>

                        <div className="my-2 border-b border-[#DEDDDD]" />

                        <div className="mt-0 text-center text-[14px] leading-relaxed text-[#636363] md:text-[16px]">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                href={login()}
                                className="block font-bold text-[#49637F] underline decoration-from-font underline-offset-4"
                                tabIndex={6}
                            >
                                Iniciar sesión
                            </Link>
                        </div>
                    </>
                )}
            </Form>

            <Link
                href={home()}
                className="mt-2 flex items-center justify-center text-[14px] text-[#636363] transition hover:text-[#31374F] md:text-[18px]"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2 size-4" />
                Volver al inicio
            </Link>
        </AuthLayout>
    );
}
