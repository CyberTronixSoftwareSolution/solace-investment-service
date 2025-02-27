interface RepaymentResponseDto {
    _id: string;
    loanNo: string;
    customerName: string;
    mobileNo: string;
    loanAmount: number;
    installment: number;
    balance: number;
    arrears: number;
}

export default RepaymentResponseDto;
