// 1. IMPORTACIÓN DE MÓDULOS
// En Python harías: import axios
// En Node.js (CommonJS) usamos 'require'. Aquí cargamos la librería para hacer peticiones HTTP.
const axios = require('axios');

// 2. DEFINICIÓN DE LA FUNCIÓN ASÍNCRONA
// 'async' indica que esta función devolverá una "Promesa" (un valor que estará listo en el futuro).
// Usamos parámetros por defecto: si no pasas nada, fiat será 'VES' (Bolívares) y tradeType será 'BUY'.
async function getBinanceP2P(fiat = 'VES', tradeType = 'BUY') {
    
    // 3. LA URL DEL API (Endpoint)
    // Esta es la dirección "secreta" que usa la web de Binance para cargar sus datos internos.
    const url = 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search';
    
    // 4. EL "PAYLOAD" O CUERPO DE LA PETICIÓN
    // Binance necesita saber EXACTAMENTE qué estás buscando. Esto es un objeto JSON.
    const data = {
        "asset": "USDT",        // La criptomoneda que queremos (Dólar cripto)
        "fiat": fiat,           // La moneda local (VES para bolívares, COP para pesos, etc.)
        "merchantCheck": false, // ¿Solo verificar usuarios pro? Lo ponemos en false para ver todos.
        "page": 1,              // Queremos ver la primera página de resultados.
        "payTypes": [],         // Aquí podrías filtrar por bancos (ej: ["Banesco"])
        "publisherType": null,  // Tipo de vendedor.
        "rows": 1,              // Solo tráeme el primer resultado (el más barato/mejor).
        "tradeType": tradeType  // 'BUY' para comprar (tasa de venta) o 'SELL' para vender (tasa de compra).
    };

    // 5. BLOQUE DE CONTROL DE ERRORES (Try/Catch)
    // Es igual al try/except de Python. Evita que el programa se caiga si no hay internet.
    try {
        // 'await' es la clave: el programa "pausa" aquí hasta que Binance responda.
        // axios.post envía la URL y los filtros que configuramos arriba.
        const response = await axios.post(url, data);

        // 6. NAVEGACIÓN POR EL JSON DE RESPUESTA
        // La respuesta de Binance es un objeto gigante. Entramos por niveles:
        // response.data (la respuesta) -> .data (el array de anuncios) -> [0] (el primero) -> .adv (anuncio) -> .price (el precio)
        const price = response.data.data[0].adv.price;

        console.log(`Tasas de Binance P2P para ${fiat}:`);
        console.log(`Precio actual: ${price} ${fiat}`);
        
        return price; // Devolvemos el valor para usarlo luego en la plataforma.

    } catch (error) {
        // Si la URL falla o Binance está caído, cae aquí.
        console.error("Error al consultar Binance:", error.message);
    }
}

// 7. EJECUCIÓN
// Llamamos a la función.
module.exports = { getBinanceP2P };