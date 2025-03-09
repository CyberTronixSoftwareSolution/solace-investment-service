import { WellKnownUserStatus } from '../../util/enums/well-known-user-status.enum';
import UserResponseDto from './dto/userResponseDto';
import helperUtil from '../../util/helper.util';
import constants from '../../constant';
import UserSearchResponseDto from './dto/userSearchResponse';

const userModelToUserResponseDto = (user: any): UserResponseDto => {
    return {
        _id: user._id,
        fullName: user?.title + ' ' + user?.firstName + ' ' + user?.lastName,
        customerCode: user?.customerCode,
        genderId: user?.genderId,
        genderName: user?.genderName,
        dateOfBirth: user?.dateOfBirth,
        mobileNo: user?.mobileNo1 || '',
        residenceNo: user?.residenceNo || '',
        email: user?.email || '',
        profileImageUrl: user?.profileImageUrl,
        nicNumber: user?.nicNumber,
        isBlackListed:
            user.status === WellKnownUserStatus.BLACKLISTED ? true : false,
        role: user.role,
        roleName: helperUtil.getRoleName(user.role),
        status: user.status,
        statusName: helperUtil.getNameFromEnum(
            WellKnownUserStatus,
            user.status
        ),
        createdBy: user.createdBy?._id,
        createdUser: user.createdBy?.firstName,
        updatedBy: user.updatedBy?._id,
        updatedUser: user.updatedBy?.firstName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

const userModelToUserResponseDtos = (users: any[]): UserResponseDto[] => {
    return users.map((user) =>
        userModelToUserResponseDto(user)
    ) as UserResponseDto[];
};

const userModelToUserSearchResponse = (user: any): UserSearchResponseDto => {
    return {
        _id: user._id,
        fullName: user?.fullName,
        customerCode: user?.customerCode,
        nicNumber: user?.nicNumber,
        label: `${user?.customerCode} - ${user?.fullName}`,
        labelForSearch: `${user?.customerCode} - ${user?.fullName} - ${user?.nicNumber}`,
        mobileNos: `${user?.mobileNo1}${user?.mobileNo2 ? '/' + user?.mobileNo2 : ''}`,
    };
};

const userModelsToUserSearchResponse = (
    users: any[]
): UserSearchResponseDto[] => {
    return users.map((user) => userModelToUserSearchResponse(user));
};

export default {
    userModelToUserResponseDto,
    userModelToUserResponseDtos,
    userModelToUserSearchResponse,
    userModelsToUserSearchResponse,
};
