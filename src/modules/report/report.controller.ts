import { Request, Response } from 'express';
import reportValidator from './report.validator';
import BadRequestError from '../../error/BadRequestError';
import reportService from './report.service';
import RepaymentResponseDto from './dto/repaymentResponseDto';
import reportUtil from './report.util';
import CommonResponse from '../../util/commonResponse';
import { StatusCodes } from 'http-status-codes';
import DeductionChargeResponseDto from './dto/deductionChargeResponseDto';
import InvestmentReportDto from './dto/investmentReportDto';
import NewlyAddLoansDto from './dto/newlyAddLoansDto';
import TodayHandoverLoanDto from './dto/todayHandoverLoanDto';
import TodayCollectionDto from './dto/todayCollectionDto';
import TodayDeductionChargeResponseDto from './dto/todayDeductionChargeResponseDto';

const getRepaymentReportData = async (req: Request, res: Response) => {
    const body: any = req.body;

    const { error } = reportValidator.repaymentReportSchema.validate(body);
    if (error) {
        throw new BadRequestError(error.message);
    }

    try {
        let response: RepaymentResponseDto[] = [];

        const reportData = await reportService.getRepaymentReportData(
            body.product,
            body.recoveryOfficer,
            body.collectionDate
        );

        if (reportData.length > 0) {
            response = reportUtil.modelsToRepaymentResponseDtos(reportData);
        }

        CommonResponse(res, true, StatusCodes.OK, '', response);
    } catch (error) {
        throw error;
    }
};

const getDeductionChargeReportData = async (req: Request, res: Response) => {
    const body: any = req.body;

    const { error } =
        reportValidator.deductionChargeReportSchema.validate(body);

    if (error) {
        throw new BadRequestError(error.message);
    }

    try {
        const reportData = await reportService.getDeductionChargeReportData(
            body.startDate,
            body.endDate,
            body.product,
            body.recoveryOfficer,
            body.searchType,
            body.searchCode,
            body.isDeductionChargesReducedFromLoan
        );

        let response: DeductionChargeResponseDto[] = [];

        if (reportData.length > 0) {
            reportData.forEach((report: any) => {
                let reportResponse =
                    reportUtil.modelToDeductionChargeResponseDto(report);

                if (reportResponse.length > 0) {
                    response = response.concat(reportResponse);
                }
            });
        }

        CommonResponse(res, true, StatusCodes.OK, '', response);
    } catch (error) {
        throw error;
    }
};

const getInvestmentReportData = async (req: Request, res: Response) => {
    const body: any = req.body;

    const { error } = reportValidator.investmentReportSchema.validate(body);

    if (error) {
        throw new BadRequestError(error.message);
    }

    try {
        const reportData = await reportService.getInvestmentReportData(
            body.startDate,
            body.endDate,
            body.product,
            body.recoveryOfficer,
            body.searchType,
            body.searchCode
        );

        let response: InvestmentReportDto[] = [];

        if (reportData.length > 0) {
            reportData.forEach((report: any) => {
                let reportResponse =
                    reportUtil.modelToInvestmentResponseDto(report);
                if (reportResponse.length > 0) {
                    response = response.concat(reportResponse);
                }
            });
        }

        CommonResponse(res, true, StatusCodes.OK, '', response);
    } catch (error) {
        throw error;
    }
};

const getDailyManagerReportData = async (req: Request, res: Response) => {
    const date: any = req.query.selectedDate || '';

    // Get Newly Added Added Loans
    const newLoans = await reportService.getNewlyAddLoansByDate(date);

    let newlyAddedLoans: NewlyAddLoansDto[] = [];

    if (newLoans.length > 0) {
        newlyAddedLoans = reportUtil.modelToNewlyAddLoansDtos(newLoans);
    }

    let newTotalAmount = 0;
    let newTotalAgreedAmount = 0;

    if (newlyAddedLoans.length > 0) {
        newlyAddedLoans.forEach((loan) => {
            newTotalAmount += loan.loanAmount;
            newTotalAgreedAmount += loan.agreedAmount;
        });
    }

    let newLoanObj = {
        newLoans: newlyAddedLoans,
        totalAmount: newTotalAmount,
        totalAgreedAmount: newTotalAgreedAmount,
    };

    // Get today hand over loans
    const todayHandOverLoans = await reportService.getTodayHandOverLoans(date);

    let handOverLoans: TodayHandoverLoanDto[] = [];

    if (todayHandOverLoans.length > 0) {
        handOverLoans =
            reportUtil.modelToTodayHandoverLoanDtos(todayHandOverLoans);
    }

    let totalAmount = 0;
    let totalAgreedAmount = 0;

    if (handOverLoans.length > 0) {
        handOverLoans.forEach((loan) => {
            totalAmount += loan.loanAmount;
            totalAgreedAmount += loan.agreedAmount;
        });
    }

    let handOverLoanObj = {
        handOverLoans: handOverLoans,
        totalAmount: totalAmount,
        totalAgreedAmount: totalAgreedAmount,
    };

    // get  today payment
    const todayPayment = await reportService.getTodayCollectionLoans(date);
    let todayCollectLoans: TodayCollectionDto[] = [];

    if (todayPayment.length > 0) {
        todayCollectLoans = reportUtil.modelToTodayCollectionDtos(todayPayment);
    }

    let totalCollectionAmount = 0;

    if (todayCollectLoans.length > 0) {
        todayCollectLoans.forEach((loan) => {
            totalCollectionAmount += loan.payedAmount;
        });
    }

    let todayCollectionObj = {
        todayCollectionLoans: todayCollectLoans,
        totalCollectionAmount: totalCollectionAmount,
    };

    //  today deduction charge
    const todayDeductionCharges =
        await reportService.getTodayDeductionChargeLoans(date);

    let deductionCharges: TodayDeductionChargeResponseDto[] = [];

    if (todayDeductionCharges.length > 0) {
        todayDeductionCharges.forEach((charge: any) => {
            if (charge?.loanDeductionCharges?.length > 0) {
                charge?.loanDeductionCharges?.forEach(
                    (deductionCharge: any) => {
                        deductionCharges.push(
                            reportUtil.modelToTodayDeductionChargeResponseDto(
                                charge,
                                deductionCharge
                            )
                        );
                    }
                );
            }
        });
    }

    let totalDeductionChargeAmount = 0;

    if (deductionCharges.length > 0) {
        deductionCharges.forEach((loan) => {
            totalDeductionChargeAmount += loan.chargeAmount;
        });
    }

    let todayDeductionChargeObj = {
        todayDeductionChargeLoans: deductionCharges,
        totalDeductionChargeAmount: totalDeductionChargeAmount,
    };

    let response = {
        newLoanData: newLoanObj,
        handOverLoanData: handOverLoanObj,
        todayCollectLoanData: todayCollectionObj,
        todayDeductionChargeData: todayDeductionChargeObj,
    };

    CommonResponse(res, true, StatusCodes.OK, '', response);
};

export {
    getRepaymentReportData,
    getDeductionChargeReportData,
    getInvestmentReportData,
    getDailyManagerReportData,
};
