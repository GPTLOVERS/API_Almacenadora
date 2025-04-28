import Batch from "../batch/Batch.model.js"
import { body, param } from "express-validator"
import { catchErrors } from "./catch-errors.js"
import { validationsFields } from "./fields-validator.js"
import { hasRoles } from "./validate-role.js"
import { validateJWT } from "./validate-token.js"
import { batchExist } from "../helpers/db-validators.js"

export const createBatchValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("noBatch").not().isEmpty().withMessage("Number of the batch is required."),
    body("type").not().isEmpty().withMessage("Type of the batch is required."),
    body("product").not().isEmpty().withMessage("Product of this batch is required."),
    body("proveedor").not().isEmpty().withMessage("Supplier of this batch is required."),
    body("dateOfEntry").not().isEmpty().withMessage("Date of entry of this batch."),
    validationsFields,
    catchErrors
];

export const listBatchValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    validationsFields,
    catchErrors
]

export const updateBatchValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("UID isn't valid").notEmpty().withMessage("UID is required").custom(batchExist),
    validationsFields,
    catchErrors
]

export const deleteBatchValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("UID isn't valid").notEmpty().withMessage("UID is required").custom(batchExist),
    validationsFields,
    catchErrors

]