import { Request, Response } from 'express';
import { startSession } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import loanValidation from './loan.validation';
import LoanDetail from './model/loanDetail.model';
import LoanHeader from './model/loanHeader.model';

import BadRequestError from '../../error/BadRequestError';
import loanDetailService from './service/loanDetail.service';
import loanHeaderService from './service/loanHeader.service';
import CommonResponse from '../../util/commonResponse';
import { rawListeners } from 'process';
import { WellKnownLoanStatus } from '../../util/enums/well-known-loan-status.enum';
import constants from '../../constant';
import LoanGetAllResponseDto from './dto/loanGetAllResponseDto';
import loanUtil from './loan.util';

const saveLoan = async (req: Request, res: Response) => {
    const body: any = req.body;
    const auth: any = req.auth;

    const { error } = loanValidation.loanSchema.validate(body);
    if (error) {
        throw new BadRequestError(error.message);
    }

    const session = await startSession();

    try {
        //start transaction in session
        session.startTransaction();
        let product = body.product;

        let loanHeader = new LoanHeader();
        const loanCode = await loanHeaderService.generateLoanId();

        loanHeader.loanNumber = loanCode;
        loanHeader.transactionDate = body.transactionDate;
        loanHeader.reference = body.reference;
        loanHeader.borrower = body.borrower;
        loanHeader.product = product._id;
        loanHeader.isPercentage = product.isPercentage;
        loanHeader.rate = product.rate;
        loanHeader.amount = product.amount;
        loanHeader.termsCount = product.termsCount;
        loanHeader.disbursementDate = product.disbursementDate
            ? product.disbursementDate
            : body.transactionDate;
        loanHeader.reason = body.reason;
        loanHeader.recoverOfficer = body.recoverOfficer;
        loanHeader.collectionDate = body.collectionDate;

        let loanDeductionCharges = product.deductionCharges;

        let totalDeduction = 0;
        if (loanDeductionCharges.length > 0) {
            loanDeductionCharges.map((charge: any) => {
                if (charge?._id) {
                    delete charge._id;
                }
                let amount = charge.rate;
                if (charge.isPercentage) {
                    amount = (product.amount / 100) * charge.rate;
                }

                charge.amount = amount;
                totalDeduction += amount;
            });

            if (totalDeduction > product.amount) {
                throw new BadRequestError(
                    'Total deduction charges cannot be greater than loan amount!'
                );
            }
        }

        loanHeader.loanDeductionCharges = loanDeductionCharges;
        loanHeader.isDeductionChargesReducedFromLoan =
            body.isDeductionChargesReducedFromLoan;
        loanHeader.guarantors = body.guarantors;

        // loan calculation
        let totalInterest: number = product.rate;
        if (product.isPercentage) {
            totalInterest = (product.amount / 100) * product.rate;
        }

        let dueDate = product.disbursementDate
            ? new Date(product.disbursementDate)
            : new Date();

        let interestPerTerm = totalInterest / product.termsCount;
        let capital = product.amount / product.termsCount;

        let loanSummary = {
            totalInterestAmount: totalInterest,
            agreedAmount: product.amount + totalInterest,
            totalDeductionCharges: totalDeduction,
            availableBalance: body.isDeductionChargesReducedFromLoan
                ? product.amount - totalDeduction
                : product.amount,
        };

        loanHeader.rateAmount = totalInterest;
        loanHeader.loanSummary = loanSummary;
        loanHeader.createdBy = auth.id;
        loanHeader.updatedBy = auth.id;

        await loanHeaderService.save(loanHeader, session);

        for (let i = 1; i <= product.termsCount; i++) {
            let loanDetail = new LoanDetail();

            if (product.type == 'M') {
                dueDate.setMonth(dueDate.getMonth() + 1);
            } else if (product.type == 'W') {
                dueDate.setDate(dueDate.getDate() + 7);
            } else if (product.type == 'D') {
                dueDate.setDate(dueDate.getDate() + 1);
            }

            loanDetail.loanHeader = loanHeader._id;
            loanDetail.dueDate = dueDate;
            loanDetail.interest = interestPerTerm;
            loanDetail.capital = capital;
            loanDetail.installment = capital + interestPerTerm;
            loanDetail.detailIndex = i;
            loanDetail.collectedBy = null;
            loanDetail.createdBy = auth.id;
            loanDetail.updatedBy = auth.id;

            await loanDetailService.save(loanDetail, session);
        }

        await session.commitTransaction();

        CommonResponse(
            res,
            true,
            StatusCodes.OK,
            'Loan saved successfully!',
            loanHeader
        );
    } catch (e) {
        //abort transaction
        await session.abortTransaction();
        throw e;
    } finally {
        //end session
        session.endSession();
    }
};

const deleteLoan = async (req: Request, res: Response) => {
    const loanId: string = req.params.id;

    const session = await startSession();

    try {
        //start transaction in session
        session.startTransaction();
        await session.commitTransaction();
    } catch (e) {
        //abort transaction
        await session.abortTransaction();
        throw e;
    } finally {
        //end session
        session.endSession();
    }
};

const getAllLoans = async (req: Request, res: Response) => {
    const auth = req.auth;
    const status = req.query.status || '-1';

    let statusArray = [];
    if (+status == WellKnownLoanStatus.PENDING) {
        statusArray = [WellKnownLoanStatus.PENDING];
    } else if (+status == WellKnownLoanStatus.RUNNING) {
        statusArray = [WellKnownLoanStatus.RUNNING];
    } else if (+status == WellKnownLoanStatus.COMPLETED) {
        statusArray = [WellKnownLoanStatus.COMPLETED];
    } else {
        statusArray = [
            WellKnownLoanStatus.PENDING,
            WellKnownLoanStatus.RUNNING,
            WellKnownLoanStatus.COMPLETED,
        ];
    }

    let loans: any[] = [];

    if (auth.role == constants.USER.ROLES.SUPERADMIN) {
        // load all loans
        loans =
            await loanHeaderService.findAllLoansByStatusInAndCreatedByOrRecoverOfficer(
                statusArray,
                ''
            );
    } else if (auth.role == constants.USER.ROLES.ADMIN) {
        // load loan that are
        loans =
            await loanHeaderService.findAllLoansByStatusInAndCreatedByOrRecoverOfficer(
                statusArray,
                auth.id
            );
    }

    let response: LoanGetAllResponseDto[] =
        loanUtil.modelsToLoanGetAllResponseDtos(loans);

    CommonResponse(res, true, StatusCodes.OK, '', response);
};

const getLoanById = async (req: Request, res: Response) => {};

const generateLoanCode = async (req: Request, res: Response) => {
    try {
        const loanCode = await loanHeaderService.generateLoanId();

        CommonResponse(res, true, StatusCodes.OK, '', loanCode);
    } catch (error) {
        throw error;
    }
};

export { saveLoan, deleteLoan, getAllLoans, getLoanById, generateLoanCode };
