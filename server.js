const express = require('express');
const path = require('path');
const { db } = require('./database'); // Importamos la conexión a la DB
const app = express();

// 1. IMPORTANTE: Servir archivos estáticos DESDE la carpeta 'public'
// Esto permite que el navegador encuentre el index.html, CSS y JS del frontend
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para permitir que el servidor entienda JSON
app.use(express.json());

// 2. RUTA PRINCIPAL: Ahora enviamos el archivo index.html físicamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API ENDPOINT: Aquí es donde el Frontend buscará la información
app.get('/api/tasas', (req, res) => {
    const sql = `SELECT * FROM historial_tasas ORDER BY fecha DESC LIMIT 10`;
    
    // Consultamos la base de datos
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Respondemos con los datos en formato JSON
        res.json({
            status: "success",
            data: rows
        });
    });
});

// El puerto se ajusta dinámicamente para Vercel o local (3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});