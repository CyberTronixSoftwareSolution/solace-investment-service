interface TodayHandoverLoanDto {
    _id: string;
    loanNo: string;
    product: string;
    borrower: string;
    disturbanceDate: Date;
    handoverBy: string;
    remarks: string;
    loanAmount: number;
    agreedAmount: number;
}

export default TodayHandoverLoanDto;
