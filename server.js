const express = require('express');
const { db } = require('./database'); // Importamos la conexión a la DB
const app = express();
// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));
const PORT = 3000;

// Middleware para permitir que el servidor entienda JSON
app.use(express.json());

// RUTA PRINCIPAL: Para probar que el servidor funciona
app.get('/', (req, res) => {
    res.send('<h1>Servidor de Tasas Activo</h1><p>Usa /api/tasas para ver los datos.</p>');
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
        // Respondemos con los datos en formato JSON (lo que el navegador entiende)
        res.json({
            status: "success",
            data: rows
        });
    });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});