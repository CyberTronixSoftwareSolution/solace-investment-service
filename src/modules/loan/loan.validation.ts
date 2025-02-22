import Joi from 'joi';

const loanSchema = Joi.object({
    loanNumber: Joi.string().required().messages({
        'string.base': 'Loan Number is invalid',
        'string.empty': 'Loan Number is required',
        'string.required': 'Loan Number is required',
    }),

    transactionDate: Joi.date().required().messages({
        'date.base': 'Transaction Date is invalid',
        'date.empty': 'Transaction Date is required',
        'date.required': 'Transaction Date is required',
    }),

    reference: Joi.string().allow('').allow(null).max(20).messages({
        'string.base': 'Reference is invalid',
        'string.max': 'Reference cannot be more than 20 characters',
    }),

    borrower: Joi.string().required().messages({
        'string.base': 'Borrower is invalid',
        'string.empty': 'Borrower is required',
        'string.required': 'Borrower is required',
    }),

    product: Joi.object().required().messages({
        'object.base': 'Product is invalid',
        'object.empty': 'Product is required',
        'object.required': 'Product is required',
    }),

    reason: Joi.string().required().max(500).messages({
        'string.base': 'Reason is invalid',
        'string.empty': 'Reason is required',
        'string.max': 'Reason cannot be more than 500 characters',
    }),

    recoverOfficer: Joi.string().required().messages({
        'string.base': 'Recover Officer is invalid',
        'string.empty': 'Recover Officer is required',
        'string.required': 'Recover Officer is required',
    }),

    collectionDate: Joi.string().messages({
        'string.base': 'Collection Date is invalid',
    }),

    isDeductionChargesReducedFromLoan: Joi.boolean().messages({
        'boolean.base': 'Is Deduction Charges Reduced From Loan is invalid',
    }),

    guarantors: Joi.array().min(1).required().messages({
        'array.base': 'Guarantors must be an array',
        'array.min': 'At least one guarantor is required',
        'any.required': 'Guarantors are required',
    }),
});

const loanHandOverSchema = Joi.object({
    transactionDate: Joi.date().required().messages({
        'date.base': 'Transaction Date is invalid',
        'date.empty': 'Transaction Date is required',
        'date.required': 'Transaction Date is required',
    }),

    remark: Joi.string().allow('').allow(null).max(500).messages({
        'string.base': 'Reason is invalid',
        'string.max': 'Reason cannot be more than 500 characters',
    }),
});

const receiptBulkSearchSchema = Joi.object({
    transactionDate: Joi.date().required().messages({
        'date.base': 'Transaction Date is invalid',
        'date.empty': 'Transaction Date is required',
        'date.required': 'Transaction Date is required',
    }),

    product: Joi.string().required().messages({
        'object.base': 'Product is invalid',
        'object.empty': 'Product is required',
        'object.required': 'Product is required',
    }),

    searchType: Joi.string().required().messages({
        'string.base': 'Search Type is invalid',
        'string.empty': 'Search Type is required',
        'string.required': 'Search Type is required',
    }),

    searchCode: Joi.string().allow(null).allow('').messages({
        'string.base': 'Search Code is invalid',
    }),
});

const installmentPaymentSchema = Joi.object({
    payedAmount: Joi.number().required().messages({
        'number.base': 'Amount is invalid',
        'number.empty': 'Amount is required',
        'number.required': 'Amount is required',
    }),
});

const receiptSearchSchema = Joi.object({
    startDate: Joi.date().required().messages({
        'date.base': 'Start Date is invalid',
        'date.empty': 'Start Date is required',
        'date.required': 'Start Date is required',
    }),

    endDate: Joi.date().required().messages({
        'date.base': 'End Date is invalid',
        'date.empty': 'End Date is required',
        'date.required': 'End Date is required',
    }),

    product: Joi.string().required().messages({
        'object.base': 'Product is invalid',
        'object.empty': 'Product is required',
        'object.required': 'Product is required',
    }),

    searchType: Joi.string().required().messages({
        'string.base': 'Search Type is invalid',
        'string.empty': 'Search Type is required',
        'string.required': 'Search Type is required',
    }),

    searchCode: Joi.string().allow(null).allow('').messages({
        'string.base': 'Search Code is invalid',
    }),
});

export default {
    loanSchema,
    loanHandOverSchema,
    receiptBulkSearchSchema,
    installmentPaymentSchema,
    receiptSearchSchema,
};
