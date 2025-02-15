const save = async (loanHeader: any, session: any) => {
    if (session) {
        return await loanHeader.save({ session });
    } else {
        return await loanHeader.save();
    }
};

export default { save };
