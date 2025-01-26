interface UserResponseDto {
    _id: string;
    fullName: string;
    customerCode: string;
    genderId: string;
    genderName: string;
    dateOfBirth: Date;
    mobileNo: string;
    residenceNo: string;
    email: string;
    profileImageUrl: string;
    nicNumber: string;
    role: string;
    roleName: string;
    status: Number;
    statusName: string;
    isBlackListed: boolean;
    createdBy: string;
    createdUser: string;
    updatedBy: string;
    updatedUser: string;
    createdAt: Date;
    updatedAt: Date;
}

export default UserResponseDto;
