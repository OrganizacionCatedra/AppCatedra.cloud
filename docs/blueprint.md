# **App Name**: IA Solutions Configurator

## Core Features:

- Formulario de Captura de Leads: Captura datos del cliente (nombre, email, teléfono, empresa, país).
- Configurador de Productos: Configura y selecciona dinámicamente productos y opciones (bots, hosting, Gemini, etc.) del catálogo con cálculo de costos en tiempo real.
- Resumen Dinámico: Muestra un resumen fijo de los productos seleccionados, opciones, subtotales por categoría y costo total, siempre visible durante la configuración.
- Integración de Pagos: Integra con Stripe (por defecto) para el procesamiento de pagos. Abstrae el proveedor de pagos para soportar Mercado Pago/PayPal a través de adaptadores.
- Generación de Facturas: Genera una factura en PDF con logo, numeración, datos del cliente, detalles de los artículos, totales, términos y marca de tiempo en la zona horaria de América/Caracas.
- Notificación de Webhook: Después del pago exitoso, llama al webhook `POST {{BOT_WEBHOOK_URL}}/order/paid` con la carga útil especificada y adjunta la URL del PDF de la factura.
- Persistencia de Datos: Persiste todos los datos del pedido en PostgreSQL. Opcionalmente, sincroniza con Google Sheets/Baserow a través de un conmutador de variables de entorno.

## Style Guidelines:

- Color primario: Morado oscuro (#624CAB) para una estética moderna y centrada en la tecnología.
- Color de fondo: Gris muy oscuro (#121212) para soportar el enfoque en modo oscuro y minimizar el ruido visual.
- Color de acento: Verde eléctrico (#7CFC00) para resaltar acciones clave e información importante.
- Fuente del cuerpo y del encabezado: 'Inter', un sans-serif de estilo grotesco, conocido por su diseño limpio y legible.
- Diseño minimalista, priorizando la legibilidad y la claridad de la información. Uso de espacios en blanco para reducir la sobrecarga visual. Enfoque móvil primero, asegurando la capacidad de respuesta en todos los dispositivos.
- Micro-animaciones sutiles para crear interacciones fluidas y proporcionar retroalimentación al usuario.
- Iconos simples y modernos para representar las categorías y opciones de los productos.