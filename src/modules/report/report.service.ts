import constants from '../../constant';
import { WellKnownLoanPaymentStatus } from '../../util/enums/well-known-loan-payment-status.enum';
import { WellKnownLoanStatus } from '../../util/enums/well-known-loan-status.enum';
import LoanDetail from '../loan/model/loanDetail.model';
import LoanHeader from '../loan/model/loanHeader.model';
import loanDetailService from '../loan/service/loanDetail.service';
import User from '../user/user.model';

const getRepaymentReportData = async (
    product: string,
    recoveryOfficer: string,
    collectionDate: string
) => {
    let response: any[] = [];
    const query: any = {
        status: { $in: [WellKnownLoanStatus.RUNNING] },
    };

    if (product !== '' && product !== '-1') {
        query.product = product;
    }
    if (recoveryOfficer !== '' && recoveryOfficer != '-1') {
        query.recoverOfficer = recoveryOfficer;
    }
    if (collectionDate !== '' && collectionDate != '-1') {
        query.collectionDate = collectionDate;
    }

    const loanHeaderIds = (
        await LoanHeader.find(query).select('_id').lean()
    ).map((loan) => loan._id.toString());

    if (loanHeaderIds.length > 0) {
        for (let i = 0; i < loanHeaderIds.length; i++) {
            const loanHeaderId = loanHeaderIds[i];

            const loanDetails = await LoanDetail.find({
                loanHeader: loanHeaderId,
            })
                .populate({
                    path: 'loanHeader',
                    select: '_id loanNumber amount loanSummary totalPaidAmount',
                    populate: [
                        {
                            path: 'product',
                            select: '_id productName',
                        },
                        {
                            path: 'borrower',
                            select: '_id nicNumber customerCode title initial firstName lastName fullName mobileNo1',
                        },
                    ],
                })
                .sort({ detailIndex: 1 })
                .lean();

            if (loanDetails.length > 0) {
                let selectedLoanDetail: any = null;
                for (let j = 0; j < loanDetails.length; j++) {
                    const loanDetail = loanDetails[j];
                    if (
                        loanDetail.status === WellKnownLoanPaymentStatus.PENDING
                    ) {
                        // response.push(loanDetail);
                        selectedLoanDetail = loanDetail;
                        break;
                    }
                }

                let today = new Date();
                today.setHours(0, 0, 0, 0);
                let arrearsAmount = 0;
                for (let j = 0; j < loanDetails.length; j++) {
                    const loanDetail: any = loanDetails[j];

                    if (
                        loanDetail.dueDate < today &&
                        loanDetail.status === WellKnownLoanPaymentStatus.PENDING
                    ) {
                        arrearsAmount +=
                            loanDetail.openingBalance + loanDetail.installment;
                    }
                }

                if (selectedLoanDetail) {
                    selectedLoanDetail.arrearsAmount = arrearsAmount;
                    response.push(selectedLoanDetail);
                }
            }
        }
    }

    return response;
};

const getDeductionChargeReportData = async (
    startDate: Date,
    endDate: Date,
    product: string,
    recoveryOfficer: string,
    searchType: number,
    searchCode: string,
    isDeductionChargesReducedFromLoan: number
) => {
    let query: any = {
        disbursementDate: { $gte: startDate, $lte: endDate },
        status: {
            $in: [WellKnownLoanStatus.RUNNING, WellKnownLoanStatus.COMPLETED],
        },
    };

    if (product !== '') {
        query.product = product;
    }

    if (recoveryOfficer !== '') {
        query.recoverOfficer = recoveryOfficer;
    }

    if (isDeductionChargesReducedFromLoan > 0) {
        let chargeDeduction =
            isDeductionChargesReducedFromLoan === 1 ? true : false;
        query.isDeductionChargesReducedFromLoan = chargeDeduction;
    }

    // searchType 1 = nic, 2= customercode, 3 = loan no
    if (searchType > 0) {
        let regexPattern = new RegExp(searchCode, 'i');
        if (searchType === 1) {
            const borrowers = await User.find({
                nicNumber: { $regex: regexPattern },
                role: constants.USER.ROLES.CUSTOMER,
            }).select('_id');

            query['borrower'] = { $in: borrowers.map((b) => b._id) };
        } else if (searchType === 2) {
            const borrowers = await User.find({
                customerCode: { $regex: regexPattern },
                role: constants.USER.ROLES.CUSTOMER,
            }).select('_id');
            query['borrower'] = { $in: borrowers.map((b) => b._id) };
        } else if (searchType === 3) {
            query['loanNumber'] = { $regex: regexPattern };
        }
    }

    const loanHeaders = await LoanHeader.find(query)
        .populate({
            path: 'product',
            select: '_id productName',
        })
        .populate({
            path: 'borrower',
            select: '_id nicNumber customerCode title initial firstName lastName fullName mobileNo1',
        })
        .lean();

    return loanHeaders;
};

const getInvestmentReportData = async (
    startDate: Date,
    endDate: Date,
    product: string,
    recoveryOfficer: string,
    searchType: number,
    searchCode: string
) => {
    let query: any = {
        disbursementDate: { $gte: startDate, $lte: endDate },
        status: {
            $in: [WellKnownLoanStatus.RUNNING, WellKnownLoanStatus.COMPLETED],
        },
    };

    if (product !== '') {
        query.product = product;
    }

    if (recoveryOfficer !== '') {
        query.recoverOfficer = recoveryOfficer;
    }

    // searchType 1 = nic, 2= customercode, 3 = loan no
    if (searchType > 0) {
        let regexPattern = new RegExp(searchCode, 'i');
        if (searchType === 1) {
            const borrowers = await User.find({
                nicNumber: { $regex: regexPattern },
                role: constants.USER.ROLES.CUSTOMER,
            }).select('_id');

            query['borrower'] = { $in: borrowers.map((b) => b._id) };
        } else if (searchType === 2) {
            const borrowers = await User.find({
                customerCode: { $regex: regexPattern },
                role: constants.USER.ROLES.CUSTOMER,
            }).select('_id');
            query['borrower'] = { $in: borrowers.map((b) => b._id) };
        } else if (searchType === 3) {
            query['loanNumber'] = { $regex: regexPattern };
        }
    }

    const loanHeaders = await LoanHeader.find(query)
        .populate({
            path: 'product',
            select: '_id productName productCode',
        })
        .populate({
            path: 'borrower',
            select: '_id nicNumber customerCode title initial firstName lastName fullName mobileNo1',
        })
        .lean();

    return loanHeaders;
};

const getNewlyAddLoansByDate = async (date: string) => {
    let startDate = new Date(date);
    let endDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const loanHeaders = await LoanHeader.find({
        createdAt: { $gte: startDate, $lte: endDate },
        status: {
            $in: [
                WellKnownLoanStatus.RUNNING,
                WellKnownLoanStatus.COMPLETED,
                WellKnownLoanStatus.PENDING,
            ],
        },
    })
        .populate({
            path: 'product',
            select: '_id productName productCode',
        })
        .populate({
            path: 'borrower',
            select: '_id nicNumber customerCode title fullName',
        })
        .populate({
            path: 'createdBy',
            select: '_id customerCode firstName lastName',
        })
        .sort({ createdAt: -1 })
        .lean();

    return loanHeaders;
};

const getTodayHandOverLoans = async (date: string) => {
    let startDate = new Date(date);
    let endDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const loanHeaders = await LoanHeader.find({
        disbursementDate: { $gte: startDate, $lte: endDate },
        status: {
            $in: [WellKnownLoanStatus.RUNNING, WellKnownLoanStatus.COMPLETED],
        },
    })
        .populate({
            path: 'product',
            select: '_id productName productCode',
        })
        .populate({
            path: 'borrower',
            select: '_id nicNumber customerCode title fullName',
        })
        .populate({
            path: 'handOverBy',
            select: '_id customerCode firstName lastName',
        });

    return loanHeaders;
};

const getTodayCollectionLoans = async (date: string) => {
    let startDate = new Date(date);
    let endDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const loanDetails = await LoanDetail.find({
        paymentDate: { $gte: startDate, $lte: endDate },
        isActualPayment: true,
        status: WellKnownLoanPaymentStatus.PAID,
    })
        .populate({
            path: 'loanHeader',
            select: '_id loanNumber amount loanSummary totalPaidAmount termsCount',
            populate: [
                {
                    path: 'product',
                    select: '_id productName productCode',
                },
                {
                    path: 'borrower',
                    select: '_id nicNumber customerCode title fullName',
                },
            ],
        })
        .populate({
            path: 'collectedBy',
            select: '_id customerCode firstName lastName',
        })
        .sort({ createdAt: -1 })
        .lean();

    let response: any[] = [];

    if (loanDetails.length > 0) {
        for (let i = 0; i < loanDetails.length; i++) {
            const loanDetail: any = loanDetails[i];

            let loanDetailsToCalc: any[] = await LoanDetail.find({
                loanHeader: loanDetail.loanHeader._id.toString(),
            })
                .sort({ detailIndex: 1 })
                .lean();

            let outstandingAmount =
                loanDetail?.loanHeader?.loanSummary?.agreedAmount || 0;
            let totalPaidAmount = 0;
            loanDetailsToCalc.forEach((item: any) => {
                if (
                    item.detailIndex <= loanDetail.detailIndex &&
                    item.isActualPayment
                ) {
                    totalPaidAmount += item.actualPaymentAmount;
                }
            });

            let balance = outstandingAmount - totalPaidAmount;
            loanDetail.balance = balance;

            response.push(loanDetail);
        }
    }

    return response;
};

const getTodayDeductionChargeLoans = async (date: string) => {
    let startDate = new Date(date);
    let endDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const loanHeaders = await LoanHeader.find({
        transactionDate: { $gte: startDate, $lte: endDate },
        status: {
            $in: [
                WellKnownLoanStatus.RUNNING,
                WellKnownLoanStatus.COMPLETED,
                WellKnownLoanStatus.PENDING,
            ],
        },
    })
        .populate({
            path: 'product',
            select: '_id productName productCode',
        })
        .populate({
            path: 'borrower',
            select: '_id nicNumber customerCode title fullName',
        })
        .populate({
            path: 'createdBy',
            select: '_id firstName lastName customerCode',
        })
        .lean();

    return loanHeaders;
};

export default {
    getRepaymentReportData,
    getDeductionChargeReportData,
    getInvestmentReportData,
    getNewlyAddLoansByDate,
    getTodayHandOverLoans,
    getTodayCollectionLoans,
    getTodayDeductionChargeLoans,
};
