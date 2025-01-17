import { Router } from 'express';
import applicationRoutes from './applicationRoutes';
import StoreRouter from './modules/store/store.route';

const router = Router();

// Use route modules
router.use(applicationRoutes.store.base, StoreRouter);

export default router;
