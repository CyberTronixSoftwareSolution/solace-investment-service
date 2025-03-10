import { Router } from 'express';
import applicationRoutes from './applicationRoutes';
import StoreRouter from './modules/store/store.route';
import UserRouter from './modules/user/user.router';
import AuthRouter from './modules/auth/auth.router';
import ProductRouter from './modules/product/product.router';
import LoanRouter from './modules/loan/loan.router';
import ReportRouter from './modules/report/report.router';
import DashboardRouter from './modules/dashboard/dashboard.router';

const router = Router();

// Use route modules
router.use(applicationRoutes.store.base, StoreRouter);
router.use(applicationRoutes.user.base, UserRouter);
router.use(applicationRoutes.auth.base, AuthRouter);
router.use(applicationRoutes.product.base, ProductRouter);
router.use(applicationRoutes.loan.base, LoanRouter);
router.use(applicationRoutes.report.base, ReportRouter);
router.use(applicationRoutes.dashboard.base, DashboardRouter);

export default router;
