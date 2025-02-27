interface DeductionChargeResponseDto {
    _id: string;
    product: string;
    loanNumber: string;
    deductionChargeReduced: string;
    deductionChargeName: string;
    deductionChargeAmount: number;
    receivedAmount: number;
    receivableAmount: number;
}

export default DeductionChargeResponseDto;
