import { Router } from "express";
import { createEmployee, listEmployees, updateEmployee, deleteEmployee } from "./employee.controller.js";
import { validateJWT } from "../middlewares/validate-token.js";
import { hasRoles } from "../middlewares/validate-role.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management endpoints
 */

/**
 * @swagger
 * /createEmployee/:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: First name of the employee
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Last name of the employee
 *                 example: Doe
 *               email:
 *                 type: string
 *                 description: Email of the employee
 *                 example: johndoe@example.com
 *               role:
 *                 type: string
 *                 description: Role of the employee
 *                 enum: [ADMIN_ROLE, EMPLOYEE_ROLE]
 *                 example: EMPLOYEE_ROLE
 *               phone:
 *                 type: string
 *                 description: Phone number of the employee
 *                 example: 12345678
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.post("/createEmployee/", validateJWT, hasRoles("ADMIN_ROLE"), createEmployee);

/**
 * @swagger
 * /:
 *   get:
 *     summary: List all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of employees to return
 *       - in: query
 *         name: desde
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Starting index for pagination
 *     responses:
 *       200:
 *         description: List of employees
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.get("/", validateJWT, hasRoles("ADMIN_ROLE"), listEmployees);

/**
 * @swagger
 * /updateEmployee/{uid}:
 *   put:
 *     summary: Update an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: First name of the employee
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Last name of the employee
 *                 example: Doe
 *               email:
 *                 type: string
 *                 description: Email of the employee
 *                 example: johndoe@example.com
 *               role:
 *                 type: string
 *                 description: Role of the employee
 *                 enum: [ADMIN_ROLE, EMPLOYEE_ROLE]
 *                 example: EMPLOYEE_ROLE
 *               phone:
 *                 type: string
 *                 description: Phone number of the employee
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.put("/updateEmployee/:uid", validateJWT, hasRoles("ADMIN_ROLE"), updateEmployee);

/**
 * @swagger
 * /deleteEmployee/{uid}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteEmployee/:uid", validateJWT, hasRoles("ADMIN_ROLE"), deleteEmployee);

export default router;