import { Router } from "express";
import { getLatestInventoryReport, getLatestMovementReport , generateInventoryReport, generateInventoryMovementsReport, generateAndSaveGraphImage } from "./report.controller.js";
import { generateInventoryReportValidator, generateInventoryMovementsReportValidator, generateAndSaveGraphImageValidator } from "../middlewares/report-validator.js";

const router = Router();

/**
 * @swagger
 * /generateInventoryReport:
 *   post:
 *     summary: Generar reporte de inventario
 *     description: Genera un archivo Excel con el listado actual de productos (nombre, descripción, precio, stock, valor total).
 *     tags:
 *       - Reportes
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {}
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente
 *       500:
 *         description: Error al generar el reporte
 */
router.post("/generateInventoryReport", generateInventoryReportValidator, generateInventoryReport);

/**
 * @swagger
 * /generateInventoryMovementsReport:
 *   post:
 *     summary: Generar reporte de movimientos de inventario
 *     description: Genera un archivo Excel con entradas y salidas de productos en un periodo de fechas opcional.
 *     tags:
 *       - Reportes
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-30"
 *     responses:
 *       200:
 *         description: Reporte generado o mensaje si no hubo movimientos
 *       500:
 *         description: Error al generar el reporte
 */
router.post("/generateInventoryMovementsReport", generateInventoryMovementsReportValidator, generateInventoryMovementsReport);

/**
 * @swagger
 * /generateAndSaveGraphImage:
 *   get:
 *     summary: Generar gráfica como imagen
 *     description: Genera una gráfica en formato imagen PNG sobre productos más vendidos o actividad por producto.
 *     tags:
 *       - Reportes
 *     parameters:
 *       - in: query
 *         name: productosMasVendidos
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Si se desea graficar los productos más vendidos
 *       - in: query
 *         name: actividadPorFecha
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Si se desea graficar ingresos y salidas por producto
 *     responses:
 *       200:
 *         description: Imagen generada correctamente
 *       400:
 *         description: Parámetros insuficientes
 *       500:
 *         description: Error al generar la imagen
 */
router.post("/generateAndSaveGraphImage", generateAndSaveGraphImageValidator, generateAndSaveGraphImage);

/**
 * @swagger
 * /getLatestInventoryReport:
 *   get:
 *     summary: Descargar el último reporte de inventario
 *     description: Redirige al archivo Excel más reciente generado del inventario.
 *     tags:
 *       - Reportes
 *     responses:
 *       302:
 *         description: Redirección al archivo descargable
 *       404:
 *         description: No hay reportes disponibles
 */
router.get("/getLatestInventoryReport", getLatestInventoryReport);

router.get("/getLatestMovementReport", getLatestMovementReport);

export default router;