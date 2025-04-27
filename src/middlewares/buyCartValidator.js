import { body, param } from "express-validator";
import { validationsFields } from "./fields-validator.js";
import { validateJWT } from "./validate-token.js";
import { catchErrors } from "./catch-errors.js";
import { buyCart, codeExist } from "../helpers/db-validators.js";

export const registerBuyCartValidator = [
    validateJWT,
    body("user").not().isEmpty().withMessage("User is required").isMongoId().withMessage("This id is'nt valid"),
    body("products").notEmpty().withMessage("The products is required").custom(codeExist),
    validationsFields,
    catchErrors
];

export const payCartValidator =[
    validateJWT,
    param("uid").notEmpty().withMessage("The uid is required").custom(buyCart),
    validationsFields,
    catchErrors
]

export const editCartValidator = [
    validateJWT,
    param("uid").notEmpty().withMessage("The uid is required").custom(buyCart),
    body("addProduct").optional().custom(codeExist),
    body("deleteProduct").optional().custom(codeExist),
    validationsFields,
    catchErrors
]

export const deleteCartValidator = [
    validateJWT,
    param("uid").notEmpty().withMessage("The uid is required").custom(buyCart),
    validationsFields,
    catchErrors
]