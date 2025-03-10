import mongoose from 'mongoose';
import { WellKnownLoanPaymentStatus } from '../../../util/enums/well-known-loan-payment-status.enum';

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
        },

        capital: {
            type: Number,
            default: 0,
        },

        installment: {
            type: Number,
            default: 0,
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
        },

        closingBalance: {
            type: Number,
            default: 0,
        },

        paymentDate: {
            type: Date,
        },

        actualPaymentAmount: {
            type: Number,
            default: 0,
        },

        isActualPayment: {
            type: Boolean,
            default: false,
        },

        paymentAmount: {
            type: Number,
            default: 0,
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
