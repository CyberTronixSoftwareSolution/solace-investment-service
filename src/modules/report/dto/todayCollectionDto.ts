interface TodayCollectionDto {
    _id: string;
    loanNo: string;
    product: string;
    borrower: string;
    paymentTime: Date;
    collector: string;
    payedAmount: number;
    loanBalance: number;
}

export default TodayCollectionDto;
