import mongoose from 'mongoose';
import { WellKnownStatus } from '../../../util/enums/well-known-status.enum';
import { WellKnownLoanStatus } from '../../../util/enums/well-known-loan-status.enum';
import helperUtil from '../../../util/helper.util';

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
            set: helperUtil.roundToTwoDecimals,
        },

        rateAmount: {
            type: Number,
            default: 0,
            set: helperUtil.roundToTwoDecimals,
        },

        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            set: helperUtil.roundToTwoDecimals,
        },

        termsCount: {
            type: Number,
            required: [true, 'Terms Count is required'],
        },

        disbursementDate: {
            type: Date,
        },

        completedDate: {
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
                    set: helperUtil.roundToTwoDecimals,
                },

                amount: {
                    type: Number,
                    required: [true, 'Amount is required'],
                    set: helperUtil.roundToTwoDecimals,
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
                set: helperUtil.roundToTwoDecimals,
            },

            agreedAmount: {
                type: Number,
                default: 0,
                set: helperUtil.roundToTwoDecimals,
            },

            totalDeductionCharges: {
                type: Number,
                default: 0,
                set: helperUtil.roundToTwoDecimals,
            },

            availableBalance: {
                type: Number,
                default: 0,
                set: helperUtil.roundToTwoDecimals,
            },

            installmentPerTerm: {
                type: Number,
                default: 0,
                set: helperUtil.roundToTwoDecimals,
            },
        },

        handOverRemark: {
            type: String,
            maxlength: [
                500,
                'Hand Over Remark cannot be more than 500 characters',
            ],
            default: '',
        },

        handOverBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        totalPaidAmount: {
            type: Number,
            default: 0,
            set: helperUtil.roundToTwoDecimals,
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

LoanHeaderSchema.index(
    { status: 1, recoverOfficer: 1 },
    { name: 'status_recoverOfficer_idx' }
);
LoanHeaderSchema.index(
    { 'borrower.customerCode': 1 },
    { name: 'borrower_customerCode_idx' }
);
LoanHeaderSchema.index(
    { 'borrower.nicNumber': 1 },
    { name: 'borrower_nicNumber_idx' }
);
LoanHeaderSchema.index({ loanNumber: 1 }, { name: 'loanNumber_idx' });
LoanHeaderSchema.index({ status: 1, _id: 1 }, { name: 'status_loanId_idx' });

export default mongoose.model('LoanHeader', LoanHeaderSchema);
