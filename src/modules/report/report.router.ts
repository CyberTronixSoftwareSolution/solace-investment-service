import { Router } from 'express';
import applicationRoutes from '../../applicationRoutes';
import authMiddleware from '../../middleware/auth.middleware';
import constants from '../../constant';
import {
    getRepaymentReportData,
    getDeductionChargeReportData,
    getInvestmentReportData,
} from './report.controller';

const ReportRouter = Router();

// repaymentReport
ReportRouter.post(
    applicationRoutes.report.repaymentReport,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    getRepaymentReportData
);

// deductionChargeReport
ReportRouter.post(
    applicationRoutes.report.deductionChargeReport,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    getDeductionChargeReportData
);

ReportRouter.post(
    applicationRoutes.report.investmentReport,
    authMiddleware.authorize([constants.USER.ROLES.SUPERADMIN]),
    getInvestmentReportData
);
export default ReportRouter;
