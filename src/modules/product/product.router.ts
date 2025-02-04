import { Router } from 'express';
import applicationRoutes from '../../applicationRoutes';
import authMiddleware from '../../middleware/auth.middleware';
import constants from '../../constant';
import {
    activeInactive,
    deleteProduct,
    getAllProducts,
    getProductById,
    saveProduct,
    updateProduct,
} from './product.controller';

const ProductRouter = Router();

// save: '/',
ProductRouter.post(
    applicationRoutes.product.save,
    authMiddleware.authorize([constants.USER.ROLES.SUPERADMIN]),
    saveProduct
);

// update: '/update/:id',
ProductRouter.put(
    applicationRoutes.product.update,
    authMiddleware.authorize([constants.USER.ROLES.SUPERADMIN]),
    updateProduct
);

// deleteById: '/delete/:id',
ProductRouter.delete(
    applicationRoutes.product.deleteById,
    authMiddleware.authorize([constants.USER.ROLES.SUPERADMIN]),
    deleteProduct
);

// getAll: '/',
ProductRouter.get(
    applicationRoutes.product.getAll,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    getAllProducts
);

// activeInactive: '/activeInactive/:id',
ProductRouter.put(
    applicationRoutes.product.activeInactive,
    authMiddleware.authorize([constants.USER.ROLES.SUPERADMIN]),
    activeInactive
);

// getById: '/:id',
ProductRouter.get(
    applicationRoutes.product.getById,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    getProductById
);

export default ProductRouter;
