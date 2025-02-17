interface LoanDetailGetAllResponseDto {
    _id: string;
    loanHeader: string;
    dueDate: Date;
    interest: number;
    capital: number;
    installment: number;
    detailIndex: number;
    status: number;
    statusName: string;
    paymentDate: Date;
    collectedBy: string;
}

export default LoanDetailGetAllResponseDto;
