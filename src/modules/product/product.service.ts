import Product from './product.model';
import { WellKnownStatus } from '../../util/enums/well-known-status.enum';

const save = async (product: any, session: any) => {
    if (session) {
        return await product.save({ session });
    } else {
        return await product.save();
    }
};

const CheckProductCode = async (code: string, productId: string) => {
    let product: any = null;
    if (productId) {
        product = await Product.findOne({
            productCode: { $regex: `^${code}$`, $options: 'i' },
            status: {
                $in: [WellKnownStatus.ACTIVE, WellKnownStatus.INACTIVE],
            },
            _id: { $ne: productId },
        });
    } else {
        product = await Product.findOne({
            productCode: { $regex: `^${code}$`, $options: 'i' },
            status: {
                $in: [WellKnownStatus.ACTIVE, WellKnownStatus.INACTIVE],
            },
        });
    }

    return product ? true : false;
};

const findProductByIdAndStatusIn = async (id: string, status: number[]) => {
    return await Product.findOne({ _id: id, status: { $in: status } });
};

const findAllProductsByStatusIn = async (status: number[]) => {
    return await Product.find({ status: { $in: status } })
        .populate([
            {
                path: 'createdBy',
                select: '_id firstName lastName customerCode',
            },
            {
                path: 'updatedBy',
                select: '_id firstName lastName customerCode',
            },
        ])
        .sort({
            createdAt: -1,
        });
};
export default {
    save,
    CheckProductCode,
    findProductByIdAndStatusIn,
    findAllProductsByStatusIn,
};
