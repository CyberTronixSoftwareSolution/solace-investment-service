import constants from '../../constant';
import { WellKnownStatus } from '../../util/enums/well-known-status.enum';
import { WellKnownUserStatus } from '../../util/enums/well-known-user-status.enum';
import helperUtil from '../../util/helper.util';
import Auth from '../auth/auth.model';
import UserSearchResponseDto from './dto/userSearchResponse';
import User from './user.model';
import userUtil from './user.util';

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
    const documentCount = await User.countDocuments({ role: role });

    let customerNo = documentCount ? documentCount + 1 : 1;

    let customerCode = helperUtil.createCodes(
        role === constants.USER.ROLES.ADMIN ||
            role === constants.USER.ROLES.SUPERADMIN
            ? constants.CODEPREFIX.ADMIN
            : constants.CODEPREFIX.CUSTOMER,
        customerNo
    );

    while (await User.findOne({ customerCode })) {
        customerNo += 1;
        customerCode = helperUtil.createCodes(
            role === constants.USER.ROLES.ADMIN ||
                role === constants.USER.ROLES.SUPERADMIN
                ? constants.CODEPREFIX.ADMIN
                : constants.CODEPREFIX.CUSTOMER,
            customerNo
        );
    }

    return customerCode;
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

const validateEmailNicForSaveAndUpdate = async (
    email: string,
    nic: string,
    id: string
) => {
    if (email && id) {
        return (
            (await User.find({
                email: email,
                _id: { $ne: id },
                status: {
                    $in: [
                        WellKnownUserStatus.ACTIVE,
                        WellKnownUserStatus.BLACKLISTED,
                    ],
                },
                role: {
                    $in: [
                        constants.USER.ROLES.ADMIN,
                        constants.USER.ROLES.SUPERADMIN,
                    ],
                },
            })) || []
        );
    } else if (nic && id) {
        return (
            (await User.find({
                nicNumber: nic,
                _id: { $ne: id },
                status: {
                    $in: [
                        WellKnownUserStatus.ACTIVE,
                        WellKnownUserStatus.BLACKLISTED,
                    ],
                },
                role: {
                    $in: [constants.USER.ROLES.CUSTOMER],
                },
            })) || []
        );
    } else if (email) {
        return (
            (await User.find({
                email: email,
                status: {
                    $in: [
                        WellKnownUserStatus.ACTIVE,
                        WellKnownUserStatus.BLACKLISTED,
                    ],
                },
                role: {
                    $in: [
                        constants.USER.ROLES.ADMIN,
                        constants.USER.ROLES.SUPERADMIN,
                    ],
                },
            })) || []
        );
    } else if (nic) {
        return (
            (await User.find({
                nicNumber: nic,
                status: {
                    $in: [
                        WellKnownUserStatus.ACTIVE,
                        WellKnownUserStatus.BLACKLISTED,
                    ],
                },
                role: {
                    $in: [constants.USER.ROLES.CUSTOMER],
                },
            })) || []
        );
    }

    return [];
};

const findAllByRoleInForSearch = async (role: number[]) => {
    return await User.find({
        role: { $in: role },
    })
        .sort({ createdAt: -1 })
        .select('_id fullName nicNumber role customerCode');
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
    validateEmailNicForSaveAndUpdate,
    findAllByRoleInForSearch,
};
