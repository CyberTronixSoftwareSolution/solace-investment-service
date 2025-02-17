import constants from '../../../constant';
import helperUtil from '../../../util/helper.util';
import LoanHeader from '../model/loanHeader.model';

const save = async (loanHeader: any, session: any) => {
    if (session) {
        return await loanHeader.save({ session });
    } else {
        return await loanHeader.save();
    }
};

const generateLoanId = async () => {
    let documentCount = ((await LoanHeader.countDocuments()) || 0) + 1;

    let loanNumber = helperUtil.createCodes(
        constants.CODEPREFIX.LOAN,
        documentCount
    );

    // let  find already exists loan number in db and increment it
    while (await LoanHeader.findOne({ loanNumber })) {
        documentCount += 1;
        loanNumber = helperUtil.createCodes(
            constants.CODEPREFIX.LOAN,
            documentCount
        );
    }

    return loanNumber;
};

const findAllLoansByStatusInAndCreatedByOrRecoverOfficer = async (
    status: number[],
    userId?: string
) => {
    const query: any = { status: { $in: status } };

    if (userId) {
        query.$or = [{ recoverOfficer: userId }];
    }

    return await LoanHeader.find(query)
        .populate([
            {
                path: 'borrower',
                select: '_id title firstName lastName customerCode',
            },
            { path: 'product', select: '_id productName productCode' },
            {
                path: 'createdBy',
                select: '_id firstName lastName customerCode',
            },
            {
                path: 'recoverOfficer',
                select: '_id firstName lastName customerCode',
            },
        ])
        .sort({ createdAt: -1 })
        .lean();
};

const findLoanHeaderByIdAndStatusIn = async (
    loanHeaderId: string,
    status: number[]
) =>
    await LoanHeader.findOne({
        _id: loanHeaderId,
        status: { $in: status },
    }).populate([
        { path: 'product', select: '_id productName productCode type' },
    ]);
export default {
    save,
    generateLoanId,
    findAllLoansByStatusInAndCreatedByOrRecoverOfficer,
    findLoanHeaderByIdAndStatusIn,
};
