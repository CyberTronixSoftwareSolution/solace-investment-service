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
import LoanDetailGetAllResponseDto from './dto/loanDetailGetAllResponseDto';
import PaymentBulkSearchResponseDto from './dto/paymentBulkSearchResponseDto';
import { WellKnownLoanPaymentStatus } from '../../util/enums/well-known-loan-payment-status.enum';
import userService from '../user/user.service';
import PaymentSearchResponseDto from './dto/paymentSearchResponseDto';
import helperUtil from '../../util/helper.util';

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
                    amount = helperUtil.roundToTwoDecimals(
                        (product.amount / 100) * charge.rate
                    );
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
        dueDate.setHours(0, 0, 0, 0);

        let interestPerTerm = helperUtil.roundToTwoDecimals(
            totalInterest / product.termsCount
        );
        let capital = helperUtil.roundToTwoDecimals(
            product.amount / product.termsCount
        );

        let loanSummary = {
            totalInterestAmount: totalInterest,
            agreedAmount: helperUtil.roundToTwoDecimals(
                product.amount + totalInterest
            ),
            totalDeductionCharges: totalDeduction,
            availableBalance: body.isDeductionChargesReducedFromLoan
                ? helperUtil.roundToTwoDecimals(product.amount - totalDeduction)
                : product.amount,
            installmentPerTerm: capital + interestPerTerm,
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
            loanDetail.installment = helperUtil.roundToTwoDecimals(
                capital + interestPerTerm
            );
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
        let loanHeader = await loanHeaderService.findLoanHeaderByIdAndStatusIn(
            loanId,
            [WellKnownLoanStatus.PENDING]
        );

        if (!loanHeader) {
            throw new BadRequestError(
                'Pending loan not found or loan already deleted!'
            );
        }

        loanHeader.status = WellKnownLoanStatus.CANCELED;
        loanHeader.updatedBy = req.auth.id;

        await loanHeaderService.save(loanHeader, session);

        // hard delete loan details
        await loanDetailService.hardDeleteDetailByLoanHeaderId(
            loanHeader._id,
            session
        );

        await session.commitTransaction();

        CommonResponse(
            res,
            true,
            StatusCodes.OK,
            'Loan canceled successfully!',
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

const getLoanById = async (req: Request, res: Response) => {
    const loanId: string = req.params.id;

    try {
        let loanHeader = await loanHeaderService.findLoanHeaderByIdAndStatusIn(
            loanId,
            [
                WellKnownLoanStatus.PENDING,
                WellKnownLoanStatus.RUNNING,
                WellKnownLoanStatus.COMPLETED,
            ]
        );

        CommonResponse(res, true, StatusCodes.OK, '', loanHeader);
    } catch (error) {
        throw error;
    }
};

const generateLoanCode = async (req: Request, res: Response) => {
    try {
        const loanCode = await loanHeaderService.generateLoanId();

        CommonResponse(res, true, StatusCodes.OK, '', loanCode);
    } catch (error) {
        throw error;
    }
};

const getLoanDetails = async (req: Request, res: Response) => {
    const loanId: string = req.params.id;

    try {
        let loanDetails = await loanDetailService.findAllByLoanHeaderId(loanId);

        let response: LoanDetailGetAllResponseDto[] = [];

        if (loanDetails.length > 0) {
            response =
                loanUtil.modelsToLoanDetailGetAllResponseDtos(loanDetails);
        }

        CommonResponse(res, true, StatusCodes.OK, '', response);
    } catch (error) {
        throw error;
    }
};

const handOverLoan = async (req: Request, res: Response) => {
    const loanId: string = req.params.id;
    const body: any = req.body;
    const auth: any = req.auth;

    const { error } = loanValidation.loanHandOverSchema.validate(body);
    if (error) {
        throw new BadRequestError(error.message);
    }

    const session = await startSession();
    try {
        //start transaction in session
        session.startTransaction();

        let loanHeader: any =
            await loanHeaderService.findLoanHeaderByIdAndStatusIn(loanId, [
                WellKnownLoanStatus.PENDING,
            ]);

        if (!loanHeader) {
            throw new BadRequestError(
                'Pending loan not found or loan already hand over!'
            );
        }

        loanHeader.disbursementDate = body.transactionDate;
        loanHeader.handOverRemark = body.remark;
        loanHeader.handOverBy = auth.id;
        loanHeader.status = WellKnownLoanStatus.RUNNING;
        loanHeader.updatedBy = auth.id;

        await loanHeaderService.save(loanHeader, session);

        // hard delete loan details
        await loanDetailService.hardDeleteDetailByLoanHeaderId(
            loanHeader._id,
            session
        );

        // recalculate loan details
        let totalInterest: number = loanHeader.rate;
        if (loanHeader.isPercentage) {
            totalInterest = helperUtil.roundToTwoDecimals(
                (loanHeader.amount / 100) * loanHeader.rate
            );
        }

        let dueDate = new Date(body.transactionDate);

        let interestPerTerm = helperUtil.roundToTwoDecimals(
            totalInterest / loanHeader.termsCount
        );
        let capital = helperUtil.roundToTwoDecimals(
            loanHeader.amount / loanHeader.termsCount
        );

        for (let i = 1; i <= loanHeader.termsCount; i++) {
            let loanDetail = new LoanDetail();

            if (loanHeader.product.type == 'M') {
                dueDate.setMonth(dueDate.getMonth() + 1);
            } else if (loanHeader.product.type == 'W') {
                dueDate.setDate(dueDate.getDate() + 7);
            } else if (loanHeader.product.type == 'D') {
                dueDate.setDate(dueDate.getDate() + 1);
            }

            loanDetail.loanHeader = loanHeader._id;
            loanDetail.dueDate = dueDate;
            loanDetail.interest = interestPerTerm;
            loanDetail.capital = capital;
            loanDetail.installment = helperUtil.roundToTwoDecimals(
                capital + interestPerTerm
            );
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
            'Loan hand over successfully!',
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

const searchBulkReceipt = async (req: Request, res: Response) => {
    const body: any = req.body;
    const auth: any = req.auth;

    const { error } = loanValidation.receiptBulkSearchSchema.validate(body);
    if (error) {
        throw new BadRequestError(error.message);
    }

    try {
        let loanPaymentDetails: any[] = [];
        if (auth.role == constants.USER.ROLES.SUPERADMIN) {
            loanPaymentDetails = await loanDetailService.searchPaymentByDueDate(
                body.recoverOfficer,
                body
            );
        } else {
            loanPaymentDetails = await loanDetailService.searchPaymentByDueDate(
                auth?.id,
                body
            );
        }

        let response: PaymentBulkSearchResponseDto[] = [];

        response =
            loanUtil.modelsToPaymentBulkSearchResponseDtos(loanPaymentDetails);

        // if body.product != to "-1" search by product
        if (body.product != '-1') {
            response = response.filter(
                (item) => item.productId == body.product
            );
        }

        CommonResponse(res, true, StatusCodes.OK, '', response);
    } catch (error) {
        throw error;
    }
};

const payLoanInstallment = async (req: Request, res: Response) => {
    const installmentId: string = req.params.id;
    const body: any = req.body;
    const auth: any = req.auth;

    const { error } = loanValidation.installmentPaymentSchema.validate(body);
    if (error) {
        throw new BadRequestError(error.message);
    }

    // check loan detail exist and status pending
    let loanDetail = await loanDetailService.findLoanDetailByIdAndStatusIn(
        installmentId,
        [WellKnownLoanPaymentStatus.PENDING]
    );

    if (!loanDetail) {
        throw new BadRequestError('Installment not found or already paid!');
    }

    // check loan header exist and status running
    let loanHeader = await loanHeaderService.findLoanHeaderByIdAndStatusIn(
        loanDetail.loanHeader.toString(),
        [WellKnownLoanStatus.RUNNING]
    );

    if (!loanHeader) {
        throw new BadRequestError(
            'Running loan not found related to installment!'
        );
    }

    // loan detail related to loan header for future use
    let loanDetails = await loanDetailService.findAllByLoanHeaderId(
        loanHeader._id.toString()
    );

    // check loan validations for loan payment
    // 1. check previous installment is paid or shifted to next installment (if installment is not first installment)
    if (loanDetail.detailIndex > 1) {
        let previousLoanDetail = loanDetails.find(
            (item) => item.detailIndex == loanDetail.detailIndex - 1
        );

        if (
            previousLoanDetail?.status != WellKnownLoanPaymentStatus.PAID &&
            previousLoanDetail?.status != WellKnownLoanPaymentStatus.SHIFTED
        ) {
            throw new BadRequestError(
                'Previous installment should be paid or shifted before payment!'
            );
        }
    }

    // let remainingBalance = helperUtil.roundToTwoDecimals(
    //     (loanHeader?.loanSummary?.agreedAmount || 0) -
    //         loanHeader?.totalPaidAmount
    // );

    // 2. last installment payment amount should be equal to remaining balance
    // if (loanDetail.detailIndex == loanHeader.termsCount) {
    //     if (remainingBalance != body.payedAmount) {
    //         throw new BadRequestError(
    //             `This is last installment so payment amount should be equal to remaining balance (Remaining Balance: ${remainingBalance})!`
    //         );
    //     }
    // }

    // 3.  check remaining balance is greater than payed amount
    // if (remainingBalance < body.payedAmount) {
    //     throw new BadRequestError(
    //         `Payment amount should be less than loan remaining balance (Remaining Balance: ${remainingBalance})!`
    //     );
    // }

    let workingDate = new Date();
    workingDate.setHours(0, 0, 0, 0);

    const session = await startSession();

    try {
        //start transaction in session
        session.startTransaction();

        // installment amount = starting balance + installment amount
        let paymentAmount = body.payedAmount;
        let actualPaymentAmount = body.payedAmount;
        let detailIndex = loanDetail.detailIndex;
        let condition = true;
        let counter = 1;
        let receiptNo = `${loanHeader.loanNumber}-${loanDetail.detailIndex}`;

        while (condition) {
            let loanDetailData =
                loanDetails.find((item) => item.detailIndex == detailIndex) ||
                null;

            let installmentAmount = 0;
            if (loanDetailData != null) {
                if (counter == 1) {
                    installmentAmount = helperUtil.roundToTwoDecimals(
                        loanDetailData.installment +
                            loanDetailData.openingBalance
                    );
                } else {
                    installmentAmount = helperUtil.roundToTwoDecimals(
                        loanDetailData.installment
                    );
                }

                if (paymentAmount == installmentAmount) {
                    // if payment amount == installment amount
                    // 1. update loan header payment total
                    // 2. update payment detail status to paid
                    loanHeader.totalPaidAmount = helperUtil.roundToTwoDecimals(
                        loanHeader.totalPaidAmount + paymentAmount
                    );
                    loanHeader.updatedBy = auth.id;

                    if (loanDetail.detailIndex == loanHeader.termsCount) {
                        loanHeader.status = WellKnownLoanStatus.COMPLETED;
                        loanHeader.completedDate = new Date();
                    }

                    await loanHeaderService.save(loanHeader, session);

                    loanDetailData.status = WellKnownLoanPaymentStatus.PAID;
                    loanDetailData.closingBalance = 0;
                    loanDetailData.paymentDate = workingDate;
                    loanDetailData.paymentAmount = paymentAmount;
                    loanDetailData.actualPaymentAmount = actualPaymentAmount;
                    loanDetailData.receipt = receiptNo;
                    loanDetailData.updatedBy = auth.id;
                    loanDetailData.collectedBy = auth.id;

                    if (counter == 1) {
                        loanDetailData.isActualPayment = true;
                    } else {
                        loanDetailData.isActualPayment = false;
                    }

                    await loanDetailService.save(loanDetailData, session);

                    condition = false;
                } else if (paymentAmount > installmentAmount) {
                    // if payment amount > installment amount
                    // 1. update loan header payment total
                    // 2. update payment detail status to paid and update next installment start balance
                    loanHeader.totalPaidAmount += installmentAmount;
                    loanHeader.updatedBy = auth.id;

                    await loanHeaderService.save(loanHeader, session);

                    loanDetailData.status = WellKnownLoanPaymentStatus.PAID;
                    loanDetailData.closingBalance =
                        installmentAmount - paymentAmount;
                    loanDetailData.paymentDate = workingDate;
                    loanDetailData.paymentAmount = installmentAmount;
                    loanDetailData.actualPaymentAmount = actualPaymentAmount;
                    loanDetailData.receipt = receiptNo;
                    loanDetailData.updatedBy = auth.id;

                    if (counter == 1) {
                        loanDetailData.isActualPayment = true;
                    } else {
                        loanDetailData.isActualPayment = false;
                    }

                    await loanDetailService.save(loanDetailData, session);

                    // update next installment start balance
                    let nextLoanDetailData =
                        loanDetails.find(
                            (item) => item.detailIndex == detailIndex + 1
                        ) || null;

                    if (nextLoanDetailData != null) {
                        nextLoanDetailData.openingBalance =
                            helperUtil.roundToTwoDecimals(
                                installmentAmount - paymentAmount
                            );
                        nextLoanDetailData.updatedBy = auth.id;

                        await loanDetailService.save(
                            nextLoanDetailData,
                            session
                        );
                    }

                    paymentAmount = helperUtil.roundToTwoDecimals(
                        paymentAmount - installmentAmount
                    );
                    detailIndex += 1;
                    counter += 1;
                } else if (paymentAmount < installmentAmount) {
                    // if payment amount < installment amount
                    // 1. update loan header payment total
                    // 2. update payment detail status to paid and update next installment start balance
                    loanHeader.totalPaidAmount = helperUtil.roundToTwoDecimals(
                        loanHeader.totalPaidAmount + paymentAmount
                    );
                    loanHeader.updatedBy = auth.id;

                    await loanHeaderService.save(loanHeader, session);
                    loanDetailData.updatedBy = auth.id;

                    if (counter == 1) {
                        loanDetailData.closingBalance =
                            installmentAmount - paymentAmount;
                        loanDetailData.receipt = receiptNo;
                        loanDetailData.paymentDate = workingDate;
                        loanDetailData.paymentAmount = paymentAmount;
                        loanDetailData.actualPaymentAmount =
                            actualPaymentAmount;
                        loanDetailData.isActualPayment = true;
                        loanDetailData.collectedBy = auth.id;

                        loanDetailData.status = WellKnownLoanPaymentStatus.PAID;

                        await loanDetailService.save(loanDetailData, session);

                        // update next installment start balance
                        let nextLoanDetailData =
                            loanDetails.find(
                                (item) => item.detailIndex == detailIndex + 1
                            ) || null;

                        if (nextLoanDetailData != null) {
                            nextLoanDetailData.openingBalance =
                                helperUtil.roundToTwoDecimals(
                                    installmentAmount - paymentAmount
                                );
                            nextLoanDetailData.updatedBy = auth.id;

                            await loanDetailService.save(
                                nextLoanDetailData,
                                session
                            );
                        }
                    }

                    condition = false;
                }
            } else {
                condition = false;
            }
        }

        await session.commitTransaction();
    } catch (e) {
        //abort transaction
        await session.abortTransaction();
        throw e;
    } finally {
        //end session
        session.endSession();
    }

    CommonResponse(
        res,
        true,
        StatusCodes.OK,
        'Installment paid successfully!',
        null
    );
};

const printReceipt = async (req: Request, res: Response) => {
    const installmentId: string = req.params.id;
    const auth: any = req.auth;

    try {
        const printedUserData: any = await userService.findById(auth.id);

        let loanDetail: any =
            await loanDetailService.findLoanDetailByIdAndStatusIn(
                installmentId,
                [WellKnownLoanPaymentStatus.PAID]
            );

        if (!loanDetail) {
            throw new BadRequestError('Installment not found or not paid!');
        }

        let loanHeader: any =
            await loanHeaderService.findLoanHeaderByIdAndStatusIn(
                loanDetail.loanHeader.toString(),
                [
                    WellKnownLoanStatus.RUNNING,
                    WellKnownLoanStatus.COMPLETED,
                    WellKnownLoanStatus.PENDING,
                ]
            );
        if (!loanHeader) {
            throw new Error('Loan is not running');
        }

        let loanDetails = await loanDetailService.findAllByLoanHeaderId(
            loanDetail.loanHeader.toString()
        );

        let outstandingAmount = loanHeader?.loanSummary?.agreedAmount || 0;
        let paidAmount = loanDetail?.actualPaymentAmount;
        let totalPaidAmount = 0;
        loanDetails.forEach((item) => {
            if (
                item.detailIndex <= loanDetail.detailIndex &&
                item.isActualPayment
            ) {
                totalPaidAmount += item.actualPaymentAmount;
            }
        });

        let balance = outstandingAmount - totalPaidAmount;

        let response = {
            id: loanDetail._id.toString(),
            receiptNo: loanDetail.receipt || '',
            receiptDate: loanDetail.paymentDate || new Date(),
            reference: loanHeader.reference || '',
            customerId: loanHeader.borrower?._id,
            cusCode: `${loanHeader?.borrower?.customerCode}/${loanHeader?.borrower?.nicNumber}`,
            cusName: `${loanHeader?.borrower?.initial} ${loanHeader?.borrower?.firstName} ${loanHeader?.borrower?.lastName}`,
            nicNumber: loanHeader?.borrower?.nicNumber,
            loanId: loanHeader._id.toString(),
            loanNo: loanHeader.loanNumber,
            outStandingAmount: outstandingAmount,
            paidAmount: paidAmount,
            balanceAmount: balance,
            description: 'Loan installment payment',
            printedUser: `(${printedUserData.customerCode})${printedUserData.firstName} ${printedUserData.lastName}`,
        };

        CommonResponse(res, true, StatusCodes.OK, '', response);
    } catch (error) {
        throw error;
    }
};

const searchReceipt = async (req: Request, res: Response) => {
    const body: any = req.body;
    const auth: any = req.auth;

    const { error } = loanValidation.receiptSearchSchema.validate(body);
    if (error) {
        throw new BadRequestError(error.message);
    }

    try {
        let loanReceipts: any[] = [];
        if (auth.role == constants.USER.ROLES.SUPERADMIN) {
            loanReceipts =
                await loanDetailService.searchPaymentReceiptByStartDateAndEndDate(
                    body.startDate,
                    body.endDate,
                    body.recoverOfficer
                );
        } else {
            loanReceipts =
                await loanDetailService.searchPaymentReceiptByStartDateAndEndDate(
                    body.startDate,
                    body.endDate,
                    auth?.id
                );
        }

        let response: PaymentSearchResponseDto[] = [];

        response = loanUtil.modelsToPaymentSearchResponseDtos(loanReceipts);

        // if body.product != to "-1" search by product
        if (body.product != '-1') {
            response = response.filter(
                (item) => item.productId == body.product
            );
        }
        // if body.searchType != to "-1" search by searchType

        if (body.searchType != '-1') {
            switch (body.searchType) {
                case '1':
                    response = response.filter((item) =>
                        item.nicNumber.toLowerCase().includes(body.searchCode)
                    );
                    break;
                case '2':
                    response = response.filter((item) =>
                        item.customerCode
                            .toLowerCase()
                            .includes(body.searchCode)
                    );
                    break;
                case '3':
                    response = response.filter((item) =>
                        item.loanNo.toLowerCase().includes(body.searchCode)
                    );
                    break;
            }
        }

        CommonResponse(res, true, StatusCodes.OK, '', response);
    } catch (error) {
        throw error;
    }
};

const shiftLoanInstallment = async (req: Request, res: Response) => {
    const installmentId: string = req.params.id;
    const isUndo = req.query.isUndo == 'true' ? true : false || false;
    const auth: any = req.auth;

    // check loan detail exist and status pending
    let loanDetail: any = isUndo
        ? await loanDetailService.findLoanDetailByIdAndStatusIn(installmentId, [
              WellKnownLoanPaymentStatus.SHIFTED,
          ])
        : await loanDetailService.findLoanDetailByIdAndStatusIn(installmentId, [
              WellKnownLoanPaymentStatus.PENDING,
          ]);

    let message = '';
    if (!loanDetail) {
        message = isUndo
            ? 'Shifted installment not found!'
            : 'Installment not found!';
    }

    if (!isUndo) {
        if (loanDetail.status == WellKnownLoanPaymentStatus.PAID) {
            message = 'Installment already paid!';
        } else if (loanDetail.status == WellKnownLoanPaymentStatus.SHIFTED) {
            message = 'Installment already shifted!';
        }
    }

    if (message) {
        throw new BadRequestError(message);
    }

    let loanHeader = await loanHeaderService.findLoanHeaderByIdAndStatusIn(
        loanDetail.loanHeader.toString(),
        [WellKnownLoanStatus.RUNNING]
    );

    if (!loanHeader) {
        throw new BadRequestError(
            'Running loan not found related to installment!'
        );
    }

    if (!isUndo && loanHeader.termsCount == loanDetail.detailIndex) {
        throw new BadRequestError('Last installment cannot be shifted!');
    }

    let loanDetails = await loanDetailService.findAllByLoanHeaderId(
        loanHeader._id.toString()
    );

    let nextDetail = loanDetails.find(
        (item) => item.detailIndex == loanDetail.detailIndex + 1
    );

    if (!nextDetail) {
        throw new BadRequestError('Last installment cannot be shifted!');
    }

    if (loanDetail.detailIndex > 1) {
        let previousLoanDetail = loanDetails.find(
            (item) => item.detailIndex == loanDetail.detailIndex - 1
        );

        if (
            previousLoanDetail?.status != WellKnownLoanPaymentStatus.PAID &&
            previousLoanDetail?.status != WellKnownLoanPaymentStatus.SHIFTED
        ) {
            throw new BadRequestError(
                'Previous installment should be paid or shifted before shift this installment!'
            );
        }
    }

    const session = await startSession();
    try {
        //start transaction in session
        session.startTransaction();

        if (isUndo) {
            loanDetail.status = WellKnownLoanPaymentStatus.PENDING;
            loanDetail.updatedBy = auth.id;
            loanDetail.closingBalance = 0;

            await loanDetailService.save(loanDetail, session);

            nextDetail.openingBalance = 0;
            nextDetail.updatedBy = auth.id;

            await loanDetailService.save(nextDetail, session);
        } else {
            let installmentAmount =
                loanDetail.installment + loanDetail.openingBalance;

            loanDetail.status = WellKnownLoanPaymentStatus.SHIFTED;
            loanDetail.updatedBy = auth.id;
            loanDetail.closingBalance = installmentAmount;

            await loanDetailService.save(loanDetail, session);

            nextDetail.openingBalance = installmentAmount;
            nextDetail.updatedBy = auth.id;

            await loanDetailService.save(nextDetail, session);
        }

        await session.commitTransaction();

        CommonResponse(
            res,
            true,
            StatusCodes.OK,
            'Installment shifted successfully!',
            ''
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

export {
    saveLoan,
    deleteLoan,
    getAllLoans,
    getLoanById,
    generateLoanCode,
    getLoanDetails,
    handOverLoan,
    searchBulkReceipt,
    payLoanInstallment,
    printReceipt,
    searchReceipt,
    shiftLoanInstallment,
};
