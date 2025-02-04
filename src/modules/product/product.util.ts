import constants from '../../constant';
import { WellKnownStatus } from '../../util/enums/well-known-status.enum';
import helperUtil from '../../util/helper.util';
import ProductResponseDto from './dto/productResponseDto';

const productModelToProductResponseDto = (product: any): ProductResponseDto => {
    return {
        _id: product?._id,
        productName: product?.productName,
        productCode: product?.productCode,
        isPercentage: product?.isPercentage,
        rate: product?.rate,
        rateAmount: product?.rateAmount,
        amount: product?.amount,
        maxAmount: product?.maxAmount,
        minAmount: product?.minAmount,
        termsCount: product?.termsCount,
        type: product?.type,
        isOpenDeductionCharges: product?.isOpenDeductionCharges,
        status: product?.status,
        statusName: helperUtil.getNameFromEnum(
            WellKnownStatus,
            product?.status
        ),
        createdBy: product.createdBy?._id,
        createdUser:
            helperUtil.createCodes(
                constants.CODEPREFIX.ADMIN,
                product.createdBy?.customerCode
            ) +
            '-' +
            product.createdBy?.firstName,
        updatedBy: product.updatedBy?._id,
        updatedUser:
            helperUtil.createCodes(
                constants.CODEPREFIX.ADMIN,
                product.updatedBy?.customerCode
            ) +
            '-' +
            product.updatedBy?.firstName,
        createdAt: product?.createdAt,
        updatedAt: product?.updatedAt,
    };
};

const productModelsToProductResponseDtos = (
    products: any
): ProductResponseDto[] => {
    return products.map((product: any) =>
        productModelToProductResponseDto(product)
    );
};
export default {
    productModelToProductResponseDto,
    productModelsToProductResponseDtos,
};
