import { Router } from 'express';
import applicationRoutes from '../../applicationRoutes';
import authMiddleware from '../../middleware/auth.middleware';
import constants from '../../constant';
import {
    getLoanStatistic,
    getMonthlyCollectionSummary,
} from './dashboard.controller';

const DashboardRouter = Router();

DashboardRouter.get(
    applicationRoutes.dashboard.getStatistic,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    getLoanStatistic
);

DashboardRouter.get(
    applicationRoutes.dashboard.getCollectionSummary,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    getMonthlyCollectionSummary
);
export default DashboardRouter;
