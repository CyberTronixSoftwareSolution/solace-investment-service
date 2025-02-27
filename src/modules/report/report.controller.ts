import { Request, Response } from 'express';
import reportValidator from './report.validator';
import BadRequestError from '../../error/BadRequestError';
import reportService from './report.service';
import RepaymentResponseDto from './dto/repaymentResponseDto';
import reportUtil from './report.util';
import CommonResponse from '../../util/commonResponse';
import { StatusCodes } from 'http-status-codes';
import DeductionChargeResponseDto from './dto/deductionChargeResponseDto';

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

export { getRepaymentReportData, getDeductionChargeReportData };
