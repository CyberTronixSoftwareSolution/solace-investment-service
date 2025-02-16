import { WellKnownLoanStatus } from '../../util/enums/well-known-loan-status.enum';
import helperUtil from '../../util/helper.util';
import LoanGetAllResponseDto from './dto/loanGetAllResponseDto';

const modelToLoanGetAllResponseDto = (loan: any): LoanGetAllResponseDto => {
    return {
        _id: loan?._id,
        loanCode: loan?.loanNumber,
        customer: `${loan.borrower?.customerCode} - ${loan.borrower?.title} ${loan.borrower.firstName} ${loan.borrower.lastName}`,
        recoverOfficer: `${loan.recoverOfficer?.customerCode} - ${loan.recoverOfficer.firstName} ${loan.recoverOfficer.lastName}`,
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
        createdUser: `${loan.createdBy?.customerCode} - ${loan.createdBy?.firstName} ${loan.createdBy?.lastName}`,
        createdAt: loan.createdAt,
        updatedAt: loan.updatedAt,
    };
};

const modelsToLoanGetAllResponseDtos = (
    loans: any[]
): LoanGetAllResponseDto[] => {
    return loans.map((loan) => modelToLoanGetAllResponseDto(loan));
};

export default { modelToLoanGetAllResponseDto, modelsToLoanGetAllResponseDtos };
