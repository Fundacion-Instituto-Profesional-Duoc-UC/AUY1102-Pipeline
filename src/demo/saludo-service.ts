import express from 'express';
 
const app = express();
 
// Endpoint de demostración: devuelve un saludo personalizado.
// VULNERABLE: inserta lo que escribe el usuario directamente en el HTML.
app.get('/saludo', (req, res) => {
  const nombre = req.query.nombre as string;
  res.send(`<h1>Hola ${nombre}</h1>`);
});
 
app.listen(3000);