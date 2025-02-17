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
    getLoanDetails,
    handOverLoan,
} from './loan.controller';

const LoanRouter = Router();

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

LoanRouter.get(
    applicationRoutes.loan.getLoanDetails,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    getLoanDetails
);

LoanRouter.delete(
    applicationRoutes.loan.deleteById,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    deleteLoan
);

LoanRouter.put(
    applicationRoutes.loan.handOverLoan,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    handOverLoan
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
