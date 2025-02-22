interface PaymentBulkSearchResponseDto {
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
    loanBalance: number;
    paymentAmount: number;
    termInstallAmount: number;
    isLastInstallment: boolean;
    installment: number;
    status: number;
    statusName: string;
}

export default PaymentBulkSearchResponseDto;
