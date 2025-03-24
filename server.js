const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const FILE_PATH = 'shoppingList.json';

// Middleware para manejar JSON y permitir peticiones desde el frontend
app.use(express.json());
app.use(cors());

// Cargar la lista desde el archivo JSON
app.get('/shopping-list', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer la lista', error: err });
    }
    res.json(JSON.parse(data));
  });
});

// Guardar la lista en el archivo JSON
app.post('/shopping-list', (req, res) => {
  fs.writeFile(FILE_PATH, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al guardar la lista', error: err });
    }
    res.json({ message: 'Lista guardada correctamente' });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/styles.css', (req, res) => {
  res.sendFile(__dirname + '/styles.css');
});

app.get('/script.js', (req, res) => {
  res.sendFile(__dirname + '/script.js');
});
