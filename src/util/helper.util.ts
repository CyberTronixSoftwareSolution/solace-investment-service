import constants from '../constant';

// return the name of the enum value
const getNameFromEnum = (enumValue: any, value: any): string => {
    return enumValue[value];
};

// check if the value is in the enum value
const isValueInEnum = (enumValue: any, value: any): boolean => {
    return Object.values(enumValue).includes(value);
};

const createCodes = (prefix: string, code: number) => {
    return `${prefix}${code.toString().padStart(3, '0')}`;
};

const getRoleName = (roleId: number) => {
    const { ROLES } = constants.USER;
    switch (roleId) {
        case ROLES.SUPERADMIN:
            return 'Super Admin';
        case ROLES.ADMIN:
            return 'Admin';
        case ROLES.CUSTOMER:
            return 'Customer';
        default:
            return 'Unknown';
    }
};

const GetTodayDate = () => {
    new Date().toISOString().slice(0, 10);
};

export const roundToTwoDecimals = (value: number): number => {
    return parseFloat(value.toFixed(2));
};

export default {
    getNameFromEnum,
    isValueInEnum,
    createCodes,
    getRoleName,
    GetTodayDate,
    roundToTwoDecimals,
};
