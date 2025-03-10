import { WellKnownLoanPaymentStatus } from '../../util/enums/well-known-loan-payment-status.enum';
import { WellKnownLoanStatus } from '../../util/enums/well-known-loan-status.enum';
import LoanDetail from '../loan/model/loanDetail.model';
import LoanHeader from '../loan/model/loanHeader.model';

const calculateTodayCollection = async () => {
    let startDate = new Date();
    let endDate = new Date();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    let loanDetails = await LoanDetail.find({
        paymentDate: { $gte: startDate, $lte: endDate },
        isActualPayment: true,
    });

    let totalCollection = 0;
    totalCollection = loanDetails.reduce(
        (acc, loanDetail) => acc + loanDetail.actualPaymentAmount,
        0
    );

    return totalCollection;
};

const getTotalArrearsAmount = async () => {
    let totalArrearsAmount = 0;

    // Query to find all running loans
    const query = {
        status: { $in: [WellKnownLoanStatus.RUNNING] },
    };

    const loanHeaderIds = (
        await LoanHeader.find(query).select('_id').lean()
    ).map((loan) => loan._id.toString());

    if (loanHeaderIds.length > 0) {
        for (const loanHeaderId of loanHeaderIds) {
            const loanDetails = await LoanDetail.find({
                loanHeader: loanHeaderId,
            })
                .select('dueDate status openingBalance installment')
                .lean();

            let today = new Date();
            today.setHours(0, 0, 0, 0);

            for (const loanDetail of loanDetails) {
                if (
                    loanDetail.dueDate < today &&
                    loanDetail.status === WellKnownLoanPaymentStatus.PENDING
                ) {
                    totalArrearsAmount +=
                        loanDetail.openingBalance + loanDetail.installment;
                }
            }
        }
    }

    return totalArrearsAmount;
};

// const getMonthlyCollection = async (year: number, month: number) => {
//     let startOfMonth = new Date(year, month - 1, 1); // First day of the month
//     let endOfMonth = new Date(year, month, 0); // Last day of the month

//     let collections = [];

//     for (
//         let date = new Date(startOfMonth);
//         date <= endOfMonth;
//         date.setDate(date.getDate() + 1)
//     ) {
//         let startDate = new Date(date);
//         let endDate = new Date(date);
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(23, 59, 59, 999);

//         let loanDetails = await LoanDetail.find({
//             paymentDate: { $gte: startDate, $lte: endDate },
//             isActualPayment: true,
//         });

//         let totalCollection = loanDetails.reduce(
//             (acc, loanDetail) => acc + loanDetail.actualPaymentAmount,
//             0
//         );

//         collections.push({
//             date: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
//             collectionAmount: totalCollection,
//         });
//     }

//     return collections;
// };

const getMonthlyCollection = async (year: number, month: number) => {
    // First day of the specified month
    let startOfMonth = new Date(year, month - 1, 1);
    let endOfMonth = new Date(year, month, 0);

    let daysForMonth: any = [];

    for (let i = 2; i <= endOfMonth.getDate() + 1; i++) {
        let date = new Date(year, month - 1, i);
        daysForMonth.push(date.toISOString().split('T')[0]);
    }

    let collections: any[] = [];

    for (let i = 0; i < daysForMonth.length; i++) {
        let startDate = new Date(daysForMonth[i]);
        let endDate = new Date(daysForMonth[i]);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        let loanDetails = await LoanDetail.find({
            paymentDate: { $gte: startDate, $lte: endDate },
            isActualPayment: true,
        });

        let totalCollection = loanDetails.reduce(
            (acc, loanDetail) => acc + loanDetail.actualPaymentAmount,
            0
        );

        collections.push({
            date: daysForMonth[i], // Format as YYYY-MM-DD
            collectionAmount: totalCollection,
        });
    }

    // for (
    //     let date = new Date(startOfMonth);
    //     date <= endOfMonth;
    //     date.setDate(date.getDate() + 1)
    // ) {
    //     let startDate = new Date(date);
    //     let endDate = new Date(date);
    //     startDate.setHours(0, 0, 0, 0);
    //     endDate.setHours(23, 59, 59, 999);

    // let loanDetails = await LoanDetail.find({
    //     paymentDate: { $gte: startDate, $lte: endDate },
    //     isActualPayment: true,
    // });

    // let totalCollection = loanDetails.reduce(
    //     (acc, loanDetail) => acc + loanDetail.actualPaymentAmount,
    //     0
    // );

    // collections.push({
    //     date: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
    //     collectionAmount: totalCollection,
    // });
    // }

    return collections;
};

export default {
    calculateTodayCollection,
    getTotalArrearsAmount,
    getMonthlyCollection,
};
