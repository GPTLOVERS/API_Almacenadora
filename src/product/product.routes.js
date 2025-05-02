import { Router } from "express";
import { registerProduct , listProduct, updateProduct, deleteProduct, findProduct, popularityProduct, issueProduct, filterProduct} from "./product.controller.js";
import { registerProductValidator, updateProductValidator, deleteProductValidator , findProductValidator, filterProductValidator} from "../middlewares/product-validator.js";
import { hasRoles } from "../middlewares/validate-role.js";

const router = Router();

/**
 * @swagger
 * /registerProduct/:
 *   post:
 *     summary: Registrar un nuevo producto
 *     description: Registra un nuevo producto en la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Product
 *     responses:
 *       201:
 *         description: Producto registrado correctamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post(
    "/registerProduct/",
    registerProductValidator,
    registerProduct
);

/**
 * @swagger
 * /listProduct/:
 *   get:
 *     summary: Obtener lista de productos
 *     description: Obtiene una lista de todos los productos registrados.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Lista de productos
 *       403:
 *         description: No autorizado
 */
router.get(
    "/listProduct/",
    listProduct
);

/**
 * @swagger
 * /updateProduct/{uid}:
 *   patch:
 *     summary: Actualizar información de un producto
 *     description: Actualiza la información de un producto por su ID.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID del producto.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.patch(
    "/updateProduct/:uid",
    updateProductValidator,
    updateProduct
);

/**
 * @swagger
 * /deleteProduct/{uid}:
 *   patch:
 *     summary: Eliminar un producto
 *     description: Elimina un producto por su ID.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID del producto a eliminar.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.patch(
    "/deleteProduct/:uid",
    deleteProductValidator,
    deleteProduct
);

/**
 * @swagger
 * /findProduct/{uid}:
 *   get:
 *     summary: Obtener un producto por ID
 *     description: Obtiene los detalles de un producto por su ID.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID del producto.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get(
    "/findProduct/:uid",
    findProductValidator,
    findProduct
);

router.get(
    "/popularityProduct",
    popularityProduct
)

router.patch(
    "/issueProduct/:uid",
    issueProduct
)

router.get(
    "/filterProduct",
    filterProductValidator,
    filterProduct
)

export default router;
