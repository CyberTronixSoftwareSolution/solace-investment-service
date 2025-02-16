import mongoose from 'mongoose';
import { WellKnownUserStatus } from '../../util/enums/well-known-user-status.enum';
import { WellKnownStatus } from '../../util/enums/well-known-status.enum';

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: [true, 'Product Name is required'],
            maxlength: [100, 'Product Name cannot be more than 100 characters'],
        },

        productCode: {
            type: String,
            required: [true, 'Product Code is required'],
            maxlength: [20, 'Product Code cannot be more than 20 characters'],
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
            required: [true, 'Rate Amount is required'],
        },

        amount: {
            type: Number,
            required: [true, 'Amount is required'],
        },

        maxAmount: {
            type: Number,
            required: [true, 'Max Amount is required'],
        },

        minAmount: {
            type: Number,
            required: [true, 'Min Amount is required'],
        },

        termsCount: {
            type: Number,
            required: [true, 'Terms Count is required'],
        },

        type: {
            type: String,
            required: [true, 'Type is required'],
            maxlength: [20, 'Type cannot be more than 20 characters'],
        },

        // loan deduction charges
        isOpenDeductionCharges: {
            type: Boolean,
            default: false,
        },

        deductionCharges: [
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

        status: {
            type: Number,
            required: [true, 'Status is required'],
            default: WellKnownStatus.ACTIVE,
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

// Indexes for optimized searching
productSchema.index({ productCode: 1 }, { unique: true });
productSchema.index({ status: 1 });
productSchema.index({ _id: 1, status: 1 });
productSchema.index({ createdBy: 1 });
productSchema.index({ updatedBy: 1 });
productSchema.index({ type: 1 });

export default mongoose.model('Product', productSchema);
