const save = async (loanDetail: any, session: any) => {
    if (session) {
        return await loanDetail.save({ session });
    } else {
        return await loanDetail.save({});
    }
};

export default { save };
