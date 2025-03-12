import joi from 'joi';

const repaymentReportSchema = joi.object({
    // dateFrom: joi.date().required().messages({
    //     'date.base': 'Date From is invalid',
    //     'date.empty': 'Date From is required',
    //     'date.required': 'Date From is required',
    // }),
    product: joi.string().required().allow('').messages({
        'string.base': 'Product is invalid',
        'string.empty': 'Product is required',
        'string.required': 'Product is required',
    }),

    recoveryOfficer: joi.string().required().allow('').messages({
        'string.base': 'Recovery Officer is invalid',
        'string.empty': 'Recovery Officer is required',
        'string.required': 'Recovery Officer is required',
    }),

    collectionDate: joi.string().allow(null).allow('').messages({
        'string.base': 'Collection Date is invalid',
    }),
});

const deductionChargeReportSchema = joi.object({
    // startDate
    startDate: joi.date().required().messages({
        'date.base': 'Start Date is invalid',
        'date.empty': 'Start Date is required',
        'date.required': 'Start Date is required',
    }),

    // endDate
    endDate: joi.date().required().messages({
        'date.base': 'End Date is invalid',
        'date.empty': 'End Date is required',
        'date.required': 'End Date is required',
    }),

    // product
    product: joi.string().required().allow('').messages({
        'string.base': 'Product is invalid',
        'string.empty': 'Product is required',
        'string.required': 'Product is required',
    }),

    // recover officer
    recoveryOfficer: joi.string().required().allow('').messages({
        'string.base': 'Recovery Officer is invalid',
        'string.empty': 'Recovery Officer is required',
        'string.required': 'Recovery Officer is required',
    }),

    //searchType
    searchType: joi.number().integer().messages({
        'number.base': 'searchType is invalid',
    }),

    // search code
    searchCode: joi.string().allow('').allow(null).messages({
        'string.base': 'Search Code is invalid',
    }),

    // isDeductionChargesReducedFromLoan
    isDeductionChargesReducedFromLoan: joi.number().integer().messages({
        'number.base': 'Is Deduction Charges Reduced From Loan is invalid',
    }),
});

const investmentReportSchema = joi.object({
    // startDate
    startDate: joi.date().required().messages({
        'date.base': 'Start Date is invalid',
        'date.empty': 'Start Date is required',
        'date.required': 'Start Date is required',
    }),

    // endDate
    endDate: joi.date().required().messages({
        'date.base': 'End Date is invalid',
        'date.empty': 'End Date is required',
        'date.required': 'End Date is required',
    }),

    // product
    product: joi.string().required().allow('').messages({
        'string.base': 'Product is invalid',
        'string.empty': 'Product is required',
        'string.required': 'Product is required',
    }),

    // recover officer
    recoveryOfficer: joi.string().required().allow('').messages({
        'string.base': 'Recovery Officer is invalid',
        'string.empty': 'Recovery Officer is required',
        'string.required': 'Recovery Officer is required',
    }),

    //searchType
    searchType: joi.number().integer().messages({
        'number.base': 'searchType is invalid',
    }),

    // search code
    searchCode: joi.string().allow('').allow(null).messages({
        'string.base': 'Search Code is invalid',
    }),
});

export default {
    repaymentReportSchema,
    deductionChargeReportSchema,
    investmentReportSchema,
};
