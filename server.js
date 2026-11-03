const os = require('os');
const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 8080;
const APP_ENV = process.env.APP_ENV || 'local';

const CATEGORIAS = [
  'Gastos médicos',
  'Colegiaturas',
  'Intereses hipotecarios',
  'Donativos',
  'Otros',
];

// Sin base de datos: los gastos viven en memoria y se pierden al reiniciar el pod
const gastos = [];
let siguienteId = 1;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/salud', (req, res) => {
  res.json({ estado: 'ok', ambiente: APP_ENV, pod: os.hostname() });
});

app.get('/api/gastos', (req, res) => {
  res.json(gastos);
});

app.post('/api/gastos', (req, res) => {
  const { fecha, concepto, categoria, monto } = req.body || {};

  if (!fecha || !concepto || !categoria || monto === undefined || monto === null || monto === '') {
    return res.status(400).json({ error: 'Faltan datos: fecha, concepto, categoria y monto son obligatorios' });
  }
  if (!CATEGORIAS.includes(categoria)) {
    return res.status(400).json({ error: 'Categoría no válida' });
  }
  const montoNum = Number(monto);
  if (!Number.isFinite(montoNum) || montoNum <= 0) {
    return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
  }

  const gasto = {
    id: siguienteId++,
    fecha: String(fecha),
    concepto: String(concepto).trim(),
    categoria,
    monto: Math.round(montoNum * 100) / 100,
  };
  gastos.push(gasto);
  res.status(201).json(gasto);
});

app.get('/api/resumen', (req, res) => {
  const porCategoria = {};
  let total = 0;
  for (const g of gastos) {
    porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + g.monto;
    total += g.monto;
  }
  res.json({ porCategoria, total: Math.round(total * 100) / 100 });
});

app.listen(PORT, () => {
  console.log(`misgastos escuchando en el puerto ${PORT} (ambiente: ${APP_ENV})`);
});
