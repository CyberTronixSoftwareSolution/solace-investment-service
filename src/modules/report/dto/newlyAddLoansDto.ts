interface NewlyAddLoansDto {
    _id: string;
    loanNo: string;
    product: string;
    borrower: string;
    disturbanceDate: Date;
    addedBy: string;
    addedTime: Date;
    loanAmount: number;
    agreedAmount: number;
}

export default NewlyAddLoansDto;
