import mongoose from 'mongoose';
import { WellKnownUserStatus } from '../../util/enums/well-known-user-status.enum';

const authSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Username is required'],
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        role: {
            type: Number,
            ref: 'Role',
        },

        status: {
            type: Number,
            required: [true, 'Status is required'],
            default: WellKnownUserStatus.ACTIVE,
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

export default mongoose.model('Auth', authSchema);
