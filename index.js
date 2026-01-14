// 1. IMPORTACIONES
const { getBinanceP2P } = require('./binance');
const { getBCV } = require('./bcv');
const { guardarPrecio } = require('./database');

// 2. FUNCIÓN PRINCIPAL (EL MOTOR)
async function actualizarTasas() {
    console.log(`--- Iniciando actualización: ${new Date().toLocaleString()} ---`);

    try {
        // Obtenemos datos de Binance (USD)
        const tasaBinance = await getBinanceP2P('VES', 'BUY');
        if (tasaBinance) guardarPrecio('Binance', 'USD', tasaBinance);

        // Obtenemos datos del BCV (USD y EUR)
        const tasasBCV = await getBCV();
        if (tasasBCV) {
            guardarPrecio('BCV', 'USD', tasasBCV.dolar);
            guardarPrecio('BCV', 'EUR', tasasBCV.euro);
        }

        console.log("--- Actualización completada con éxito ---");
    } catch (error) {
        console.error("Error en el ciclo principal:", error.message);
    }
}

// 3. EJECUCIÓN AUTOMÁTICA
// Ejecutar de inmediato al abrir el programa
actualizarTasas();

// Ejecutar cada 30 minutos (1.800.000 milisegundos)
setInterval(actualizarTasas, 1800000);