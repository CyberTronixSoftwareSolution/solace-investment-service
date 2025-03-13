import DeductionChargeResponseDto from './dto/deductionChargeResponseDto';
import InvestmentReportDto from './dto/investmentReportDto';
import NewlyAddLoansDto from './dto/newlyAddLoansDto';
import RepaymentResponseDto from './dto/repaymentResponseDto';
import TodayCollectionDto from './dto/todayCollectionDto';
import TodayDeductionChargeResponseDto from './dto/todayDeductionChargeResponseDto';
import TodayHandoverLoanDto from './dto/todayHandoverLoanDto';

const modelToRepaymentResponseDto = (model: any): RepaymentResponseDto => {
    return {
        _id: model._id,
        loanNo: model?.loanHeader?.loanNumber,
        customerName: `${model?.loanHeader?.borrower?.customerCode} - ${model?.loanHeader?.borrower?.title} ${model?.loanHeader?.borrower?.initial} ${model?.loanHeader?.borrower?.firstName} ${model?.loanHeader?.borrower?.lastName}`,
        mobileNo: model?.loanHeader?.borrower?.mobileNo1,
        loanAmount: model?.loanHeader?.loanSummary?.agreedAmount,
        installment: model?.installment,
        balance:
            model?.loanHeader?.loanSummary?.agreedAmount -
            model?.loanHeader?.totalPaidAmount,
        arrears: model?.arrearsAmount || 0,
    };
};

const modelsToRepaymentResponseDtos = (
    models: any[]
): RepaymentResponseDto[] => {
    return models.map((model) => modelToRepaymentResponseDto(model));
};

const modelToDeductionChargeResponseDto = (
    model: any
): DeductionChargeResponseDto[] => {
    let response: DeductionChargeResponseDto[] = [];
    if (model?.loanDeductionCharges?.length > 0) {
        model?.loanDeductionCharges?.forEach((deductionCharge: any) => {
            response.push({
                _id: model._id,
                product: model?.product?.productName,
                loanNumber: model?.loanNumber,
                deductionChargeName: deductionCharge?.deductionChargeName,
                deductionChargeReduced: model?.isDeductionChargesReducedFromLoan
                    ? 'Yes'
                    : 'No',
                deductionChargeAmount: deductionCharge?.amount,
                receivedAmount: deductionCharge?.amount,
                receivableAmount: 0,
            });
        });
    }

    return response;
};

const modelToInvestmentResponseDto = (model: any): InvestmentReportDto[] => {
    let response: InvestmentReportDto[] = [];
    if (model?.loanDeductionCharges?.length > 0) {
        model?.loanDeductionCharges?.forEach((deductionCharge: any) => {
            response.push({
                _id: model._id,
                loanNo: model.loanNumber,
                productName:
                    model?.product?.productCode +
                    ' - ' +
                    model?.product?.productName,
                transactionDate: model?.disbursementDate,
                investment: model?.loanSummary?.totalInterestAmount,
                loanAmount: model?.amount,
            });
        });
    }

    return response;
};

const modelToNewlyAddLoansDto = (model: any): NewlyAddLoansDto => {
    return {
        _id: model._id,
        loanNo: model?.loanNumber,
        product: model?.product?.productName,
        borrower: `${model?.borrower?.customerCode} - ${model?.borrower?.title} ${model?.borrower?.fullName}`,
        disturbanceDate: model?.disbursementDate,
        addedBy: model?.createdBy?.firstName + ' ' + model?.createdBy?.lastName,
        addedTime: model?.createdAt,
        loanAmount: model.amount,
        agreedAmount: model?.loanSummary?.agreedAmount,
    };
};

const modelToNewlyAddLoansDtos = (models: any[]): NewlyAddLoansDto[] => {
    return models.map((model) => modelToNewlyAddLoansDto(model));
};

const modelToTodayHandoverLoanDto = (model: any): TodayHandoverLoanDto => {
    return {
        _id: model._id,
        loanNo: model?.loanNumber,
        product: model?.product?.productName,
        borrower: `${model?.borrower?.customerCode} - ${model?.borrower?.title} ${model?.borrower?.fullName}`,
        disturbanceDate: model?.disbursementDate,
        handoverBy:
            model?.handOverBy?.firstName + ' ' + model?.handOverBy?.lastName,
        remarks: model?.handOverRemark,
        loanAmount: model.amount,
        agreedAmount: model?.loanSummary?.agreedAmount,
    };
};

const modelToTodayHandoverLoanDtos = (
    models: any[]
): TodayHandoverLoanDto[] => {
    return models.map((model) => modelToTodayHandoverLoanDto(model));
};

const modelToTodayCollectionDto = (model: any): TodayCollectionDto => {
    return {
        _id: model._id,
        loanNo: model?.loanHeader?.loanNumber,
        product: model?.loanHeader?.product?.productName,
        borrower: `${model?.loanHeader?.borrower?.customerCode} - ${model?.loanHeader?.borrower?.title} ${model?.loanHeader?.borrower?.fullName}`,
        paymentTime: model?.updatedAt,
        collector:
            model?.collectedBy?.firstName + ' ' + model?.collectedBy?.lastName,
        payedAmount: model?.actualPaymentAmount,
        loanBalance: model?.balance,
    };
};

const modelToTodayCollectionDtos = (models: any[]): TodayCollectionDto[] => {
    return models.map((model) => modelToTodayCollectionDto(model));
};

const modelToTodayDeductionChargeResponseDto = (
    header: any,
    charge: any
): TodayDeductionChargeResponseDto => {
    return {
        _id: header._id,
        loanNo: header?.loanNumber,
        product: header?.product?.productName,
        borrower: `${header?.borrower?.customerCode} - ${header?.borrower?.title} ${header?.borrower?.fullName}`,
        IsDeductFromLoan: header?.isDeductionChargesReducedFromLoan,
        addedBy:
            header?.createdBy?.firstName + ' ' + header?.createdBy?.lastName,
        chargeName: charge?.deductionChargeName,
        chargeAmount: charge?.amount,
    };
};
export default {
    modelToRepaymentResponseDto,
    modelsToRepaymentResponseDtos,
    modelToDeductionChargeResponseDto,
    modelToInvestmentResponseDto,
    modelToNewlyAddLoansDto,
    modelToNewlyAddLoansDtos,
    modelToTodayHandoverLoanDtos,
    modelToTodayCollectionDtos,
    modelToTodayDeductionChargeResponseDto,
};
