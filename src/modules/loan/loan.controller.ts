import { Request, Response } from 'express';
import { startSession } from 'mongoose';

import loanValidation from './loan.validation';
import LoanDetail from './model/loanDetail.model';
import LoanHeader from './model/loanHeader.model';

import BadRequestError from '../../error/BadRequestError';

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

        for (let i = 1; i <= product.termsCount; i++) {
            let loanDetail = new LoanDetail();
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

const getAllLoans = async (req: Request, res: Response) => {};

const getLoanById = async (req: Request, res: Response) => {};

export { saveLoan, deleteLoan, getAllLoans, getLoanById };
