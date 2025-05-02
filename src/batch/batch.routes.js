import { Router } from "express";
import { getBatchById,createBatch, deleteBatch, listBatches, updateBatch } from "./batch.controller.js";
import { findBatchByIdValidator,createBatchValidator, deleteBatchValidator, listBatchValidator, updateBatchValidator } from "../middlewares/batch-validator.js";

const router = Router();

/**
 * @swagger
 * /createBatch:
 *   post:
 *     summary: Create a new batch.
 *     tags: [Batch]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Batch A"
 *               quantity:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Batch created successfully.
 *       400:
 *         description: Validation error.
 */

router.post("/createBatch", createBatchValidator, createBatch)

/**
 * @swagger
 * /getBatch:
 *   get:
 *     summary: Retrieve a list of batches.
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: List of batches retrieved successfully.
 *       400:
 *         description: Validation error.
 */

router.get("/getBatch", listBatchValidator, listBatches)

/**
 * @swagger
 * /updateBatch/{uid}:
 *   put:
 *     summary: Update an existing batch.
 *     tags: [Batch]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the batch.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Batch A"
 *               quantity:
 *                 type: integer
 *                 example: 150
 *     responses:
 *       200:
 *         description: Batch updated successfully.
 *       404:
 *         description: Batch not found.
 */

router.put("/updateBatch/:uid", updateBatchValidator, updateBatch)

/**
 * @swagger
 * /deleteBatch/{uid}:
 *   delete:
 *     summary: Delete a batch.
 *     tags: [Batch]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the batch.
 *     responses:
 *       200:
 *         description: Batch deleted successfully.
 *       404:
 *         description: Batch not found.
 */

router.delete("/deleteBatch/:uid", deleteBatchValidator, deleteBatch)

router.get("/findBatch/:uid",findBatchByIdValidator, getBatchById)


export default router;