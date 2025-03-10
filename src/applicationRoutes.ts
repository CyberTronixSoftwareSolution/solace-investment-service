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

    loan: {
        base: '/loan',
        save: '/',
        deleteById: '/delete/:id',
        getLoanDetails: '/getLoanDetails/:id',
        getAll: '/',
        getById: '/:id',
        getLoanCode: '/getLoanCode',
        handOverLoan: '/handOverLoan/:id',
        payLoanInstallment: '/payInstallment/:id',
        shiftLoanInstallment: '/shiftInstallment/:id',
        printReceipt: '/printReceipt/:id',
        searchReceiptBulk: '/searchReceiptBulk',
        searchReceipt: '/searchReceipt',
    },

    report: {
        base: '/report',
        repaymentReport: '/repaymentReport',
        deductionChargeReport: '/deductionChargeReport',
    },

    dashboard: {
        base: '/dashboard',
        getStatistic: '/getStatistic',
        getCollectionSummary: '/getCollectionSummary',
    },
};

export default applicationRoutes;
