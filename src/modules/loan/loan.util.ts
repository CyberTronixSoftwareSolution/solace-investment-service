import { WellKnownLoanPaymentStatus } from '../../util/enums/well-known-loan-payment-status.enum';
import { WellKnownLoanStatus } from '../../util/enums/well-known-loan-status.enum';
import helperUtil from '../../util/helper.util';
import LoanDetailGetAllResponseDto from './dto/loanDetailGetAllResponseDto';
import LoanGetAllResponseDto from './dto/loanGetAllResponseDto';
import PaymentBulkSearchResponseDto from './dto/paymentBulkSearchResponseDto';
import PaymentSearchResponseDto from './dto/paymentSearchResponseDto';

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

const modelToPaymentSearchResponseDto = (
    loan: any
): PaymentSearchResponseDto => {
    return {
        detailId: loan?._id,
        headerId: loan?.loanHeader?._id,
        // Customer
        customerId: loan?.loanHeader?.borrower?._id,
        customerName: `${loan?.loanHeader?.borrower?.initial} ${loan?.loanHeader?.borrower?.firstName} ${loan?.loanHeader?.borrower?.lastName}`,
        customerCode: loan?.loanHeader?.borrower?.customerCode,
        nicNumber: loan?.loanHeader?.borrower?.nicNumber,
        // Loan
        productName: loan?.loanHeader?.product?.productName,
        productId: loan?.loanHeader?.product?._id,
        loanNo: loan?.loanHeader?.loanNumber,
        paymentAmount: loan?.isActualPayment
            ? loan?.actualPaymentAmount
            : loan?.paymentAmount,
        loanAmount: loan?.loanHeader?.amount,
        termInstallAmount:
            loan?.openingBalance > 0
                ? loan?.installment + loan?.openingBalance
                : Math.abs(loan?.openingBalance) > loan?.installment
                ? loan?.installment
                : loan?.openingBalance + loan?.installment,
        installment: loan?.installment,
        status: loan?.status,
        statusName: helperUtil.getNameFromEnum(
            WellKnownLoanPaymentStatus,
            loan.status
        ),
        paymentDate: loan?.paymentDate,
    };
};

const modelsToPaymentSearchResponseDtos = (
    loans: any[]
): PaymentSearchResponseDto[] => {
    return loans.map((loan) => modelToPaymentSearchResponseDto(loan));
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

const modelToPaymentBulkSearchResponseDto = (
    loan: any
): PaymentBulkSearchResponseDto => {
    return {
        detailId: loan?._id,
        headerId: loan?.loanHeader?._id,
        deuDate: loan?.dueDate,
        // Customer
        customerId: loan?.loanHeader?.borrower?._id,
        customerName: `${loan?.loanHeader?.borrower?.initial} ${loan?.loanHeader?.borrower?.firstName} ${loan?.loanHeader?.borrower?.lastName}`,
        customerCode: loan?.loanHeader?.borrower?.customerCode,
        nicNumber: loan?.loanHeader?.borrower?.nicNumber,
        // Loan
        productName: loan?.loanHeader?.product?.productName,
        productId: loan?.loanHeader?.product?._id,
        loanNo: loan?.loanHeader?.loanNumber,
        paymentAmount:
            (loan.isActualPayment
                ? loan?.actualPaymentAmount
                : loan?.paymentAmount) || 0,
        loanAmount: loan?.loanHeader?.amount,
        loanBalance:
            loan?.loanHeader?.loanSummary?.installmentPerTerm *
                loan?.loanHeader?.termsCount +
                loan?.loanHeader?.totalPaidAmount || 0,
        // loan?.loanHeader?.loanSummary?.agreedAmount -
        // loan?.loanHeader?.totalPaidAmount,
        termInstallAmount:
            loan?.openingBalance > 0
                ? loan?.installment + loan?.openingBalance
                : Math.abs(loan?.openingBalance) > loan?.installment
                ? loan?.installment
                : loan?.openingBalance + loan?.installment,
        isLastInstallment: loan?.detailIndex == loan?.loanHeader?.termsCount,
        installment: loan?.installment,
        status: loan?.status,
        statusName: helperUtil.getNameFromEnum(
            WellKnownLoanPaymentStatus,
            loan.status
        ),
    };
};

const modelsToPaymentBulkSearchResponseDtos = (
    loans: any[]
): PaymentBulkSearchResponseDto[] => {
    return loans.map((loan) => modelToPaymentBulkSearchResponseDto(loan));
};

export default {
    modelToLoanGetAllResponseDto,
    modelsToLoanGetAllResponseDtos,
    modelsToLoanDetailGetAllResponseDtos,
    modelsToPaymentBulkSearchResponseDtos,
    modelsToPaymentSearchResponseDtos,
};
