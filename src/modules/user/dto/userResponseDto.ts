interface UserResponseDto {
    _id: string;
    fullName: string;
    customerCode: string;
    genderId: string;
    genderName: string;
    dateOfBirth: Date;
    mobileNo: string;
    email: string;
    profileImageUrl: string;
    nicNumber: string;
    role: string;
    roleName: string;
    isBlackListed: boolean;
    createdBy: string;
    createdUser: string;
    updatedBy: string;
    updatedUser: string;
    createdAt: Date;
    updatedAt: Date;
}

export default UserResponseDto;
