interface InvestmentReportDto {
    _id: string;
    loanNo: string;
    productName: string;
    transactionDate: Date;
    investment: number;
    loanAmount: number;
}

export default InvestmentReportDto;
