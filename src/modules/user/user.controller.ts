import { Request, Response } from 'express';
import { startSession } from 'mongoose';

import userService from './user.service';
import authService from '../auth/auth.service';
import passwordHashUtil from '../../util/passwordHash.util';

import User from './user.model';
import Auth from '../auth/auth.model';
import userUtil from './user.util';

import BadRequestError from '../../error/BadRequestError';
import CommonResponse from '../../util/commonResponse';
import { StatusCodes } from 'http-status-codes';
import UserResponseDto from './dto/userResponseDto';
import NotFoundError from '../../error/NotFoundError';
import { WellKnownStatus } from '../../util/enums/well-known-status.enum';
import constants from '../../constant';
import { WellKnownUserStatus } from '../../util/enums/well-known-user-status.enum';
import helperUtil from '../../util/helper.util';

const saveUser = async (req: Request, res: Response) => {
    const {
        nicNumber,
        titleId,
        title,
        fullName,
        initial,
        firstName,
        lastName,
        dateOfBirth,
        age,
        genderId,
        gender,
        civilStatusId,
        civilStatus,
        occupation,
        mobileNo1,
        mobileNo2,
        residenceNo,
        email,
        addresses,
        spouseDetails,
        familyInfos,
        expensesDetails,
        incomeDetails,
        nicImageUrl,
        drivingLicenseUrl,
        businessRegistrationUrl,
        profileImageUrl,
        bankName,
        bankId,
        branch,
        accountNumber,
        role,
        specialNote,
    } = req.body;
    const userAuth: any = req.auth;
    //check Validations
    // If role is customer check nic and if admin check email

    if (
        role === constants.USER.ROLES.ADMIN ||
        role === constants.USER.ROLES.SUPERADMIN
    ) {
        const isEmailExists = await userService.findByNicOrEmail(email, '');

        if (isEmailExists) {
            throw new BadRequestError(
                'An admin account with this email already exists. Please use a different email!'
            );
        }
    } else if (role === constants.USER.ROLES.CUSTOMER) {
        const isNicExists = await userService.findByNicOrEmail('', nicNumber);

        if (isNicExists) {
            throw new BadRequestError(
                'A customer account with this NIC already exists. Please use a different NIC!'
            );
        }
    }

    let createdUser = null;
    const session = await startSession();
    try {
        //start transaction in session
        session.startTransaction();

        //get next code
        const nextCode = await userService.getNextCustomerAdminCode(role);

        // Arrange expensesDetails
        let expensesDetailsObj: any = null;

        if (expensesDetails?.expenses?.length > 0) {
            expensesDetailsObj = {
                expenses: expensesDetails.expenses,
                totalExpenses:
                    expensesDetails.expenses.reduce(
                        (total: number, expense: any) => total + expense.amount,
                        0
                    ) || 0,
            };
        }

        // Arrange incomeDetails
        let incomeDetailsObj: any = null;

        if (incomeDetails?.incomes?.length > 0) {
            incomeDetailsObj = {
                incomes: incomeDetails.incomes,
                totalIncome:
                    incomeDetails.incomes.reduce(
                        (total: number, income: any) => total + income.amount,
                        0
                    ) || 0,
            };
        }

        // create user only if role is customer
        let user = new User({
            nicNumber: nicNumber,
            customerCode: nextCode,
            titleId: titleId,
            title: title,
            fullName: fullName,
            initial: initial,
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            age: age,
            genderId: genderId,
            gender: gender,
            civilStatusId: civilStatusId,
            civilStatus: civilStatus,
            occupation: occupation,
            mobileNo1: mobileNo1,
            mobileNo2: mobileNo2,
            residenceNo: residenceNo,
            email: email,
            spouseDetails: spouseDetails,
            addresses: addresses?.length > 0 ? addresses : [],
            familyInfos: familyInfos?.length > 0 ? familyInfos : [],
            expensesDetails: expensesDetailsObj,
            incomeDetails: incomeDetailsObj,
            nicImageUrl: nicImageUrl,
            drivingLicenseUrl: drivingLicenseUrl,
            businessRegistrationUrl: businessRegistrationUrl,
            profileImageUrl: profileImageUrl,
            bankName: bankName,
            bankId: bankId,
            branch: branch,
            accountNumber: accountNumber,
            role: role,
            specialNote: specialNote,
            createdBy: userAuth.id,
            updatedBy: userAuth.id,
        });

        createdUser = await userService.Save(user, session);

        // create user and auth objects if role is admin
        if (
            role === constants.USER.ROLES.ADMIN ||
            role === constants.USER.ROLES.SUPERADMIN
        ) {
            // Create Auth
            const hashedPassword = await passwordHashUtil.hashPassword('12345');

            const auth = new Auth({
                email,
                password: hashedPassword,
                user: user._id,
                role: role,
                createdBy: userAuth?.id,
                updatedBy: userAuth?.id,
            });

            await authService.save(auth, session);
        }

        //commit transaction
        await session.commitTransaction();
    } catch (e) {
        //abort transaction
        await session.abortTransaction();
        throw e;
    } finally {
        //end session
        session.endSession();
    }

    let roleName = helperUtil.getRoleName(role);

    CommonResponse(
        res,
        true,
        StatusCodes.CREATED,
        `${roleName} created successfully!`,
        createdUser
    );
};

// Update user by user id
const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const userAuth: any = req.auth;
    const {
        nicNumber,
        titleId,
        title,
        fullName,
        initial,
        firstName,
        lastName,
        dateOfBirth,
        age,
        genderId,
        gender,
        civilStatusId,
        civilStatus,
        occupation,
        mobileNo1,
        mobileNo2,
        residenceNo,
        email,
        addresses,
        spouseDetails,
        familyInfos,
        expensesDetails,
        incomeDetails,
        nicImageUrl,
        drivingLicenseUrl,
        businessRegistrationUrl,
        profileImageUrl,
        bankName,
        bankId,
        branch,
        accountNumber,
        specialNote,
    } = req.body;

    // validate email and nicNumber
    let user = await userService.findByIdAndStatusIn(userId, [
        WellKnownUserStatus.ACTIVE,
        WellKnownUserStatus.BLACKLISTED,
    ]);

    if (!user) {
        throw new NotFoundError('User not found or already deleted!');
    }

    let error = '';
    if (
        user.role === constants.USER.ROLES.ADMIN &&
        userAuth.role === constants.USER.ROLES.SUPERADMIN
    ) {
        const existingEmails = await userService.validateUserDataForUpdate(
            2,
            email,
            userId
        );

        if (existingEmails.length > 0) {
            error = 'Email already exists!';
        }
    } else if (user.role === constants.USER.ROLES.CUSTOMER) {
        const existingNics = await userService.validateUserDataForUpdate(
            1,
            nicNumber,
            userId
        );

        if (existingNics.length > 0) {
            error = 'NIC already exists!';
        }
    }

    if (error) {
        throw new BadRequestError(error);
    }

    // create user
    let createdUser = null;

    const session = await startSession();

    try {
        //start transaction in session
        session.startTransaction();

        // Arrange expensesDetails
        let expensesDetailsObj: any = null;

        if (expensesDetails?.expenses?.length > 0) {
            expensesDetailsObj = {
                expenses: expensesDetails.expenses,
                totalExpenses:
                    expensesDetails.expenses.reduce(
                        (total: number, expense: any) => total + expense.amount,
                        0
                    ) || 0,
            };
        }

        // Arrange incomeDetails
        let incomeDetailsObj: any = null;

        if (incomeDetails?.incomes?.length > 0) {
            incomeDetailsObj = {
                incomes: incomeDetails.incomes,
                totalIncome:
                    incomeDetails.incomes.reduce(
                        (total: number, income: any) => total + income.amount,
                        0
                    ) || 0,
            };
        }

        user.nicNumber = nicNumber;
        user.titleId = titleId;
        user.title = title;
        user.fullName = fullName;
        user.initial = initial;
        user.firstName = firstName;
        user.lastName = lastName;
        user.dateOfBirth = dateOfBirth;
        user.age = age;
        user.genderId = genderId;
        user.gender = gender;
        user.civilStatusId = civilStatusId;
        user.civilStatus = civilStatus;
        user.occupation = occupation;
        user.mobileNo1 = mobileNo1;
        user.mobileNo2 = mobileNo2;
        user.residenceNo = residenceNo;
        user.email = email;
        user.addresses = addresses;
        user.spouseDetails = spouseDetails;
        user.familyInfos = familyInfos;
        user.expensesDetails = expensesDetailsObj;
        user.incomeDetails = incomeDetailsObj;
        user.nicImageUrl = nicImageUrl;
        user.drivingLicenseUrl = drivingLicenseUrl;
        user.businessRegistrationUrl = businessRegistrationUrl;
        user.profileImageUrl = profileImageUrl;
        user.bankName = bankName;
        user.bankId = bankId;
        user.branch = branch;
        user.accountNumber = accountNumber;
        user.specialNote = specialNote;
        user.updatedBy = userAuth?.id;

        createdUser = await userService.Save(user, session);

        // if admin superadmin update user and auth
        if (
            user.role === constants.USER.ROLES.ADMIN ||
            user.role === constants.USER.ROLES.SUPERADMIN
        ) {
            let auth = await authService.findByUserId(userId);

            if (!auth) throw new BadRequestError('User not found!');

            auth.email = email;
            auth.updatedBy = userAuth?.id;

            await authService.save(auth, session);
        }

        //commit transaction
        await session.commitTransaction();
    } catch (e) {
        //abort transaction
        await session.abortTransaction();
        throw e;
    } finally {
        //end session
        session.endSession();
    }

    CommonResponse(
        res,
        true,
        StatusCodes.OK,
        'User updated successfully!',
        createdUser
    );
};

// block user by user id
const blacklistUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const userAuth: any = req.auth;

    let user = await userService.findByIdAndStatusIn(userId, [
        WellKnownUserStatus.ACTIVE,
        WellKnownUserStatus.BLACKLISTED,
    ]);

    if (!user) {
        throw new NotFoundError('User not found or already deleted!');
    }

    const session = await startSession();

    try {
        //start transaction in session
        session.startTransaction();

        user.status = WellKnownUserStatus.BLACKLISTED;
        user.updatedBy = userAuth?.id;

        await userService.Save(user, session);

        if (
            user.role === constants.USER.ROLES.ADMIN ||
            user.role === constants.USER.ROLES.SUPERADMIN
        ) {
            let auth: any = await authService.findByUserId(userId);
            auth.status = WellKnownUserStatus.BLACKLISTED;
            auth.isBlocked = true;
            auth.updatedBy = userAuth?.id;

            await authService.save(auth, session);
        }

        //commit transaction
        await session.commitTransaction();
    } catch (e) {
        //abort transaction
        await session.abortTransaction();
        throw e;
    } finally {
        //end session
        session.endSession();
    }
    CommonResponse(
        res,
        true,
        StatusCodes.OK,
        'User blacklisted successfully!',
        null
    );
};

// unblock user by user id
const whitelistUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const userAuth: any = req.auth;
    let user = await userService.findByIdAndStatusIn(userId, [
        WellKnownUserStatus.BLACKLISTED,
    ]);

    if (!user) {
        throw new NotFoundError('User not found or user is not in blacklist!');
    }

    const session = await startSession();

    try {
        //start transaction in session
        session.startTransaction();

        user.status = WellKnownUserStatus.ACTIVE;
        user.updatedBy = userAuth?.id;

        await userService.Save(user, session);

        if (
            user.role === constants.USER.ROLES.ADMIN ||
            user.role === constants.USER.ROLES.SUPERADMIN
        ) {
            let auth: any = await authService.findByUserId(userId);
            auth.status = WellKnownUserStatus.ACTIVE;
            auth.isBlocked = false;
            auth.updatedBy = userAuth?.id;

            await authService.save(auth, session);
        }

        //commit transaction
        await session.commitTransaction();
    } catch (e) {
        //abort transaction
        await session.abortTransaction();
        throw e;
    } finally {
        //end session
        session.endSession();
    }
    CommonResponse(
        res,
        true,
        StatusCodes.OK,
        'User whitelisted successfully!',
        null
    );
};

const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const userAuth: any = req.auth;
    // let auth: any = await authService.findByUserId(userId);
    let user = await userService.findByIdAndStatusIn(userId, [
        WellKnownUserStatus.ACTIVE,
        WellKnownUserStatus.BLACKLISTED,
    ]);

    if (!user) {
        throw new NotFoundError('User not found or already deleted!');
    }

    const session = await startSession();

    try {
        //start transaction in session
        session.startTransaction();
        user.status = WellKnownStatus.DELETED;
        user.updatedBy = userAuth.id;
        await userService.Save(user, session);

        if (
            user.role === constants.USER.ROLES.ADMIN ||
            user.role === constants.USER.ROLES.SUPERADMIN
        ) {
            let auth: any = await authService.findByUserId(userId);
            auth.status = WellKnownStatus.DELETED;
            auth.updatedBy = userAuth.id;
            await authService.save(auth, session);
        }

        //commit transaction
        await session.commitTransaction();
    } catch (e) {
        //abort transaction
        await session.abortTransaction();
        throw e;
    } finally {
        //end session
        session.endSession();
    }
    CommonResponse(
        res,
        true,
        StatusCodes.OK,
        'User deleted successfully!',
        null
    );
};

const getNewCustomerCode = async (req: Request, res: Response) => {
    try {
        const role = +req.params.roleId;

        const nextCode = await userService.getNextCustomerAdminCode(role);
        let codeWithPrefix = '';

        if (role === constants.USER.ROLES.CUSTOMER) {
            codeWithPrefix = `${constants.CODEPREFIX.CUSTOMER}${nextCode
                .toString()
                .padStart(4, '0')}`;
        } else if (
            role === constants.USER.ROLES.ADMIN ||
            role === constants.USER.ROLES.SUPERADMIN
        ) {
            codeWithPrefix = `${constants.CODEPREFIX.ADMIN}${nextCode
                .toString()
                .padStart(4, '0')}`;
        }

        CommonResponse(res, true, StatusCodes.OK, '', codeWithPrefix);
    } catch (error) {
        throw error;
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    let response: any[] = [];
    const userAuth: any = req.auth;

    if (userAuth.role === constants.USER.ROLES.SUPERADMIN) {
        const users = await userService.findAllAndStatusIn([
            WellKnownUserStatus.ACTIVE,
            WellKnownUserStatus.BLACKLISTED,
        ]);

        if (users?.length > 0) {
            response = userUtil.userModelToUserResponseDtos(users);
        }
    } else if (userAuth.role === constants.USER.ROLES.ADMIN) {
        const users = await userService.findAllByCreatedUserAndStatusIn(
            userAuth.id,
            [WellKnownUserStatus.ACTIVE, WellKnownUserStatus.BLACKLISTED]
        );

        if (users?.length > 0) {
            response = userUtil.userModelToUserResponseDtos(users);
        }
    }

    CommonResponse(res, true, StatusCodes.OK, '', response);
};

const getUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;
    let user = await userService.findByIdAndStatusIn(userId, [
        WellKnownUserStatus.ACTIVE,
        WellKnownUserStatus.BLACKLISTED,
    ]);

    if (!user) {
        throw new NotFoundError('User not found or already deleted!');
    }

    CommonResponse(res, true, StatusCodes.OK, '', user);
};

export {
    saveUser,
    blacklistUser,
    whitelistUser,
    updateUser,
    getAllUsers,
    getUserById,
    deleteUser,
    getNewCustomerCode,
};
