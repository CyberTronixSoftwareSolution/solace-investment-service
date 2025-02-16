import mongoose from 'mongoose';
import { WellKnownStatus } from '../../../util/enums/well-known-status.enum';
import { WellKnownLoanStatus } from '../../../util/enums/well-known-loan-status.enum';

const LoanHeaderSchema = new mongoose.Schema(
    {
        // Loan Number
        loanNumber: {
            type: String,
            required: [true, 'Loan Number is required'],
        },

        transactionDate: {
            type: Date,
            required: [true, 'Transaction Date is required'],
        },

        reference: {
            type: String,
            maxlength: [20, 'Reference cannot be more than 20 characters'],
        },

        borrower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Borrower is required'],
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product is required'],
        },

        isPercentage: {
            type: Boolean,
            required: [true, 'Is Percentage is required'],
            default: true,
        },

        rate: {
            type: Number,
            required: [true, 'Rate is required'],
        },

        rateAmount: {
            type: Number,
            default: 0,
        },

        amount: {
            type: Number,
            required: [true, 'Amount is required'],
        },

        termsCount: {
            type: Number,
            required: [true, 'Terms Count is required'],
        },

        disbursementDate: {
            type: Date,
        },

        reason: {
            type: String,
            required: [true, 'Reason is required'],
            maxlength: [500, 'Reason cannot be more than 500 characters'],
        },

        recoverOfficer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        collectionDate: {
            type: String,
        },

        loanDeductionCharges: [
            {
                deductionChargeName: {
                    type: String,
                    required: [true, 'Deduction Charge Name is required'],
                    maxlength: [
                        200,
                        'Deduction Charge Name cannot be more than 200 characters',
                    ],
                },

                isPercentage: {
                    type: Boolean,
                    default: true,
                },

                rate: {
                    type: Number,
                    required: [true, 'Rate is required'],
                },

                amount: {
                    type: Number,
                    required: [true, 'Amount is required'],
                },
            },
        ],

        isDeductionChargesReducedFromLoan: {
            type: Boolean,
            default: false,
        },

        guarantors: [
            {
                guarantor: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: [true, 'Guarantor is required'],
                },
            },
        ],

        loanSummary: {
            totalInterestAmount: {
                type: Number,
                default: 0,
            },

            agreedAmount: {
                type: Number,
                default: 0,
            },

            totalDeductionCharges: {
                type: Number,
                default: 0,
            },

            availableBalance: {
                type: Number,
                default: 0,
            },
        },

        totalPaidAmount: {
            type: Number,
            default: 0,
        },

        status: {
            type: Number,
            required: [true, 'Status is required'],
            default: WellKnownLoanStatus.PENDING,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('LoanHeader', LoanHeaderSchema);
