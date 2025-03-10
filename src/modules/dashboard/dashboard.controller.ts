import { Request, Response } from 'express';
import loanHeaderService from '../loan/service/loanHeader.service';
import { WellKnownLoanStatus } from '../../util/enums/well-known-loan-status.enum';
import LoanStatisticResponseDto from './dto/loanStatisticResponseDto';
import dashboardService from './dashboard.service';
import CommonResponse from '../../util/commonResponse';
import { StatusCodes } from 'http-status-codes';

const getLoanStatistic = async (req: Request, res: Response) => {
    try {
        let response: LoanStatisticResponseDto = {
            pendingLoans: 0,
            activeLoans: 0,
            todayCollection: 0,
            totalArrears: 0,
        };

        const pendingLoanCount =
            await loanHeaderService.findAllLoansByStatusInAndCreatedByOrRecoverOfficer(
                [WellKnownLoanStatus.PENDING],
                ''
            );

        const activeLoanCount =
            await loanHeaderService.findAllLoansByStatusInAndCreatedByOrRecoverOfficer(
                [WellKnownLoanStatus.RUNNING],
                ''
            );

        const totalTodayCollection =
            await dashboardService.calculateTodayCollection();

        const totalArrears = await dashboardService.getTotalArrearsAmount();

        response.pendingLoans = pendingLoanCount.length || 0;
        response.activeLoans = activeLoanCount.length || 0;
        response.todayCollection = totalTodayCollection || 0;
        response.totalArrears = totalArrears || 0;

        CommonResponse(res, true, StatusCodes.OK, '', response);
    } catch (error) {
        throw error;
    }
};

const getMonthlyCollectionSummary = async (req: Request, res: Response) => {
    try {
        let today = new Date();

        let year = today.getFullYear();
        let month = today.getMonth() + 1;

        let response = await dashboardService.getMonthlyCollection(year, month);

        CommonResponse(res, true, StatusCodes.OK, '', response);
    } catch (error) {
        throw error;
    }
};

export { getLoanStatistic, getMonthlyCollectionSummary };
