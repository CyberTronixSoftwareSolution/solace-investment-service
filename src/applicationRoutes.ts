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
        getAll: '/',
        getById: '/:id',
        update: '/:id',
        deleteById: '/:id',
        blockUser: '/block/:id',
        unblockUser: '/unblock/:id',
        validateUser: '/validateUser',
        getUsersByRole: '/userByRole/:id',
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
