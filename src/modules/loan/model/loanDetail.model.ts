import mongoose from 'mongoose';
import { WellKnownLoanPaymentStatus } from '../../../util/enums/well-known-loan-payment-status.enum';
import helperUtil from '../../../util/helper.util';

const LoanDetailSchema = new mongoose.Schema(
    {
        loanHeader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LoanHeader',
            required: [true, 'Loan Header is required'],
        },

        dueDate: {
            type: Date,
            index: true,
            required: [true, 'Due Date is required'],
        },

        interest: {
            type: Number,
            default: 0,
            set: helperUtil.roundToTwoDecimals,
        },

        capital: {
            type: Number,
            default: 0,
            set: helperUtil.roundToTwoDecimals,
        },

        installment: {
            type: Number,
            default: 0,
            set: helperUtil.roundToTwoDecimals,
        },

        detailIndex: {
            type: Number,
            required: [true, 'Detail Index is required'],
        },

        status: {
            type: Number,
            default: WellKnownLoanPaymentStatus.PENDING,
            required: [true, 'Status is required'],
        },

        // payment information
        openingBalance: {
            type: Number,
            default: 0,
            set: helperUtil.roundToTwoDecimals,
        },

        closingBalance: {
            type: Number,
            default: 0,
            set: helperUtil.roundToTwoDecimals,
        },

        paymentDate: {
            type: Date,
        },

        actualPaymentAmount: {
            type: Number,
            default: 0,
            set: helperUtil.roundToTwoDecimals,
        },

        isActualPayment: {
            type: Boolean,
            default: false,
        },

        paymentAmount: {
            type: Number,
            default: 0,
            set: helperUtil.roundToTwoDecimals,
        },

        receipt: {
            type: String,
        },

        collectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        // common information
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

// Adding indexes
LoanDetailSchema.index(
    { loanHeader: 1, status: 1 },
    { name: 'loanHeader_status_idx' }
);
LoanDetailSchema.index(
    { dueDate: 1, status: 1 },
    { name: 'dueDate_status_idx' }
);
LoanDetailSchema.index(
    { loanHeader: 1, status: 1, dueDate: 1 },
    { name: 'loanHeader_status_dueDate_idx' }
);
LoanDetailSchema.index({ detailIndex: 1 }, { name: 'detailIndex_idx' });

export default mongoose.model('LoanDetail', LoanDetailSchema);
