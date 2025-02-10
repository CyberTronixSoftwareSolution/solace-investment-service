import constants from './constant';

const applicationRoutes = {
    store: {
        base: '/store',
        uploadFile: '/upload',
        uploadMultipleFiles: '/uploadMultiple',
    },

    user: {
        base: '/user',
        save: '/',
        update: '/update/:id',
        blacklistUser: '/blacklist/:id',
        whitelistUser: '/whitelist/:id',
        getAll: '/',
        getProfile: '/profile',
        getById: '/:id',
        deleteById: '/delete/:id',
        getCustomerCode: '/getCustomerCode/:roleId',
        validateUserData: '/validateUser/data',
        searchByParam: '/searchByParam',
    },

    auth: {
        base: '/auth',
        login: '/login',
        resetPassword: '/resetPassword/:id',
        changePassword: '/changePassword',
        refreshAuth: '/refreshAuth',
    },

    product: {
        base: '/product',
        save: '/',
        update: '/update/:id',
        deleteById: '/delete/:id',
        getAll: '/',
        activeInactive: '/activeInactive/:id',
        getById: '/:id',
    },
};

export default applicationRoutes;
