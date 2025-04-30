import { Router } from "express";
import { createProveedor, getProveedores, getProveedorById, updateProveedor, deleteProveedor } from "./proveedores.controller.js";
import { registerProveedorValidator, findProveedorValidator, updateProveedorValidator, deleteProveedorValidator } from "../middlewares/proveedores-validator.js";
import { validateJWT } from "../middlewares/validate-token.js";
import { hasRoles } from "../middlewares/validate-role.js";

const router = Router();

/**
 * @swagger
 * /createProveedor:
 *   post:
 *     summary: Crear un nuevo proveedor
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - company
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del proveedor
 *               company:
 *                 type: string
 *                 description: Nombre de la compañía
 *               email:
 *                 type: string
 *                 description: Correo electrónico del proveedor
 *               phone:
 *                 type: string
 *                 description: Número de teléfono del proveedor
 *               address:
 *                 type: string
 *                 description: Dirección del proveedor
 *     responses:
 *       201:
 *         description: Proveedor creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post(
    "/createProveedor",
    [validateJWT, hasRoles("ADMIN_ROLE"), registerProveedorValidator],
    createProveedor
);

/**
 * @swagger
 * /getProveedores:
 *   get:
 *     summary: Obtener todos los proveedores
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proveedores
 *       500:
 *         description: Error del servidor
 */
router.get(
    "/getProveedores",
    [validateJWT, hasRoles("ADMIN_ROLE")],
    getProveedores
);

/**
 * @swagger
 * /getProveedorById/{id}:
 *   get:
 *     summary: Obtener un proveedor por ID
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proveedor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proveedor encontrado
 *       404:
 *         description: Proveedor no encontrado
 */
router.get(
    "/getProveedorById/:id",
    [validateJWT, hasRoles("ADMIN_ROLE"), findProveedorValidator],
    getProveedorById
);

/**
 * @swagger
 * /updateProveedor/{id}:
 *   put:
 *     summary: Actualizar un proveedor
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proveedor
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del proveedor
 *               company:
 *                 type: string
 *                 description: Nombre de la compañía
 *               email:
 *                 type: string
 *                 description: Correo electrónico del proveedor
 *               phone:
 *                 type: string
 *                 description: Número de teléfono del proveedor
 *               address:
 *                 type: string
 *                 description: Dirección del proveedor
 *     responses:
 *       200:
 *         description: Proveedor actualizado exitosamente
 *       404:
 *         description: Proveedor no encontrado
 */
router.put(
    "/updateProveedor/:id",
    [validateJWT, hasRoles("ADMIN_ROLE"), updateProveedorValidator],
    updateProveedor
);

/**
 * @swagger
 * /deleteProveedor/{id}:
 *   patch:
 *     summary: Eliminar un proveedor
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proveedor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proveedor eliminado exitosamente
 *       404:
 *         description: Proveedor no encontrado
 */
router.patch(
    "/deleteProveedor/:id",
    [validateJWT, hasRoles("ADMIN_ROLE"), deleteProveedorValidator],
    deleteProveedor
);

export default router;