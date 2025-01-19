import { Router } from 'express';
import applicationRoutes from '../../applicationRoutes';
import {
    blacklistUser,
    getAllUsers,
    getUserById,
    saveUser,
    whitelistUser,
    updateUser,
    deleteUser,
    getNewCustomerCode,
} from './user.controller';
import authMiddleware from '../../middleware/auth.middleware';
import constants from '../../constant';

const UserRouter = Router();

UserRouter.post(
    applicationRoutes.user.save,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    saveUser
);

UserRouter.put(
    applicationRoutes.user.update,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    updateUser
);

UserRouter.put(
    applicationRoutes.user.blacklistUser,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    blacklistUser
);

UserRouter.put(
    applicationRoutes.user.whitelistUser,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    whitelistUser
);

UserRouter.get(
    applicationRoutes.user.getAll,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        ,
        constants.USER.ROLES.ADMIN,
    ]),
    getAllUsers
);

UserRouter.get(
    applicationRoutes.user.getById,
    authMiddleware.authorize(),
    getUserById
);

UserRouter.delete(
    applicationRoutes.user.deleteById,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        ,
        constants.USER.ROLES.ADMIN,
    ]),
    deleteUser
);

UserRouter.get(
    applicationRoutes.user.getCustomerCode,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    getNewCustomerCode
);

export default UserRouter;
