import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login, home } from '@/routes';
import { email } from '@/routes/password';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="¿Olvidaste tu contraseña?"
            description="Ingresa tu correo para recibir un enlace de recuperación"
        >
            <Head title="Recuperar contraseña" />

            {status && (
                <div className="mb-4 text-center text-[19.5px] font-medium text-green-600">
                    {status}
                </div>
            )}

            <Form
                {...((email as any).form
                    ? (email as any).form()
                    : { action: email.url(), method: 'post' })}
                className="flex w-full flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="email"
                                className="text-[23.3px] font-medium leading-[28px] text-[#31374F]"
                            >
                                Correo electrónico
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-[13px]">
                                    <FontAwesomeIcon icon={faEnvelope} className="size-[23px] text-[#A8A8A8]" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    placeholder="Correo electrónico"
                                    className="h-[52.5px] border-[#DEDDDD] bg-[#FAFAFA] pl-[46px] text-[19.5px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-[#49637F] focus:ring-0"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-6 h-[56.4px] w-full bg-linear-to-r from-[#385E88] to-[#4E76A0] text-[24.3px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Enviar enlace de recuperación
                        </Button>

                        <div className="my-4 border-b border-[#DEDDDD]" />

                        <div className="text-center text-[21.4px] leading-relaxed text-[#636363]">
                            O, volver a{' '}
                            <Link
                                href={login()}
                                className="font-bold underline"
                            >
                                iniciar sesión
                            </Link>
                        </div>
                    </>
                )}
            </Form>

            <Link
                href={home()}
                className="mt-12 text-center text-[21.4px] text-[#636363] transition hover:text-[#31374F]"
            >
                Volver al inicio
            </Link>
        </AuthLayout>
    );
}
