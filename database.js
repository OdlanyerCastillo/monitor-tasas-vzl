// 1. IMPORTACIÓN
// .verbose() nos da mensajes de error más detallados en la consola, ideal para aprender.
const sqlite3 = require('sqlite3').verbose();

// 2. CONEXIÓN / CREACIÓN DEL ARCHIVO
// Si el archivo 'precios.db' no existe, Node lo creará automáticamente.
const db = new sqlite3.Database('./precios.db', (err) => {
    if (err) {
        console.error("Error al abrir la base de datos:", err.message);
    } else {
        console.log("Conectado a la base de datos SQLite.");
    }
});

// 3. CREACIÓN DE LA TABLA (Si no existe)
// Usamos db.serialize para asegurar que las órdenes se ejecuten en orden.
db.serialize(() => {
    // Definimos la estructura: fecha, fuente (Binance/BCV), moneda (USD/EUR) y el precio.
    db.run(`
        CREATE TABLE IF NOT EXISTS historial_tasas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            fuente TEXT,
            moneda TEXT,
            precio REAL
        )
    `, (err) => {
        if (err) console.error("Error creando tabla:", err.message);
        else console.log("Tabla 'historial_tasas' lista.");
    });
});

// 4. FUNCIÓN PARA INSERTAR DATOS
// Esta función la llamaremos más adelante desde nuestro script principal.
function guardarPrecio(fuente, moneda, precio) {
    const sql = `INSERT INTO historial_tasas (fuente, moneda, precio) VALUES (?, ?, ?)`;
    
    // El precio viene a veces con comas (del BCV), lo convertimos a número decimal (float)
    const precioLimpio = parseFloat(precio.toString().replace(',', '.'));

    db.run(sql, [fuente, moneda, precioLimpio], function(err) {
        if (err) {
            return console.error("Error al insertar:", err.message);
        }
        console.log(`Dato guardado: ${fuente} - ${moneda}: ${precioLimpio}`);
    });
}

// Exportamos la función para poder usarla en otros archivos (como harías con un import en Python)
module.exports = { guardarPrecio, db };