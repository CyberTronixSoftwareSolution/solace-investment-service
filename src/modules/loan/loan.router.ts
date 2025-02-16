import { Router } from 'express';
import applicationRoutes from '../../applicationRoutes';
import authMiddleware from '../../middleware/auth.middleware';
import constants from '../../constant';
import {
    saveLoan,
    deleteLoan,
    getAllLoans,
    getLoanById,
    generateLoanCode,
} from './loan.controller';

const LoanRouter = Router();

//     getById: '/:id',

LoanRouter.post(
    applicationRoutes.loan.save,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    saveLoan
);

LoanRouter.get(
    applicationRoutes.loan.getLoanCode,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    generateLoanCode
);

LoanRouter.delete(
    applicationRoutes.loan.deleteById,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    deleteLoan
);

LoanRouter.get(
    applicationRoutes.loan.getAll,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    getAllLoans
);

LoanRouter.get(
    applicationRoutes.loan.getById,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    getLoanById
);

export default LoanRouter;
