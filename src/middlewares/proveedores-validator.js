import { body, param } from "express-validator";
import { validationsFields } from "./fields-validator.js";
import { validateJWT } from "./validate-token.js";
import { hasRoles } from "./validate-role.js";
import { catchErrors } from "./catch-errors.js";
import { proveedorExist } from "../helpers/db-validators.js";

export const registerProveedorValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("name").not().isEmpty().withMessage("Name is required").isString().withMessage("Name must be a string"),
    body("company").not().isEmpty().withMessage("Company name is required").isString().withMessage("Company must be a string"),
    body("email").not().isEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
    body("phone").not().isEmpty().withMessage("Phone number is required").isNumeric().withMessage("Phone must be numeric"),
    body("address").not().isEmpty().withMessage("Address is required").isString().withMessage("Address must be a string"),
    validationsFields,
    catchErrors
];

export const findProveedorValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").isMongoId().withMessage("ID is not valid").notEmpty().withMessage("ID is required").custom(proveedorExist),
    validationsFields,
    catchErrors
];

export const updateProveedorValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").isMongoId().withMessage("ID is not valid").notEmpty().withMessage("ID is required").custom(proveedorExist),
    body("name").optional().isString().withMessage("Name must be a string"),
    body("company").optional().isString().withMessage("Company must be a string"),
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("phone").optional().isNumeric().withMessage("Phone must be numeric"),
    body("address").optional().isString().withMessage("Address must be a string"),
    validationsFields,
    catchErrors
];

export const deleteProveedorValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").isMongoId().withMessage("ID is not valid").notEmpty().withMessage("ID is required").custom(proveedorExist),
    validationsFields,
    catchErrors
];