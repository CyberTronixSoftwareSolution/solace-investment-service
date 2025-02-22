import { WellKnownLoanPaymentStatus } from '../../../util/enums/well-known-loan-payment-status.enum';
import { WellKnownLoanStatus } from '../../../util/enums/well-known-loan-status.enum';
import LoanDetail from '../model/loanDetail.model';
import LoanHeader from '../model/loanHeader.model';

const save = async (loanDetail: any, session: any) => {
    if (session) {
        return await loanDetail.save({ session });
    } else {
        return await loanDetail.save({});
    }
};

const hardDeleteDetailByLoanHeaderId = async (
    loanHeaderId: any,
    session: any
) => {
    if (session) {
        return await LoanDetail.deleteMany(
            { loanHeader: loanHeaderId },
            { session }
        );
    } else {
        return await LoanDetail.deleteMany({ loanHeader: loanHeaderId });
    }
};

const findAllByLoanHeaderId = async (loanHeaderId: any) => {
    return await LoanDetail.find({ loanHeader: loanHeaderId })
        .populate({
            path: 'collectedBy',
            select: '_id firstName lastName',
        })
        .sort({ detailIndex: 1 });
};

const searchPaymentByDueDate = async (dueDate: Date, collector: string) => {
    // running status loanId
    let loanIds: string[] = [];

    if (collector) {
        loanIds = (
            await LoanHeader.find({
                status: WellKnownLoanStatus.RUNNING,
                recoverOfficer: collector,
            })
                .select('_id')
                .lean()
        ).map((loan) => loan._id.toString());
    } else {
        loanIds = (
            await LoanHeader.find({
                status: WellKnownLoanStatus.RUNNING,
            })
                .select('_id')
                .lean()
        ).map((loan) => loan._id.toString());
    }

    // find loan details by loanId and dueDate and status pending
    const loanDetails = await LoanDetail.find({
        loanHeader: { $in: loanIds },
        dueDate: dueDate,
        status: {
            $in: [
                WellKnownLoanPaymentStatus.PENDING,
                WellKnownLoanPaymentStatus.PAID,
            ],
        },
    })
        .populate({
            path: 'loanHeader',
            select: '_id loanNumber amount loanSummary totalPaidAmount termsCount',
            populate: [
                {
                    path: 'product',
                    select: '_id productName',
                },
                {
                    path: 'borrower',
                    select: '_id nicNumber customerCode title initial firstName lastName fullName',
                },
            ],
        })
        .lean();

    return loanDetails;
};

const findLoanDetailByIdAndStatusIn = async (
    loanDetailId: string,
    status: number[]
) => {
    return await LoanDetail.findOne({
        _id: loanDetailId,
        status: { $in: status },
    });
};

const searchPaymentReceiptByStartDateAndEndDate = async (
    startDate: Date,
    endDate: Date,
    collector: string
) => {
    // running status loanId
    let loanIds: string[] = [];

    if (collector) {
        loanIds = (
            await LoanHeader.find({
                status: {
                    $in: [
                        WellKnownLoanStatus.RUNNING,
                        WellKnownLoanStatus.COMPLETED,
                    ],
                },
                recoverOfficer: collector,
            })
                .select('_id')
                .lean()
        ).map((loan) => loan._id.toString());
    } else {
        loanIds = (
            await LoanHeader.find({
                status: {
                    $in: [
                        WellKnownLoanStatus.RUNNING,
                        WellKnownLoanStatus.COMPLETED,
                    ],
                },
            })
                .select('_id')
                .lean()
        ).map((loan) => loan._id.toString());
    }

    // find loan details by loanId and dueDate and status pending
    const loanDetails = await LoanDetail.find({
        loanHeader: { $in: loanIds },
        dueDate: { $gte: startDate, $lte: endDate },
        status: {
            $in: [WellKnownLoanPaymentStatus.PAID],
        },
    })
        .populate({
            path: 'loanHeader',
            select: '_id loanNumber amount loanSummary totalPaidAmount termsCount',
            populate: [
                {
                    path: 'product',
                    select: '_id productName',
                },
                {
                    path: 'borrower',
                    select: '_id nicNumber customerCode title initial firstName lastName fullName',
                },
            ],
        })
        .lean();

    return loanDetails;
};
export default {
    save,
    hardDeleteDetailByLoanHeaderId,
    findAllByLoanHeaderId,
    searchPaymentByDueDate,
    findLoanDetailByIdAndStatusIn,
    searchPaymentReceiptByStartDateAndEndDate,
};
