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
        update: '/:id',
        blacklistUser: '/blacklist/:id',
        whitelistUser: '/whitelist/:id',
        getAll: '/',
        getById: '/:id',
        deleteById: '/:id',
        getCustomerCode: '/getCustomerCode/:roleId',
    },

    auth: {
        base: '/auth',
        login: '/login',
        resetPassword: '/resetPassword/:id',
        changePassword: '/changePassword',
        refreshAuth: '/refreshAuth',
    },
};

export default applicationRoutes;
