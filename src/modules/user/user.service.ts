import constants from '../../constant';
import { WellKnownStatus } from '../../util/enums/well-known-status.enum';
import Auth from '../auth/auth.model';
import User from './user.model';

const Save = async (user: any, session: any) => {
    if (session) {
        return await user.save({ session });
    } else {
        return await user.save({ session });
    }
};

const findById = async (id: string) => {
    return await User.findOne({
        _id: id,
        status: WellKnownStatus.ACTIVE,
    });
};

const findByIdAndStatusIn = async (id: string, status: number[]) => {
    return await User.findOne({
        _id: id,
        status: { $in: status },
    });
};

const findAllAndStatusIn = async (status: number[]) => {
    return await User.find({
        status: { $in: status },
    })
        .populate([
            {
                path: 'createdBy',
                select: '_id firstName lastName',
            },
            {
                path: 'updatedBy',
                select: '_id firstName lastName',
            },
        ])
        .sort({ createdAt: -1 });
};

const findByNicOrEmail = async (email: string, nic: string) => {
    if (email) {
        return await User.findOne({
            email: email,
            status: {
                $ne: WellKnownStatus.DELETED,
            },
            role: {
                $in: [
                    constants.USER.ROLES.ADMIN,
                    constants.USER.ROLES.SUPERADMIN,
                ],
            },
        });
    } else if (nic) {
        return await User.findOne({
            nicNumber: nic,
            status: {
                $ne: WellKnownStatus.DELETED,
            },
            role: {
                $in: [constants.USER.ROLES.CUSTOMER],
            },
        });
    }
};

const getNextCustomerAdminCode = async (role: number) => {
    // max customerCode by role and plus 1
    const maxCode: any = await User.findOne({ role: role }).sort({
        customerCode: -1,
    });

    return maxCode ? maxCode.customerCode + 1 : 1;
};

const validateUserDataForUpdate = async (
    type: number,
    data: string,
    id: string
) => {
    switch (type) {
        case 1:
            return await User.find({
                nicNumber: data,
                _id: { $ne: id },
                status: WellKnownStatus.ACTIVE,
            }).exec();
        case 2:
            return await User.find({
                email: data,
                _id: { $ne: id },
                status: WellKnownStatus.ACTIVE,
            }).exec();
        default:
            return [];
    }
};

const findAllByCreatedUserAndStatusIn = async (
    userId: string,
    status: number[]
) => {
    return await User.find({
        status: { $in: status },
        createdBy: userId,
    })
        .populate([
            {
                path: 'createdBy',
                select: '_id firstName lastName',
            },
            {
                path: 'updatedBy',
                select: '_id firstName lastName',
            },
        ])
        .sort({ createdAt: -1 });
};

export default {
    Save,
    findById,
    findByIdAndStatusIn,
    findAllAndStatusIn,
    findAllByCreatedUserAndStatusIn,
    findByNicOrEmail,
    getNextCustomerAdminCode,
    validateUserDataForUpdate,
};
