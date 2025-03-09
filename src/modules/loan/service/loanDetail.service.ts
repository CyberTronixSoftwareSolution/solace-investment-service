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

const searchPaymentByDueDate = async (collector: string, body: any) => {
    // running status loanId
    let loanIds: string[] = [];
    let filter: any = {
        status: {
            $in: [WellKnownLoanStatus.RUNNING],
        },
    };

    if (collector) {
        filter.recoverOfficer = collector;
    }

    if (body.searchType != '-1') {
        switch (body.searchType) {
            case '1':
                filter['borrower.customerCode'] = {
                    $regex: body.searchCode,
                    $options: 'i',
                };
                break;
            case '2':
                filter['borrower.nicNumber'] = {
                    $regex: body.searchCode,
                    $options: 'i',
                };
                break;
            case '3':
                filter.loanNumber = { $regex: body.searchCode, $options: 'i' };
                break;
        }
    }

    loanIds = (
        await LoanHeader.find(filter)
            .populate({
                path: 'borrower',
                select: 'nicNumber customerCode',
            })
            .select('_id')
            .lean()
    ).map((loan) => loan._id.toString());

    let result: any[] = [];

    for (let i = 0; i < loanIds.length; i++) {
        let loanDetails = await LoanDetail.find({
            loanHeader: loanIds[i],
            status: {
                $in: [
                    WellKnownLoanPaymentStatus.PENDING,
                    WellKnownLoanPaymentStatus.PAID,
                    WellKnownLoanPaymentStatus.SHIFTED,
                ],
            },
        })
            .sort({ detailIndex: 1 })
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

        // find first pending loan detail
        let selectedLoanDetails = loanDetails.find((loanDetail) => {
            return loanDetail.status == WellKnownLoanPaymentStatus.PENDING;
        });

        if (selectedLoanDetails) {
            result.push(selectedLoanDetails);
        }
    }

    return result;
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
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

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
        paymentDate: { $gte: startOfDay, $lte: endOfDay },
        status: {
            $in: [
                WellKnownLoanPaymentStatus.PAID,
                WellKnownLoanPaymentStatus.SHIFTED,
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
export default {
    save,
    hardDeleteDetailByLoanHeaderId,
    findAllByLoanHeaderId,
    searchPaymentByDueDate,
    findLoanDetailByIdAndStatusIn,
    searchPaymentReceiptByStartDateAndEndDate,
};
