interface LoanStatisticResponseDto {
    pendingLoans: number;
    activeLoans: number;
    todayCollection: number;
    totalArrears: number;
}

export default LoanStatisticResponseDto;
