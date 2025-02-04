import Joi from 'joi';

//     "type": "D", // D,W,M
//     "isOpenDeductionCharges": false,
//     "deductionCharges": [
//         {
//             "deductionChargeName": "Processing Fee",
//             "isPercentage": true,
//             "rate": 2.0,
//             "amount": 2000
//         },
//         {
//             "deductionChargeName": "Stamp Duty",
//             "isPercentage": false,
//             "rate": 0.0,
//             "amount": 100
//         }
//     ]
// }
const productSchema = Joi.object({
    productName: Joi.string().required().max(100).messages({
        'string.base': 'Product Name is invalid',
        'string.empty': 'Product Name is required',
        'string.max': 'Product Name cannot be more than 100 characters',
    }),

    productCode: Joi.string().required().max(20).messages({
        'string.base': 'Product Code is invalid',
        'string.empty': 'Product Code is required',
        'string.max': 'Product Code cannot be more than 20 characters',
    }),

    isPercentage: Joi.boolean().required().messages({
        'boolean.base': 'Is Percentage is invalid',
        'boolean.empty': 'Is Percentage is required',
    }),

    rate: Joi.number().required().messages({
        'number.base': 'Rate is invalid',
        'number.empty': 'Rate is required',
    }),

    amount: Joi.number().required().messages({
        'number.base': 'Amount is invalid',
        'number.empty': 'Amount is required',
    }),

    maxAmount: Joi.number().required().messages({
        'number.base': 'Max Amount is invalid',
        'number.empty': 'Max Amount is required',
    }),

    minAmount: Joi.number().required().messages({
        'number.base': 'Min Amount is invalid',
        'number.empty': 'Min Amount is required',
    }),

    termsCount: Joi.number().required().messages({
        'number.base': 'Terms Count is invalid',
        'number.empty': 'Terms Count is required',
    }),

    type: Joi.string().required().max(1).messages({
        'string.base': 'Type is invalid',
        'string.empty': 'Type is required',
        'string.max': 'Type cannot be more than 1 characters',
    }),

    isOpenDeductionCharges: Joi.boolean().messages({
        'boolean.base': 'Is Open Deduction Charges is invalid',
    }),

    deductionCharges: Joi.array()
        .items(
            Joi.object({
                _id: Joi.string().optional(),

                deductionChargeName: Joi.string().required().max(200).messages({
                    'string.base': 'Deduction Charge Name is invalid',
                    'string.empty': 'Deduction Charge Name is required',
                    'string.max':
                        'Deduction Charge Name cannot be more than 200 characters',
                }),

                isPercentage: Joi.boolean().messages({
                    'boolean.base': 'Is Percentage is invalid',
                }),

                rate: Joi.number().required().messages({
                    'number.base': 'Rate is invalid',
                    'number.empty': 'Rate is required',
                }),

                amount: Joi.number().required().messages({
                    'number.base': 'Amount is invalid',
                    'number.empty': 'Amount is required',
                }),
            })
        )
        .messages({
            'array.base': 'Deduction Charges is invalid',
        }),
});

export default { productSchema };
