interface PaymentSearchResponseDto {
    detailId: string;
    headerId: string;
    // Customer
    customerId: string;
    customerName: string;
    customerCode: string;
    nicNumber: string;
    // Loan
    productName: string;
    productId: string;
    loanNo: string;
    loanAmount: number;
    paymentAmount: number;
    termInstallAmount: number;
    installment: number;
    paymentDate: Date;
    status: number;
    statusName: string;
}

export default PaymentSearchResponseDto;
