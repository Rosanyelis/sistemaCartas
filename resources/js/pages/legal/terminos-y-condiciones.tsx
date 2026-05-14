import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import ClienteLayout from '@/layouts/cliente-layout';
import { STOREFRONT_PATHS } from '@/constants/storefront-paths';

const prose = 'text-[15px] leading-[1.65] text-[#3e352f] md:text-[16px] md:leading-[1.7]';
const h2 =
    "mb-4 font-['Playfair_Display',serif] text-[20px] font-bold tracking-tight text-[#1B3D6D] md:text-[22px]";
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

export default function TerminosYCondiciones() {
    return (
        <ClienteLayout>
            <Head>
                <title>Términos y condiciones | Historias por Correo</title>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
            </Head>

            <article className="mx-auto max-w-3xl px-5 pb-20 pt-[100px] md:px-8 md:pb-28 md:pt-[120px]">
                <header className="mb-12 text-center md:mb-14">
                    <h1 className="mb-4 font-['Playfair_Display',serif] text-[22px] font-bold leading-tight tracking-tight text-[#1B3D6D] uppercase md:text-[26px]">
                        Términos y condiciones de uso y contratación
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
                        Última actualización: 27 de marzo de 2026
                    </p>
                </header>

                <div className="rounded-lg border border-[#e8e4d9] bg-white/60 p-6 shadow-sm md:p-8">
                    <Section title="I. Identidad del prestador del servicio">
                        <p>
                            Los presentes Términos y Condiciones de Uso y
                            Contratación (en adelante, los &quot;Términos y
                            Condiciones&quot;) regulan el acceso, navegación, uso
                            y contratación de los productos y servicios
                            ofrecidos a través del sitio web{' '}
                            <a
                                href="https://www.historiasporcorreo.com"
                                className={linkClass}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                www.historiasporcorreo.com
                            </a>{' '}
                            (en adelante, el &quot;Sitio Web&quot;), propiedad de
                            HISTORIAS POR CORREO, S.A.P.I. DE C.V. (en adelante,
                            &quot;HISTORIAS POR CORREO&quot;, &quot;la
                            Empresa&quot; o &quot;el Prestador&quot;).
                        </p>
                        <p>
                            HISTORIAS POR CORREO, S.A.P.I. DE C.V. es una
                            sociedad mercantil debidamente constituida conforme
                            a las leyes de los Estados Unidos Mexicanos, con
                            domicilio en Calle Manuel M. Ponce #69, Interior
                            101, Colonia Guadalupe Inn, C.P. 01020, Alcaldía
                            Álvaro Obregón, Ciudad de México, México.
                        </p>
                        <BulletList
                            items={[
                                'Correo de contacto general: contacto@historiasporcorreo.com',
                                'Correo para temas legales y de privacidad: contacto@historiasporcorreo.com',
                                'Teléfono: 55 2580 6124 en la Ciudad de México',
                            ]}
                        />
                    </Section>

                    <Section title="II. Aceptación de los términos y condiciones">
                        <p>
                            Al acceder, navegar, registrarse, crear una cuenta,
                            realizar una compra, contratar una suscripción o
                            utilizar de cualquier forma el Sitio Web, usted (en
                            adelante, el &quot;Usuario&quot; o el
                            &quot;Suscriptor&quot;) reconoce haber leído,
                            entendido y aceptado obligarse por estos Términos y
                            Condiciones, así como por el Aviso de Privacidad y
                            demás políticas publicadas en el Sitio Web.
                        </p>
                        <p>
                            Si el Usuario no está de acuerdo total o
                            parcialmente con los presentes Términos y Condiciones,
                            deberá abstenerse de acceder, utilizar o contratar
                            los servicios ofrecidos por HISTORIAS POR CORREO.
                        </p>
                    </Section>

                    <Section title="III. Objeto del servicio">
                        <p>
                            HISTORIAS POR CORREO ofrece una experiencia de
                            suscripción literaria y de entretenimiento inmersivo
                            que incluye el envío periódico de materiales físicos
                            y/o digitales, tales como cartas, textos
                            narrativos, recortes, pistas, impresos, objetos
                            temáticos, tarjetas con instrucciones de audio,
                            contenidos complementarios y demás elementos
                            relacionados con una narrativa o historia desarrollada
                            por la Empresa.
                        </p>
                        <p>
                            La contratación del servicio puede consistir en
                            suscripciones mensuales, trimestrales, semestrales,
                            anuales, ediciones especiales, ventas únicas u otros
                            formatos comerciales determinados por HISTORIAS POR
                            CORREO y publicados en el Sitio Web.
                        </p>
                        <p>
                            La Empresa se reserva el derecho de modificar,
                            ampliar, sustituir, pausar o descontinuar en
                            cualquier momento las características, contenidos,
                            componentes, presentaciones, frecuencia de entrega y
                            modalidades comerciales del servicio, sin perjuicio
                            de los derechos ya adquiridos por los usuarios
                            respecto del periodo previamente pagado.
                        </p>
                    </Section>

                    <Section title="IV. Capacidad legal y requisitos de contratación">
                        <p>
                            Únicamente podrán contratar los servicios de
                            HISTORIAS POR CORREO las personas físicas mayores de
                            18 (dieciocho) años con capacidad legal para
                            obligarse, así como las personas morales debidamente
                            representadas por quien cuente con facultades
                            suficientes para ello.
                        </p>
                        <p>
                            El Usuario manifiesta, bajo protesta de decir
                            verdad, que los datos proporcionados durante el
                            proceso de registro o compra son veraces, completos,
                            actuales y exactos. HISTORIAS POR CORREO no será
                            responsable por errores, omisiones o falsedades en
                            la información proporcionada por el Usuario.
                        </p>
                    </Section>

                    <Section title="V. Registro de cuenta y responsabilidad sobre credenciales">
                        <p>
                            Para acceder a determinadas funcionalidades del Sitio
                            Web o contratar ciertos servicios, el Usuario podrá
                            requerir crear una cuenta personal proporcionando
                            información como nombre, correo electrónico,
                            domicilio, teléfono, contraseña y datos de pago o
                            facturación.
                        </p>
                        <p>
                            El Usuario será el único responsable de mantener la
                            confidencialidad de sus credenciales de acceso y de
                            todas las actividades realizadas desde su cuenta. En
                            caso de uso no autorizado, robo de identidad,
                            pérdida de contraseña o acceso indebido, el Usuario
                            deberá notificarlo de inmediato a HISTORIAS POR
                            CORREO.
                        </p>
                        <p>
                            La Empresa se reserva el derecho de suspender,
                            restringir o cancelar cuentas cuando detecte
                            conductas fraudulentas, actividades sospechosas,
                            incumplimiento a estos Términos y Condiciones, uso
                            indebido de promociones o cualquier comportamiento
                            que pueda afectar la operación del servicio o los
                            derechos de terceros.
                        </p>
                    </Section>

                    <Section title="VI. Precios, impuestos, facturación y formas de pago">
                        <p>
                            Todos los precios mostrados en el Sitio Web están
                            expresados en pesos mexicanos (MXN), salvo que se
                            indique expresamente otra moneda, e incluyen o
                            excluyen los impuestos aplicables según se especifique
                            en la página de compra correspondiente.
                        </p>
                        <p>
                            HISTORIAS POR CORREO podrá actualizar en cualquier
                            momento los precios, promociones, descuentos, costos
                            de envío, costos por reexpedición y demás condiciones
                            económicas del servicio. Dichos cambios no afectarán
                            retroactivamente los pedidos ya confirmados o los
                            periodos de suscripción ya pagados, salvo disposición
                            expresa en sentido contrario aceptada por el Usuario.
                        </p>
                        <p>Las formas de pago podrán incluir, entre otras:</p>
                        <BulletList
                            items={[
                                'Tarjetas de crédito y débito.',
                                'Plataformas de pago electrónicas (Stripe, Mercado Pago, Conekta, PayPal u otras).',
                                'Transferencias electrónicas, cuando así se habilite.',
                                'Otros medios autorizados por la Empresa.',
                            ]}
                        />
                        <p>
                            Los comprobantes fiscales digitales por internet
                            (CFDI) se emitirán únicamente cuando el Usuario
                            proporcione correctamente su información fiscal
                            completa dentro de los plazos y conforme a la
                            normatividad aplicable en México.
                        </p>
                    </Section>

                    <Section title="VII. Suscripciones, renovación automática y cancelación">
                        <p>
                            Al contratar una suscripción, el Usuario autoriza de
                            manera expresa a HISTORIAS POR CORREO y/o a su
                            procesador de pagos a realizar cargos recurrentes
                            automáticos a la tarjeta o medio de pago registrado,
                            con la periodicidad correspondiente al plan
                            contratado.
                        </p>
                        <BulletList
                            items={[
                                'La suscripción podrá renovarse automáticamente al vencimiento de cada periodo, salvo que el Usuario la cancele oportunamente.',
                                'El Usuario podrá cancelar la renovación automática desde su cuenta o mediante solicitud escrita enviada a contacto@historiasporcorreo.com.',
                                'La cancelación surtirá efectos respecto de periodos futuros no cobrados. Los cargos ya realizados y los periodos ya facturados no serán reembolsables, salvo disposición legal aplicable o error atribuible a la Empresa.',
                                'En caso de rechazo, devolución o imposibilidad de procesar el cargo recurrente, la Empresa podrá intentar nuevamente el cobro y/o suspender temporalmente el servicio hasta la regularización del pago.',
                            ]}
                        />
                        <p>
                            El Usuario reconoce y acepta que, debido a la
                            naturaleza del servicio, la preparación, producción y
                            logística de cada envío puede iniciar con anticipación
                            a la fecha de entrega, por lo que la cancelación
                            posterior a cierto corte operativo podrá surtir efectos
                            hasta el siguiente periodo.
                        </p>
                    </Section>

                    <Section title="VIII. Envíos, entregas, domicilios y riesgos logísticos">
                        <p>
                            Los productos físicos contratados serán enviados al
                            domicilio proporcionado por el Usuario durante el
                            proceso de compra o en su perfil de cuenta. Es
                            responsabilidad exclusiva del Usuario proporcionar una
                            dirección completa, correcta y actualizada,
                            incluyendo referencias suficientes para facilitar la
                            entrega.
                        </p>
                        <BulletList
                            items={[
                                'HISTORIAS POR CORREO realizará esfuerzos razonables para entregar en los tiempos estimados publicados en el Sitio Web; sin embargo, los plazos de entrega son aproximados y podrán variar por causas ajenas a la Empresa.',
                                'La Empresa no será responsable por retrasos imputables a servicios de mensajería, saturación logística, fuerza mayor, desastres naturales, bloqueos, causas aduanales, conflictos laborales, contingencias sanitarias o eventos similares.',
                                'Si el paquete es devuelto por dirección incorrecta, ausencia reiterada, rechazo del destinatario o imposibilidad de localización, el reenvío podrá generar costos adicionales a cargo del Usuario.',
                                'El riesgo de pérdida o daño se transmitirá conforme a la legislación aplicable y las políticas del transportista, sin perjuicio de la obligación de la Empresa de atender reclamaciones razonables dentro de plazos prudentes.',
                            ]}
                        />
                    </Section>

                    <Section title="IX. Devoluciones, reembolsos, aclaraciones y garantías limitadas">
                        <p>
                            Por la naturaleza personalizada, editorial, temática,
                            de colección o de producción por pedido de los
                            productos de HISTORIAS POR CORREO, en principio no se
                            aceptan devoluciones ni se realizan reembolsos una vez
                            confirmado el pedido o procesado el periodo de
                            suscripción, salvo en los siguientes supuestos:
                        </p>
                        <BulletList
                            items={[
                                'Cobro duplicado o error imputable a la Empresa o al procesador de pagos.',
                                'Falta total de entrega atribuible a la Empresa, una vez agotados los procedimientos razonables de rastreo y aclaración.',
                                'Recepción de un producto materialmente distinto al contratado o con daño sustancial atribuible al empaque o producción de la Empresa.',
                            ]}
                        />
                        <p>
                            Toda aclaración deberá presentarse dentro de los 5
                            (cinco) días hábiles siguientes a la recepción del
                            paquete o a la fecha en que debió haberse efectuado el
                            cargo, acompañando evidencia suficiente, como
                            fotografías, número de pedido, guía de envío y
                            descripción clara de la incidencia.
                        </p>
                        <p>
                            HISTORIAS POR CORREO evaluará cada caso de manera
                            individual y, en su caso, podrá optar por: (i)
                            reenviar el producto, (ii) otorgar crédito en tienda,
                            (iii) aplicar un descuento futuro o (iv) realizar un
                            reembolso parcial o total, según corresponda.
                        </p>
                    </Section>

                    <Section title="X. Propiedad intelectual e industrial">
                        <p>
                            Todos los derechos de propiedad intelectual e
                            industrial sobre el Sitio Web, su diseño, código
                            fuente, textos, personajes, historias, cartas, nombres
                            comerciales, marcas, logotipos, ilustraciones,
                            composiciones gráficas, audios, grabaciones, guiones,
                            conceptos narrativos, contenido editorial,
                            fotografías, videos, materiales promocionales y
                            cualesquiera elementos asociados a HISTORIAS POR
                            CORREO, son propiedad exclusiva de la Empresa y/o de
                            sus licenciantes, y se encuentran protegidos por las
                            leyes mexicanas e internacionales aplicables.
                        </p>
                        <p>
                            La contratación del servicio no transfiere al Usuario
                            ningún derecho de propiedad sobre los contenidos. El
                            Usuario únicamente adquiere un derecho limitado,
                            personal, revocable, no exclusivo e intransferible
                            para disfrutar de la experiencia contratada para fines
                            estrictamente personales y no comerciales.
                        </p>
                        <p>
                            Queda estrictamente prohibido, sin autorización previa
                            y por escrito de HISTORIAS POR CORREO:
                        </p>
                        <BulletList
                            items={[
                                'Reproducir, copiar, escanear, digitalizar, vender, sublicenciar, distribuir o explotar comercialmente total o parcialmente los contenidos.',
                                'Crear obras derivadas, adaptaciones, novelas, dramatizaciones, podcasts, videos, cursos o productos basados en las historias o personajes.',
                                'Usar marcas, nombres, logotipos o elementos distintivos de la Empresa.',
                                'Remover avisos de derechos de autor o alterar contenidos con fines de reutilización.',
                            ]}
                        />
                        <p>
                            La infracción a esta cláusula facultará a HISTORIAS
                            POR CORREO a ejercer las acciones civiles, mercantiles,
                            administrativas y penales que resulten procedentes.
                        </p>
                    </Section>

                    <Section title="XI. Licencia limitada de uso del contenido">
                        <p>
                            Sin perjuicio de lo anterior, HISTORIAS POR CORREO
                            podrá permitir, a su sola discreción, ciertos usos
                            personales del contenido por parte del Usuario, como
                            la lectura, conservación física, exhibición privada o
                            compartición limitada en redes sociales con fines no
                            comerciales, siempre que ello no implique reproducción
                            integral, desnaturalización de la experiencia,
                            afectación de secretos narrativos o explotación
                            económica de los contenidos.
                        </p>
                        <p>
                            La Empresa podrá solicitar en cualquier momento la
                            remoción de publicaciones o contenidos generados por
                            el Usuario que afecten sus derechos, revelen elementos
                            clave de la experiencia narrativa o perjudiquen sus
                            intereses comerciales.
                        </p>
                    </Section>

                    <Section title="XII. Contenidos generados por el usuario y testimoniales">
                        <p>
                            Si el Usuario publica reseñas, testimonios,
                            comentarios, fotografías, videos, mensajes, etiquetas
                            o cualquier otro contenido relativo a HISTORIAS POR
                            CORREO en el Sitio Web o en redes sociales, garantiza
                            que cuenta con los derechos y autorizaciones
                            necesarios para hacerlo y que dicho contenido no
                            infringe derechos de terceros ni normas aplicables.
                        </p>
                        <p>
                            El Usuario otorga a HISTORIAS POR CORREO una licencia
                            no exclusiva, gratuita, revocable, mundial y por el
                            plazo máximo permitido por la ley para reproducir,
                            comunicar, publicar, adaptar y utilizar dicho
                            contenido con fines promocionales, publicitarios,
                            editoriales o comerciales, salvo que el Usuario
                            solicite expresamente su retiro cuando ello sea
                            procedente.
                        </p>
                    </Section>

                    <Section title="XIII. Usos prohibidos del sitio web">
                        <p>El Usuario se obliga a no realizar, entre otras, las siguientes conductas:</p>
                        <BulletList
                            items={[
                                'Utilizar el Sitio Web para fines ilícitos, fraudulentos, engañosos o contrarios a la moral, el orden público o las buenas costumbres.',
                                'Interferir con la seguridad, integridad, disponibilidad o funcionamiento técnico del Sitio Web.',
                                'Introducir virus, malware, bots, scrapers, spiders o sistemas automatizados no autorizados.',
                                'Suplantar identidades, falsear información o usar medios de pago sin autorización.',
                                'Realizar compras especulativas, abusar de promociones, reventas o esquemas de fraude amistoso (chargebacks indebidos).',
                                'Acceder sin autorización a cuentas, bases de datos, servidores o sistemas de la Empresa.',
                            ]}
                        />
                    </Section>

                    <Section title="XIV. Disponibilidad del sitio web y exclusión de garantías">
                        <p>
                            HISTORIAS POR CORREO procurará mantener disponible el
                            Sitio Web de manera continua; no obstante, no garantiza
                            que el acceso sea ininterrumpido, oportuno, seguro o
                            libre de errores. El Sitio Web y los servicios se
                            ofrecen en el estado en que se encuentran y según
                            disponibilidad.
                        </p>
                        <p>
                            En la máxima medida permitida por la ley, la Empresa no
                            garantiza que el Sitio Web esté libre de virus,
                            vulnerabilidades o fallas técnicas, aunque implementa
                            medidas razonables de seguridad. El Usuario reconoce
                            que el uso del Sitio Web implica riesgos inherentes
                            propios del entorno digital.
                        </p>
                    </Section>

                    <Section title="XV. Limitación de responsabilidad">
                        <p>
                            En la máxima medida permitida por la legislación
                            aplicable, HISTORIAS POR CORREO no será responsable por
                            daños indirectos, incidentales, especiales, punitivos o
                            consecuenciales, incluyendo pérdida de ingresos,
                            pérdida de datos, lucro cesante, pérdida de oportunidad
                            o afectaciones reputacionales derivadas del uso o
                            imposibilidad de uso del Sitio Web o del servicio.
                        </p>
                        <p>
                            La responsabilidad total acumulada de HISTORIAS POR
                            CORREO frente al Usuario, por cualquier causa de
                            acción relacionada con estos Términos y Condiciones,
                            no excederá en ningún caso la cantidad efectivamente
                            pagada por el Usuario a la Empresa durante los 3
                            (tres) meses inmediatos anteriores al evento que dio
                            origen a la reclamación.
                        </p>
                    </Section>

                    <Section title="XVI. Caso fortuito y fuerza mayor">
                        <p>
                            HISTORIAS POR CORREO no será responsable por
                            incumplimientos, retrasos o imposibilidades de
                            ejecución derivados de caso fortuito, fuerza mayor o
                            eventos fuera de su control razonable, incluyendo
                            fallas de proveedores, interrupciones logísticas,
                            conflictos laborales, desastres naturales, pandemias,
                            actos de autoridad, disturbios civiles, incendios,
                            inundaciones, ataques cibernéticos generalizados o
                            fallas en servicios de telecomunicaciones.
                        </p>
                    </Section>

                    <Section title="XVII. Protección de datos personales">
                        <p>
                            El tratamiento de los datos personales del Usuario se
                            regirá por el Aviso de Privacidad Integral de HISTORIAS
                            POR CORREO, disponible en el Sitio Web, el cual forma
                            parte integrante de los presentes Términos y
                            Condiciones para todos los efectos legales conducentes.
                        </p>
                    </Section>

                    <Section title="XVIII. Modificaciones a los términos y condiciones">
                        <p>
                            HISTORIAS POR CORREO podrá modificar o actualizar en
                            cualquier momento los presentes Términos y Condiciones
                            para adaptarlos a cambios legislativos, operativos,
                            tecnológicos o comerciales. Las modificaciones surtirán
                            efectos a partir de su publicación en el Sitio Web,
                            salvo que se indique expresamente una fecha distinta.
                        </p>
                        <p>
                            Cuando las modificaciones afecten sustancialmente los
                            derechos u obligaciones del Usuario, la Empresa
                            procurará notificarlo por medios razonables, como
                            correo electrónico o avisos dentro de la cuenta.
                        </p>
                    </Section>

                    <Section title="XIX. Legislación aplicable y jurisdicción">
                        <p>
                            Los presentes Términos y Condiciones se regirán e
                            interpretarán de conformidad con las leyes federales y
                            locales aplicables en los Estados Unidos Mexicanos,
                            particularmente en materia civil, mercantil, de
                            protección al consumidor, comercio electrónico,
                            propiedad intelectual y protección de datos
                            personales.
                        </p>
                        <p>
                            Para la interpretación, cumplimiento y ejecución de
                            estos Términos y Condiciones, las partes se someten
                            expresamente a la jurisdicción de los tribunales
                            competentes de la Ciudad de México, renunciando a
                            cualquier otro fuero que pudiera corresponderles por
                            razón de sus domicilios presentes o futuros, sin
                            perjuicio de los derechos irrenunciables que, en su
                            caso, correspondan al consumidor conforme a la
                            legislación aplicable.
                        </p>
                    </Section>

                    <Section title="XX. Contacto y notificaciones">
                        <p>
                            Para cualquier duda, aclaración, queja, solicitud o
                            notificación relacionada con estos Términos y
                            Condiciones, el Usuario podrá comunicarse con
                            HISTORIAS POR CORREO a través de:
                        </p>
                        <BulletList
                            items={[
                                'Correo electrónico general: contacto@historiasporcorreo.com',
                                'Correo electrónico de privacidad y temas legales: privacidad@historiasporcorreo.com',
                                'Domicilio: Calle Manuel M. Ponce #69, Interior 101, Colonia Guadalupe Inn, C.P. 01020, Alcaldía Álvaro Obregón, Ciudad de México, México.',
                                'Horario de atención: 9:00hrs a 17:00hrs de lunes a viernes.',
                            ]}
                        />
                    </Section>
                </div>

                <footer className="mt-12 rounded-lg border border-[#D7C181]/40 bg-[#FFFCF4] p-6 text-center md:mt-14 md:p-8">
                    <p className={`${prose} mx-auto max-w-2xl`}>
                        Al utilizar el Sitio Web y/o contratar cualquiera de los
                        servicios de HISTORIAS POR CORREO, el Usuario reconoce
                        expresamente que ha leído, entendido y aceptado íntegramente
                        estos Términos y Condiciones.
                    </p>
                    <p className="mt-6 text-[14px] font-semibold leading-relaxed text-[#1B3D6D] md:text-[15px]">
                        HISTORIAS POR CORREO, S.A.P.I. DE C.V.
                        <br />
                        Calle Manuel M. Ponce #69, Int. 101, Col. Guadalupe Inn,
                        C.P. 01020
                        <br />
                        Alcaldía Álvaro Obregón, Ciudad de México, México
                        <br />
                        <a
                            href="https://www.historiasporcorreo.com"
                            className={linkClass}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.historiasporcorreo.com
                        </a>
                    </p>
                    <p className="mt-4 text-[13px] text-[#636363]">
                        Fecha de última actualización: 27 de marzo de 2026
                    </p>
                    <p className="mt-8">
                        <Link
                            href={STOREFRONT_PATHS.home}
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
