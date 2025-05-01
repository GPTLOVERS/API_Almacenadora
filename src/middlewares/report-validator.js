import {body} from 'express-validator';
import {validationsFields} from './fields-validator.js';
import {validateJWT} from './validate-token.js';
import {hasRoles} from './validate-role.js';
import {catchErrors} from './catch-errors.js';

export const listInventoryValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "EMPLOYEE_ROLE"),
    validationsFields,
    catchErrors
]

export const generateInventoryReportValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "EMPLOYEE_ROLE"),
    validationsFields,
    catchErrors
]

export const generateInventoryMovementsReportValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "EMPLOYEE_ROLE"),
    body('startDate')
        .optional()
        .isDate().withMessage('Start date must be a valid date'),
    body('endDate')
        .optional()
        .isDate().withMessage('End date must be a valid date'),
    validationsFields,
    catchErrors
]

export const generateAndSaveGraphImageValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "EMPLOYEE_ROLE", "CLIENT_ROLE"),
    validationsFields,
    catchErrors
]