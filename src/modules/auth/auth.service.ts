import { WellKnownStatus } from '../../util/enums/well-known-status.enum';
import { WellKnownUserStatus } from '../../util/enums/well-known-user-status.enum';
import Auth from './auth.model';

const save = async (auth: any, session: any) => {
    if (session) {
        return await auth.save({ session });
    } else {
        return await auth.save();
    }
};

const findByEmail = async (email: string) => {
    return await Auth.findOne({
        email,
        status: {
            $in: [WellKnownUserStatus.ACTIVE, WellKnownUserStatus.BLACKLISTED],
        },
    }).populate('user');
};

// find by id and status not delete
const findById = async (id: string) => {
    return await Auth.findOne({
        _id: id,
        status: WellKnownStatus.ACTIVE,
    }).populate('user');
};

const findByUserId = async (userId: string) => {
    return await Auth.findOne({
        user: userId,
        status: WellKnownStatus.ACTIVE,
    });
};

export default { save, findByEmail, findById, findByUserId };
