import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import ClienteLayout from '@/layouts/cliente-layout';
import { avisoDePrivacidad, home } from '@/routes';

const prose = 'text-[15px] leading-[1.65] text-[#3e352f] md:text-[16px] md:leading-[1.7]';
const h2 =
    "mb-4 font-['Playfair_Display',serif] text-[20px] font-bold tracking-tight text-[#1B3D6D] md:text-[22px]";
const h3 = "mb-2 mt-4 text-[16px] font-semibold text-[#1B3D6D] md:text-[17px]";
const linkClass = 'font-medium text-[#49637F] underline underline-offset-2 transition hover:opacity-80';

function Section({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="mb-10 border-b border-[#e8e4d9] pb-10 last:mb-0 last:border-b-0 last:pb-0">
            <h2 className={h2}>{title}</h2>
            <div className={`space-y-4 ${prose}`}>{children}</div>
        </section>
    );
}

function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="ml-1 list-disc space-y-2 pl-5 marker:text-[#1B3D6D]">
            {items.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    );
}

function TransferenciasTable() {
    const rows: [string, string, string][] = [
        [
            'Procesadores de pago (Stripe, Mercado Pago, Conekta, PayPal)',
            'Procesamiento de cobros recurrentes y transacciones con tarjeta',
            'Art. 37, Fracción II',
        ],
        [
            'Empresas de mensajería y paquetería (Estafeta, DHL, FedEx, Correos de México, 99 Minutos)',
            'Entrega física de las cartas y materiales al domicilio del suscriptor',
            'Art. 37, Fracción II',
        ],
        [
            'Proveedores de servicios tecnológicos (hosting, servidores, CRM, email marketing)',
            'Almacenamiento seguro de datos, gestión de comunicaciones y operación de la plataforma',
            'Art. 37, Fracción II',
        ],
        [
            'Plataformas publicitarias (Meta/Facebook, Google)',
            'Campañas de remarketing y audiencias personalizadas',
            'Consentimiento del titular',
        ],
        [
            'Autoridades competentes',
            'Cumplimiento de requerimientos legales, fiscales o judiciales',
            'Art. 37, Fracción I y IV',
        ],
        [
            'Proveedores de facturación electrónica (PAC)',
            'Emisión de CFDI conforme a disposiciones del SAT',
            'Art. 37, Fracción I',
        ],
    ];

    return (
        <div className="-mx-1 overflow-x-auto md:mx-0">
            <table className="min-w-[640px] w-full border-collapse border border-[#e8e4d9] text-left text-[13px] md:min-w-0 md:text-[15px]">
                <thead>
                    <tr className="bg-[#f5f1e8]">
                        <th className="border border-[#e8e4d9] px-3 py-2 font-semibold text-[#1B3D6D]">
                            Tercero receptor
                        </th>
                        <th className="border border-[#e8e4d9] px-3 py-2 font-semibold text-[#1B3D6D]">
                            Finalidad
                        </th>
                        <th className="border border-[#e8e4d9] px-3 py-2 font-semibold text-[#1B3D6D]">
                            Fundamento legal
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(([tercero, finalidad, fundamento]) => (
                        <tr key={tercero}>
                            <td className="border border-[#e8e4d9] px-3 py-2 align-top">
                                {tercero}
                            </td>
                            <td className="border border-[#e8e4d9] px-3 py-2 align-top">
                                {finalidad}
                            </td>
                            <td className="border border-[#e8e4d9] px-3 py-2 align-top whitespace-nowrap">
                                {fundamento}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function AvisoDePrivacidad() {
    return (
        <ClienteLayout>
            <Head>
                <title>Aviso de privacidad | Historias por Correo</title>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
            </Head>

            <article className="mx-auto max-w-3xl px-5 pb-20 pt-[100px] md:px-8 md:pb-28 md:pt-[120px]">
                <header className="mb-12 text-center md:mb-14">
                    <h1 className="mb-4 font-['Playfair_Display',serif] text-[22px] font-bold leading-tight tracking-tight text-[#1B3D6D] uppercase md:text-[26px]">
                        Aviso de privacidad integral
                    </h1>
                    <p className="text-[15px] font-semibold text-[#3e352f] md:text-[16px]">
                        HISTORIAS POR CORREO, S.A.P.I. DE C.V.
                    </p>
                    <p className="mt-2 text-[14px] text-[#636363] md:text-[15px]">
                        <a
                            href="https://www.historiasporcorreo.com"
                            className={linkClass}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.historiasporcorreo.com
                        </a>
                    </p>
                    <p className="mt-3 text-[13px] text-[#636363] md:text-[14px]">
                        Última actualización: 26 de marzo de 2026
                    </p>
                </header>

                <div className="rounded-lg border border-[#e8e4d9] bg-white/60 p-6 shadow-sm md:p-8">
                    <Section title="I. Identidad y domicilio del responsable">
                        <p>
                            En cumplimiento a lo dispuesto por la Ley Federal de
                            Protección de Datos Personales en Posesión de los
                            Particulares (en adelante &quot;la Ley&quot;), su
                            Reglamento y los Lineamientos del Aviso de Privacidad
                            publicados en el Diario Oficial de la Federación,
                            HISTORIAS POR CORREO, S.A.P.I. DE C.V. (en adelante
                            &quot;HISTORIAS POR CORREO&quot; o &quot;el
                            Responsable&quot;), con domicilio en Calle Manuel M.
                            Ponce #69, Interior 101, Colonia Guadalupe Inn, C.P.
                            01020, Alcaldía Álvaro Obregón, Ciudad de México,
                            México, es responsable del tratamiento de sus datos
                            personales.
                        </p>
                        <p>
                            Para cualquier duda o aclaración respecto al
                            tratamiento de sus datos personales, puede
                            contactarnos a través de los siguientes medios:
                        </p>
                        <BulletList
                            items={[
                                'Correo electrónico: contacto@historiasporcorreo.com',
                                'Teléfono: 55 2580 6124',
                                'Domicilio: Calle Manuel M. Ponce #69, Int. 101, Col. Guadalupe Inn, C.P. 01020, Álvaro Obregón, CDMX.',
                            ]}
                        />
                    </Section>

                    <Section title="II. Datos personales que se recaban">
                        <p>
                            Para las finalidades señaladas en el presente Aviso
                            de Privacidad, HISTORIAS POR CORREO podrá recabar y
                            tratar las siguientes categorías de datos personales:
                        </p>
                        <div className="space-y-3">
                            <p>
                                <strong>a) Datos de identificación:</strong>{' '}
                                Nombre completo, fecha de nacimiento, género,
                                imagen (fotografía de perfil, en su caso), firma
                                electrónica.
                            </p>
                            <p>
                                <strong>b) Datos de contacto:</strong> Domicilio
                                completo (calle, número, colonia, código postal,
                                ciudad, estado), correo electrónico, número de
                                teléfono fijo y/o celular.
                            </p>
                            <p>
                                <strong>c) Datos de envío:</strong> Dirección de
                                entrega (cuando sea diferente al domicilio de
                                facturación), referencias de ubicación, nombre de
                                quien recibe, instrucciones especiales de entrega.
                            </p>
                            <p>
                                <strong>
                                    d) Datos financieros y de facturación:
                                </strong>{' '}
                                Número de tarjeta de crédito o débito (los últimos
                                4 dígitos), fecha de vencimiento, nombre del
                                titular de la tarjeta, dirección de facturación,
                                Registro Federal de Contribuyentes (RFC), razón
                                social y régimen fiscal (para efectos de
                                facturación electrónica CFDI 4.0).
                            </p>
                            <p>
                                <strong>e) Datos de la cuenta de usuario:</strong>{' '}
                                Nombre de usuario, contraseña (cifrada), historial
                                de compras y suscripciones, preferencias de
                                contenido, historial de interacciones con el
                                servicio al cliente.
                            </p>
                            <p>
                                <strong>
                                    f) Datos de navegación y tecnológicos:
                                </strong>{' '}
                                Dirección IP, tipo de navegador, sistema
                                operativo, dispositivo utilizado, páginas visitadas
                                dentro del sitio, tiempo de permanencia, cookies,
                                web beacons, píxeles de seguimiento y tecnologías
                                similares.
                            </p>
                        </div>
                        <p className="font-semibold text-[#1B3D6D]">
                            IMPORTANTE: HISTORIAS POR CORREO NO almacena
                            directamente los datos completos de tarjetas de
                            crédito o débito. El procesamiento de pagos se realiza
                            a través de plataformas de pago certificadas con
                            estándar PCI-DSS (como Stripe, Mercado Pago, Conekta o
                            PayPal), quienes son responsables del resguardo de
                            dicha información financiera sensible.
                        </p>
                    </Section>

                    <Section title="III. Datos personales sensibles">
                        <p>
                            HISTORIAS POR CORREO declara que NO recaba ni trata
                            datos personales sensibles (tales como origen racial o
                            étnico, estado de salud, información genética,
                            creencias religiosas, opiniones políticas, preferencia
                            sexual, entre otros) para la prestación de sus
                            servicios.
                        </p>
                    </Section>

                    <Section title="IV. Finalidades del tratamiento de datos personales">
                        <p>
                            Sus datos personales serán tratados para las
                            siguientes finalidades:
                        </p>
                        <h3 className={h3}>
                            A) Finalidades primarias (necesarias para la relación
                            jurídica)
                        </h3>
                        <BulletList
                            items={[
                                'Crear, administrar y gestionar su cuenta de usuario en nuestra plataforma.',
                                'Procesar y gestionar su suscripción mensual al servicio de Historias por Correo.',
                                'Procesar los pagos recurrentes mediante tarjeta de crédito, débito u otros medios de pago electrónico.',
                                'Realizar el envío físico mensual de las cartas, sobres y materiales complementarios a la dirección proporcionada.',
                                'Emitir facturas electrónicas (CFDI) conforme a la legislación fiscal vigente.',
                                'Brindar atención al cliente, resolver dudas, quejas, aclaraciones y solicitudes de cancelación o devolución.',
                                'Verificar la identidad del titular para prevenir fraudes en transacciones electrónicas.',
                                'Cumplir con obligaciones legales, fiscales, contables y regulatorias aplicables.',
                                'Gestionar la logística de entrega con empresas de mensajería y paquetería.',
                            ]}
                        />
                        <h3 className={h3}>
                            B) Finalidades secundarias (no necesarias, pero
                            legítimas)
                        </h3>
                        <BulletList
                            items={[
                                'Enviar comunicaciones de marketing, promociones, ofertas especiales, lanzamientos de nuevas temporadas o ediciones especiales por correo electrónico, SMS o redes sociales.',
                                'Realizar encuestas de satisfacción y estudios de mercado para mejorar nuestros productos y servicios.',
                                'Personalizar su experiencia de usuario y recomendaciones de contenido dentro de nuestra plataforma.',
                                'Crear perfiles de consumo y preferencias para ofrecerle productos y servicios relevantes.',
                                'Compartir información con socios comerciales para fines publicitarios y de mercadotecnia.',
                                'Realizar campañas de remarketing y retargeting a través de plataformas publicitarias (Facebook Ads, Google Ads, etc.).',
                            ]}
                        />
                        <p>
                            En caso de que usted no desee que sus datos personales
                            sean tratados para las finalidades secundarias, podrá
                            manifestar su negativa enviando un correo electrónico
                            a contacto@historiasporcorreo.com con el asunto
                            &quot;Negativa Finalidades Secundarias&quot;. La
                            negativa para el uso de sus datos personales para
                            estas finalidades no será motivo para que le neguemos
                            los servicios que solicita o contrata con nosotros.
                        </p>
                    </Section>

                    <Section title="V. Transferencias de datos personales">
                        <p>
                            HISTORIAS POR CORREO podrá transferir sus datos
                            personales a los siguientes terceros, nacionales o
                            internacionales, sin requerir su consentimiento, de
                            conformidad con el artículo 37 de la Ley:
                        </p>
                        <TransferenciasTable />
                        <p>
                            HISTORIAS POR CORREO se asegurará de que los terceros
                            receptores de datos personales cumplan con las medidas
                            de seguridad y confidencialidad adecuadas, mediante la
                            celebración de contratos, convenios o cláusulas
                            contractuales que garanticen el tratamiento conforme
                            a la legislación aplicable.
                        </p>
                    </Section>

                    <Section title="VI. Derechos ARCO (acceso, rectificación, cancelación y oposición)">
                        <p>
                            Usted tiene derecho a conocer qué datos personales
                            tenemos de usted, para qué los utilizamos y las
                            condiciones del uso que les damos (Acceso). Asimismo,
                            es su derecho solicitar la corrección de su información
                            personal en caso de que esté desactualizada, sea
                            inexacta o incompleta (Rectificación); que la
                            eliminemos de nuestros registros o bases de datos
                            cuando considere que la misma no está siendo utilizada
                            adecuadamente (Cancelación); así como oponerse al uso
                            de sus datos personales para fines específicos
                            (Oposición). Estos derechos se conocen como derechos
                            ARCO.
                        </p>
                        <p>
                            Para el ejercicio de cualquiera de los derechos ARCO,
                            usted deberá presentar la solicitud respectiva a través
                            de los siguientes medios:
                        </p>
                        <BulletList
                            items={[
                                'Correo electrónico: contacto@historiasporcorreo.com',
                                'Correo postal: Calle Manuel M. Ponce #69, Int. 101, Col. Guadalupe Inn, C.P. 01020, Álvaro Obregón, CDMX.',
                            ]}
                        />
                        <p>
                            La solicitud deberá contener y acompañar lo siguiente:
                        </p>
                        <ol className="ml-1 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-[#1B3D6D]">
                            <li>
                                Nombre completo del titular y domicilio u otro
                                medio para comunicarle la respuesta a su solicitud.
                            </li>
                            <li>
                                Los documentos que acrediten la identidad o, en su
                                caso, la representación legal del titular (copia de
                                INE/IFE, pasaporte o documento oficial vigente con
                                fotografía).
                            </li>
                            <li>
                                La descripción clara y precisa de los datos
                                personales respecto de los que se busca ejercer
                                alguno de los derechos ARCO.
                            </li>
                            <li>
                                Cualquier otro elemento o documento que facilite la
                                localización de los datos personales.
                            </li>
                        </ol>
                        <p>
                            HISTORIAS POR CORREO comunicará al titular, en un plazo
                            máximo de 20 (veinte) días hábiles contados desde la
                            fecha en que se recibió la solicitud, la determinación
                            adoptada, a efecto de que, si resulta procedente, se
                            haga efectiva la misma dentro de los 15 (quince) días
                            hábiles siguientes a la fecha en que se comunique la
                            respuesta. Los plazos antes referidos podrán ser
                            ampliados una sola vez por un periodo igual, siempre
                            y cuando así lo justifiquen las circunstancias del caso.
                        </p>
                    </Section>

                    <Section title="VII. Revocación del consentimiento">
                        <p>
                            Usted puede revocar el consentimiento que, en su caso,
                            nos haya otorgado para el tratamiento de sus datos
                            personales. Sin embargo, es importante que tenga en
                            cuenta que no en todos los casos podremos atender su
                            solicitud o concluir el uso de forma inmediata, ya que
                            es posible que por alguna obligación legal requiramos
                            seguir tratando sus datos personales. Asimismo, usted
                            deberá considerar que, para ciertos fines, la revocación
                            de su consentimiento implicará que no le podamos seguir
                            prestando el servicio que nos solicitó, o la conclusión
                            de su relación con nosotros.
                        </p>
                        <p>
                            Para revocar su consentimiento deberá presentar su
                            solicitud a través del correo electrónico
                            contacto@historiasporcorreo.com con el asunto
                            &quot;Revocación de Consentimiento&quot;, siguiendo los
                            mismos requisitos señalados en la Sección VI del
                            presente Aviso.
                        </p>
                    </Section>

                    <Section title="VIII. Limitación de uso y divulgación de datos personales">
                        <p>
                            Con objeto de que usted pueda limitar el uso y
                            divulgación de su información personal, le ofrecemos los
                            siguientes medios:
                        </p>
                        <ul className="ml-1 list-disc space-y-2 pl-5 marker:text-[#1B3D6D]">
                            <li>
                                Inscripción en el Registro Público para Evitar
                                Publicidad (REPEP) de la PROFECO, disponible en{' '}
                                <a
                                    href="https://www.repep.profeco.gob.mx"
                                    className={linkClass}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    www.repep.profeco.gob.mx
                                </a>
                                .
                            </li>
                            <li>
                                Envío de correo electrónico a
                                contacto@historiasporcorreo.com solicitando la
                                inscripción en nuestra lista de exclusión para dejar
                                de recibir mensajes promocionales.
                            </li>
                            <li>
                                Uso del enlace de &quot;Cancelar suscripción&quot; o
                                &quot;Unsubscribe&quot; incluido en todos nuestros
                                correos electrónicos de marketing.
                            </li>
                        </ul>
                    </Section>

                    <Section title="IX. Uso de cookies, web beacons y tecnologías de rastreo">
                        <p>
                            Nuestro sitio web{' '}
                            <a
                                href="https://www.historiasporcorreo.com"
                                className={linkClass}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                www.historiasporcorreo.com
                            </a>{' '}
                            utiliza cookies, web beacons, píxeles de seguimiento y
                            otras tecnologías similares para mejorar su experiencia
                            de navegación, analizar el tráfico del sitio y
                            personalizar el contenido y la publicidad.
                        </p>
                        <p>Las cookies que utilizamos se clasifican en:</p>
                        <div className="space-y-3">
                            <p>
                                <strong>a) Cookies estrictamente necesarias:</strong>{' '}
                                Permiten la navegación del sitio web y el uso de
                                sus funciones esenciales (carrito de compras,
                                inicio de sesión, procesamiento de pagos). No
                                pueden desactivarse.
                            </p>
                            <p>
                                <strong>
                                    b) Cookies de rendimiento y analíticas:
                                </strong>{' '}
                                Recopilan información sobre cómo los visitantes
                                utilizan el sitio web (páginas más visitadas,
                                errores, tiempo de permanencia). Utilizamos Google
                                Analytics y herramientas similares.
                            </p>
                            <p>
                                <strong>c) Cookies de funcionalidad:</strong>{' '}
                                Permiten que el sitio recuerde las elecciones que
                                usted hace (idioma, región, preferencias de
                                contenido).
                            </p>
                            <p>
                                <strong>
                                    d) Cookies de publicidad y remarketing:
                                </strong>{' '}
                                Utilizamos el Píxel de Meta (Facebook), Google Ads
                                y otras plataformas publicitarias para mostrarle
                                anuncios relevantes basados en su visita a nuestro
                                sitio. Estas cookies pueden rastrear su actividad en
                                otros sitios web.
                            </p>
                        </div>
                        <p>
                            Usted puede deshabilitar o gestionar las cookies a
                            través de la configuración de su navegador de internet.
                            Sin embargo, la desactivación de ciertas cookies puede
                            afectar la funcionalidad del sitio web y la experiencia
                            de compra.
                        </p>
                    </Section>

                    <Section title="X. Política de suscripciones y pagos recurrentes">
                        <p>
                            Al contratar una suscripción con HISTORIAS POR CORREO,
                            usted autoriza expresamente el cargo recurrente mensual a
                            su tarjeta de crédito o débito por el monto
                            correspondiente al plan seleccionado. En relación con
                            los pagos recurrentes:
                        </p>
                        <BulletList
                            items={[
                                'El cargo se realizará de forma automática cada mes en la fecha de aniversario de su suscripción.',
                                'Usted podrá cancelar su suscripción en cualquier momento desde su cuenta de usuario en nuestra plataforma o enviando un correo electrónico a contacto@historiasporcorreo.com.',
                                'La cancelación surtirá efecto al término del periodo de suscripción vigente ya pagado.',
                                'Los datos de su tarjeta son procesados y almacenados exclusivamente por nuestro procesador de pagos certificado PCI-DSS. HISTORIAS POR CORREO no tiene acceso a los datos completos de su tarjeta.',
                                'En caso de que el cargo recurrente sea rechazado, se le notificará por correo electrónico y se realizarán hasta 3 (tres) intentos de cobro adicionales antes de suspender el servicio.',
                            ]}
                        />
                    </Section>

                    <Section title="XI. Medidas de seguridad">
                        <p>
                            HISTORIAS POR CORREO ha implementado y mantiene medidas
                            de seguridad administrativas, técnicas y físicas para
                            proteger sus datos personales contra daño, pérdida,
                            alteración, destrucción o el uso, acceso o tratamiento
                            no autorizado. Entre las medidas implementadas se
                            encuentran:
                        </p>
                        <BulletList
                            items={[
                                'Cifrado SSL/TLS (HTTPS) en toda la plataforma web para proteger la transmisión de datos.',
                                'Procesamiento de pagos a través de plataformas certificadas PCI-DSS Nivel 1.',
                                'Almacenamiento de contraseñas mediante algoritmos de hash seguros (bcrypt o equivalente).',
                                'Control de acceso restringido a bases de datos con datos personales, limitado al personal autorizado.',
                                'Respaldos periódicos de información en servidores seguros.',
                                'Capacitación al personal en materia de protección de datos personales y confidencialidad.',
                                'Políticas internas de gestión de incidentes de seguridad y vulneraciones de datos.',
                            ]}
                        />
                    </Section>

                    <Section title="XII. Vulneraciones de seguridad">
                        <p>
                            En caso de que ocurra una vulneración de seguridad en
                            cualquier fase del tratamiento de datos personales que
                            afecte de forma significativa los derechos patrimoniales
                            o morales de los titulares, HISTORIAS POR CORREO
                            informará de forma inmediata al titular afectado, a fin
                            de que este pueda tomar las medidas correspondientes
                            para la defensa de sus derechos, de conformidad con el
                            artículo 20 de la Ley.
                        </p>
                    </Section>

                    <Section title="XIII. Protección de datos de menores de edad">
                        <p>
                            Los servicios de HISTORIAS POR CORREO están dirigidos a
                            personas mayores de 18 años. No recabamos
                            intencionalmente datos personales de menores de edad.
                            En caso de que un padre o tutor tenga conocimiento de
                            que un menor ha proporcionado datos personales sin su
                            consentimiento, deberá contactarnos a
                            contacto@historiasporcorreo.com para proceder a la
                            eliminación inmediata de dicha información.
                        </p>
                    </Section>

                    <Section title="XIV. Modificaciones al aviso de privacidad">
                        <p>
                            HISTORIAS POR CORREO se reserva el derecho de efectuar
                            en cualquier momento modificaciones o actualizaciones al
                            presente Aviso de Privacidad, para la atención de
                            novedades legislativas, políticas internas, nuevas
                            prácticas comerciales o cambios en el modelo de negocio.
                        </p>
                        <p>
                            Las modificaciones estarán disponibles a través de los
                            siguientes medios:
                        </p>
                        <ul className="ml-1 list-disc space-y-2 pl-5 marker:text-[#1B3D6D]">
                            <li>
                                Publicación en nuestro sitio web:{' '}
                                <Link
                                    href={avisoDePrivacidad.url()}
                                    className={linkClass}
                                >
                                    www.historiasporcorreo.com/aviso-de-privacidad
                                </Link>
                            </li>
                            <li>
                                Notificación por correo electrónico a la
                                dirección registrada en su cuenta de usuario.
                            </li>
                        </ul>
                        <p>
                            El uso continuado de nuestros servicios después de la
                            publicación de las modificaciones constituirá la
                            aceptación de las mismas.
                        </p>
                    </Section>

                    <Section title="XV. Consentimiento">
                        <p>
                            Al proporcionar sus datos personales a través de
                            nuestro sitio web, formularios de registro, proceso de
                            compra o cualquier otro medio, y al aceptar los Términos
                            y Condiciones del servicio, usted manifiesta su
                            consentimiento expreso para que HISTORIAS POR CORREO
                            trate sus datos personales conforme a lo descrito en el
                            presente Aviso de Privacidad.
                        </p>
                        <p>
                            Si usted no está de acuerdo con los términos de este
                            Aviso de Privacidad, le pedimos no proporcionar sus datos
                            personales ni utilizar nuestros servicios.
                        </p>
                    </Section>

                    <Section title="XVI. Legislación aplicable y jurisdicción">
                        <p>
                            El presente Aviso de Privacidad se rige por la Ley
                            Federal de Protección de Datos Personales en Posesión de
                            los Particulares, su Reglamento, los Lineamientos del
                            Aviso de Privacidad y demás normatividad aplicable en los
                            Estados Unidos Mexicanos.
                        </p>
                        <p>
                            Para cualquier controversia derivada del presente
                            Aviso de Privacidad, las partes se someten a la
                            jurisdicción de los tribunales competentes de la Ciudad
                            de México, así como al Instituto Nacional de
                            Transparencia, Acceso a la Información y Protección de
                            Datos Personales (INAI) como autoridad garante en la
                            materia.
                        </p>
                    </Section>

                    <Section title="XVII. Autoridad garante">
                        <p>
                            Si usted considera que su derecho a la protección de
                            datos personales ha sido lesionado por alguna conducta u
                            omisión de nuestra parte, o presume alguna violación a
                            las disposiciones previstas en la Ley Federal de
                            Protección de Datos Personales en Posesión de los
                            Particulares, su Reglamento y demás ordenamientos
                            aplicables, podrá interponer su inconformidad o denuncia
                            ante el Instituto Nacional de Transparencia, Acceso a
                            la Información y Protección de Datos Personales (INAI).
                            Para mayor información, visite{' '}
                            <a
                                href="https://www.inai.org.mx"
                                className={linkClass}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                www.inai.org.mx
                            </a>
                            .
                        </p>
                    </Section>
                </div>

                <footer className="mt-12 rounded-lg border border-[#D7C181]/40 bg-[#FFFCF4] p-6 text-center md:mt-14 md:p-8">
                    <p className="text-[14px] font-semibold leading-relaxed text-[#1B3D6D] md:text-[15px]">
                        HISTORIAS POR CORREO, S.A.P.I. DE C.V.
                        <br />
                        Calle Manuel M. Ponce #69, Int. 101, Col. Guadalupe Inn,
                        C.P. 01020
                        <br />
                        Alcaldía Álvaro Obregón, Ciudad de México, México
                        <br />
                        contacto@historiasporcorreo.com
                    </p>
                    <p className="mt-4 text-[13px] text-[#636363]">
                        Fecha de última actualización: 26 de marzo de 2026
                    </p>
                    <p className="mt-8">
                        <Link
                            href={home.url()}
                            className="inline-flex items-center justify-center rounded-md border border-[#1B3D6D] bg-transparent px-5 py-2.5 text-[14px] font-medium text-[#1B3D6D] transition hover:bg-[#1B3D6D] hover:text-white md:text-[15px]"
                        >
                            Volver al inicio
                        </Link>
                    </p>
                </footer>
            </article>
        </ClienteLayout>
    );
}
