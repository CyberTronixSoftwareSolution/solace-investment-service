interface ProductResponseDto {
    _id: string;
    productName: string;
    productCode: string;
    isPercentage: boolean;
    rate: number;
    rateAmount: number;
    amount: number;
    maxAmount: number;
    minAmount: number;
    termsCount: number;
    type: number;
    isOpenDeductionCharges: boolean;
    status: number;
    statusName: string;
    createdBy: string;
    createdUser: string;
    updatedBy: string;
    updatedUser: string;
    createdAt: Date;
    updatedAt: Date;
}

export default ProductResponseDto;
