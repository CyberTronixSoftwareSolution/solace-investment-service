interface TodayDeductionChargeResponseDto {
    _id: string;
    loanNo: string;
    product: string;
    borrower: string;
    IsDeductFromLoan: Date;
    addedBy: string;
    chargeName: string;
    chargeAmount: number;
}

export default TodayDeductionChargeResponseDto;
