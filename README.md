# misgastos

Aplicación web sencilla para registrar gastos personales deducibles (Node.js 22 + Express 5). Los gastos se guardan en memoria: se pierden al reiniciar el contenedor.

## API

| Método | Ruta           | Descripción                                   |
|--------|----------------|-----------------------------------------------|
| GET    | `/api/salud`   | Estado, ambiente (`APP_ENV`) y nombre del pod |
| GET    | `/api/gastos`  | Lista de gastos                               |
| POST   | `/api/gastos`  | Registra un gasto: `fecha`, `concepto`, `categoria`, `monto` (> 0) |
| GET    | `/api/resumen` | Total por categoría                           |

Variables de entorno: `PORT` (8080 por defecto) y `APP_ENV` (`local` por defecto).

## Correr en local

Con Node.js 22:

```bash
npm install
npm start
```

Con Docker (simulando el usuario aleatorio de OpenShift):

```bash
docker build -t misgastos .
docker run --rm -p 8080:8080 --user 1000650000:0 -e APP_ENV=docker misgastos
```

Abrir http://localhost:8080

## Desplegar en OpenShift (Developer Sandbox)

Desde la consola web: **+Add → Import from Git**, pegar la URL de este repositorio, elegir la estrategia **Dockerfile**, puerto 8080, y marcar *Create a route*.

O con la CLI `oc`:

```bash
oc new-app https://github.com/<usuario>/misgastos --strategy=docker --name=misgastos
oc set env deployment/misgastos APP_ENV=openshift
oc expose service/misgastos
oc get route misgastos
```

Para ver el balanceo entre pods: `oc scale deployment/misgastos --replicas=2` y recargar `/api/salud` (cada pod tiene su propia memoria).
