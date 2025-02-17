import LoanDetail from '../model/loanDetail.model';

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

export default {
    save,
    hardDeleteDetailByLoanHeaderId,
    findAllByLoanHeaderId,
};
