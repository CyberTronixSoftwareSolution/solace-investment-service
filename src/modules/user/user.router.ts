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
    validateUserData,
    getProfile,
    searchParamsUser,
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

UserRouter.put(
    applicationRoutes.user.update,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    updateUser
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
    applicationRoutes.user.searchByParam,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    searchParamsUser
);

UserRouter.get(
    applicationRoutes.user.validateUserData,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    validateUserData
);

UserRouter.get(
    applicationRoutes.user.getProfile,
    authMiddleware.authorize([
        constants.USER.ROLES.SUPERADMIN,
        constants.USER.ROLES.ADMIN,
    ]),
    getProfile
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
