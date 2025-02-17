import { WellKnownLoanPaymentStatus } from '../../util/enums/well-known-loan-payment-status.enum';
import { WellKnownLoanStatus } from '../../util/enums/well-known-loan-status.enum';
import helperUtil from '../../util/helper.util';
import LoanDetailGetAllResponseDto from './dto/loanDetailGetAllResponseDto';
import LoanGetAllResponseDto from './dto/loanGetAllResponseDto';

const modelToLoanGetAllResponseDto = (loan: any): LoanGetAllResponseDto => {
    return {
        _id: loan?._id,
        loanCode: loan?.loanNumber,
        customer: `${loan.borrower?.customerCode} - ${loan.borrower?.title} ${loan.borrower.firstName} ${loan.borrower.lastName}`,
        recoverOfficer: `${loan.recoverOfficer?.customerCode} - ${loan.recoverOfficer.firstName}`,
        collectionDate: loan?.collectionDate,
        product: `${loan.product?.productCode} - ${loan.product?.productName}`,
        amount: loan.amount,
        agreedAmount: loan?.loanSummary?.agreedAmount || 0,
        payedAmount: loan?.totalPaidAmount || 0,
        status: loan.status,
        statusName: helperUtil.getNameFromEnum(
            WellKnownLoanStatus,
            loan.status
        ),
        createdBy: loan.createdBy?._id,
        createdUser: `${loan.createdBy?.customerCode} - ${loan.createdBy?.firstName}`,
        createdAt: loan.createdAt,
        updatedAt: loan.updatedAt,
    };
};

const modelsToLoanGetAllResponseDtos = (
    loans: any[]
): LoanGetAllResponseDto[] => {
    return loans.map((loan) => modelToLoanGetAllResponseDto(loan));
};

const modelToLoanDetailGetAllResponseDto = (
    loan: any
): LoanDetailGetAllResponseDto => {
    return {
        _id: loan._id,
        loanHeader: loan.loanHeader,
        dueDate: loan.dueDate,
        interest: loan.interest,
        capital: loan.capital,
        installment: loan.installment,
        detailIndex: loan.detailIndex,
        status: loan.status,
        statusName: helperUtil.getNameFromEnum(
            WellKnownLoanPaymentStatus,
            loan.status
        ),
        paymentDate: loan.paymentDate,
        collectedBy: loan.collectedBy
            ? `${loan.collectedBy?.customerCode} - ${loan.collectedBy?.firstName}`
            : '',
    };
};

const modelsToLoanDetailGetAllResponseDtos = (
    loans: any[]
): LoanDetailGetAllResponseDto[] => {
    return loans.map((loan) => modelToLoanDetailGetAllResponseDto(loan));
};

export default {
    modelToLoanGetAllResponseDto,
    modelsToLoanGetAllResponseDtos,
    modelsToLoanDetailGetAllResponseDtos,
};
