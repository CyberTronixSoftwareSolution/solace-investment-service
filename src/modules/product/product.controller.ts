import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import productValidation from './product.validation';
import CommonResponse from '../../util/commonResponse';
import Product from './product.model';

import BadRequestError from '../../error/BadRequestError';
import productService from './product.service';
import { WellKnownStatus } from '../../util/enums/well-known-status.enum';
import ProductResponseDto from './dto/productResponseDto';
import productUtil from './product.util';

const saveProduct = async (req: Request, res: Response) => {
    const body: any = req.body;
    const auth: any = req.auth;

    const { error } = productValidation.productSchema.validate(body);
    if (error) {
        throw new BadRequestError(error.message);
    }

    try {
        // Check product code exists or not
        const existProduct: any = await productService.CheckProductCode(
            body.productCode,
            ''
        );

        if (existProduct) {
            throw new BadRequestError(
                'Can not create product with duplicated product code!'
            );
        }

        let rateAmount: number = 0;
        if (body.isPercentage) {
            rateAmount = (body.amount / 100) * body.rate;
        } else {
            rateAmount = body.rate;
        }

        // Check deduction charges
        let deductionCharges: any[] = [];
        if (!body.isOpenDeductionCharges) {
            body.deductionCharges.forEach((element: any) => {
                let rate: number = 0;
                if (element.isPercentage) {
                    rate = (element.amount / 100) * element.rate;
                } else {
                    rate = element.rate;
                }

                deductionCharges.push({
                    deductionChargeName: element.deductionChargeName,
                    isPercentage: element.isPercentage,
                    rate: rate,
                    amount: element.amount,
                });
            });
        }

        let product = new Product({
            productName: body.productName,
            productCode: body.productCode,
            isPercentage: body.isPercentage,
            rate: body.rate,
            rateAmount: rateAmount,
            amount: body.amount,
            maxAmount: body.maxAmount,
            minAmount: body.minAmount,
            termsCount: body.termsCount,
            type: body.type,
            isOpenDeductionCharges: body.isOpenDeductionCharges,
            deductionCharges: deductionCharges,
            createdBy: auth.id,
            updatedBy: auth.id,
        });

        await productService.save(product, null);

        CommonResponse(
            res,
            true,
            StatusCodes.OK,
            'Product created successfully!.',
            product
        );
    } catch (error) {
        throw error;
    }
};

const updateProduct = async (req: Request, res: Response) => {
    const body: any = req.body;
    const auth: any = req.auth;
    const id: string = req.params.id;

    const { error } = productValidation.productSchema.validate(body);
    if (error) {
        throw new BadRequestError(error.message);
    }

    try {
        // check product exist
        let product: any = await productService.findProductByIdAndStatusIn(id, [
            WellKnownStatus.ACTIVE,
            WellKnownStatus.INACTIVE,
        ]);

        if (!product) {
            throw new BadRequestError('Product not found!');
        }

        // Check product code exists or not
        const existProduct: any = await productService.CheckProductCode(
            body.productCode,
            id
        );

        if (existProduct) {
            throw new BadRequestError(
                'Can not update product with duplicated product code!'
            );
        }

        let rateAmount: number = 0;
        if (body.isPercentage) {
            rateAmount = (body.amount / 100) * body.rate;
        } else {
            rateAmount = body.rate;
        }

        // Check deduction charges
        let deductionCharges: any[] = [];
        if (!body.isOpenDeductionCharges) {
            body.deductionCharges.forEach((element: any) => {
                let rate: number = 0;
                if (element.isPercentage) {
                    rate = (element.amount / 100) * element.rate;
                } else {
                    rate = element.rate;
                }

                deductionCharges.push({
                    deductionChargeName: element.deductionChargeName,
                    isPercentage: element.isPercentage,
                    rate: rate,
                    amount: element.amount,
                });
            });
        }

        product.productName = body.productName;
        product.productCode = body.productCode;
        product.isPercentage = body.isPercentage;
        product.rate = body.rate;
        product.rateAmount = rateAmount;
        product.amount = body.amount;
        product.maxAmount = body.maxAmount;
        product.minAmount = body.minAmount;
        product.termsCount = body.termsCount;
        product.type = body.type;
        product.isOpenDeductionCharges = body.isOpenDeductionCharges;
        product.deductionCharges = deductionCharges;
        product.updatedBy = auth.id;

        await productService.save(product, null);

        CommonResponse(
            res,
            true,
            StatusCodes.OK,
            'Product updated successfully!.',
            product
        );
    } catch (error) {
        throw error;
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const auth: any = req.auth;

    try {
        // check product exist
        let product: any = await productService.findProductByIdAndStatusIn(id, [
            WellKnownStatus.ACTIVE,
            WellKnownStatus.INACTIVE,
        ]);

        if (!product) {
            throw new BadRequestError('Product not found or already deleted!');
        }

        // check  reference exist

        product.status = WellKnownStatus.DELETED;
        product.updatedBy = auth.id;

        await productService.save(product, null);

        CommonResponse(
            res,
            true,
            StatusCodes.OK,
            'Product deleted successfully!.',
            product
        );
    } catch (error) {
        throw error;
    }
};

const getAllProducts = async (req: Request, res: Response) => {
    const withInactive = req.query.withInactive === 'false' ? false : true;

    try {
        let products: any[] = [];
        if (withInactive) {
            products = await productService.findAllProductsByStatusIn([
                WellKnownStatus.ACTIVE,
                WellKnownStatus.INACTIVE,
            ]);
        } else {
            products = await productService.findAllProductsByStatusIn([
                WellKnownStatus.ACTIVE,
            ]);
        }

        let response: ProductResponseDto[] =
            productUtil.productModelsToProductResponseDtos(products);

        CommonResponse(res, true, StatusCodes.OK, '', response);
    } catch (error) {
        throw error;
    }
};

const activeInactive = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const auth: any = req.auth;

    try {
        // check product exist
        let product: any = await productService.findProductByIdAndStatusIn(id, [
            WellKnownStatus.ACTIVE,
            WellKnownStatus.INACTIVE,
        ]);

        if (!product) {
            throw new BadRequestError('Product not found!');
        }

        // check  reference exist

        let message: string = '';
        if (product.status === WellKnownStatus.ACTIVE) {
            product.status = WellKnownStatus.INACTIVE;
            message = 'Product inactivated successfully!.';
        } else {
            product.status = WellKnownStatus.ACTIVE;
            message = 'Product activated successfully!.';
        }

        product.updatedBy = auth.id;

        await productService.save(product, null);

        CommonResponse(res, true, StatusCodes.OK, message, product);
    } catch (error) {
        throw error;
    }
};

const getProductById = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        // check product exist
        let product: any = await productService.findProductByIdAndStatusIn(id, [
            WellKnownStatus.ACTIVE,
            WellKnownStatus.INACTIVE,
        ]);

        if (!product) {
            throw new BadRequestError('Product not found!');
        }

        CommonResponse(res, true, StatusCodes.OK, '', product);
    } catch (error) {
        throw error;
    }
};

export {
    saveProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    activeInactive,
    getProductById,
};
