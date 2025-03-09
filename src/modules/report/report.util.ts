import DeductionChargeResponseDto from './dto/deductionChargeResponseDto';
import RepaymentResponseDto from './dto/repaymentResponseDto';

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
        arrears: model?.arrearsAmount || 0 ,
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

export default {
    modelToRepaymentResponseDto,
    modelsToRepaymentResponseDtos,
    modelToDeductionChargeResponseDto,
};
