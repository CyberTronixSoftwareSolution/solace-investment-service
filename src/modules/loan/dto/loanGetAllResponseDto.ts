interface LoanGetAllResponseDto {
    _id: string;
    loanCode: string;
    customer: string;
    recoverOfficer: string;
    collectionDate: string;
    product: string;
    amount: number;
    agreedAmount: number;
    payedAmount: number;
    status: number;
    statusName: string;
    createdBy: string;
    createdUser: string;
    createdAt: Date;
    updatedAt: Date;
}

export default LoanGetAllResponseDto;
