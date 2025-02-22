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
    searchBulkReceipt,
    payLoanInstallment,
    printReceipt,
    searchReceipt,
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

LoanRouter.post(
    applicationRoutes.loan.searchReceiptBulk,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    searchBulkReceipt
);

LoanRouter.post(
    applicationRoutes.loan.searchReceipt,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    searchReceipt
);

LoanRouter.put(
    applicationRoutes.loan.payLoanInstallment,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    payLoanInstallment
);

LoanRouter.get(
    applicationRoutes.loan.printReceipt,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    printReceipt
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
