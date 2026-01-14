const express = require('express');
const path = require('path');
const { db } = require('./database'); 
const app = express();

// 1. Configurar carpeta pública
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 2. RUTA API (Mantener igual)
app.get('/api/tasas', (req, res) => {
    const sql = `SELECT * FROM historial_tasas ORDER BY fecha DESC LIMIT 10`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: "success", data: rows });
    });
});

// 3. RUTA COMODÍN: Si alguien entra a cualquier ruta, enviamos el index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});