import { useRecoilState } from "recoil";
import { buyerProductState } from "../recoil/buyerProductState";
import {
    getBuyerProductListInService,
    createBuyerProductInService,
    getBuyerProductInService,
    updateBuyerProductInService,
    deleteBuyerProductInService
} from "../services/buyerProductService";
import BuyerProductModel from "../models/BuyerProductModel";
import productDummyData from "@/src/data/productDummyData.json";

const useDummyData = true;

export const useBuyerProduct = () => {
    const [buyerProducts, setBuyerProducts] = useRecoilState(buyerProductState);

    // List Read
    const getBuyerProductList = async (): Promise<BuyerProductModel[] | null> => {
        const newBuyerProductList = useDummyData
            ? productDummyData.map(product => BuyerProductModel.fromJson(product))
            : await getBuyerProductListInService();

        if (newBuyerProductList) setBuyerProducts(newBuyerProductList);
        return newBuyerProductList;
    };

    // Create
    const createBuyerProduct = async (buyerProductData: BuyerProductModel): Promise<BuyerProductModel | null> => {
        if (useDummyData) {
            const newProduct = BuyerProductModel.fromJson({ ...buyerProductData, id: buyerProducts.length + 1 }); // 임시 ID 생성
            setBuyerProducts(prevBuyerProducts => [...prevBuyerProducts, newProduct]);
            return newProduct;
        }

        const newBuyerProduct = await createBuyerProductInService(buyerProductData);
        if (newBuyerProduct) setBuyerProducts(prevBuyerProducts => [...prevBuyerProducts, newBuyerProduct]);
        return newBuyerProduct;
    };

    // Read
    const getBuyerProduct = async (productId: number): Promise<BuyerProductModel | null> => {
        if (useDummyData) {
            return buyerProducts.find(product => product.id === productId) || null;
        }

        const targetBuyerProduct = buyerProducts.find(product => product.id === productId);
        if (targetBuyerProduct) return targetBuyerProduct;

        const newBuyerProduct = await getBuyerProductInService(productId);
        if (newBuyerProduct) setBuyerProducts(prevBuyerProducts => [...prevBuyerProducts, newBuyerProduct]);
        return newBuyerProduct;
    };

    // Update
    const updateBuyerProduct = async (productId: number, updatedData: Partial<BuyerProductModel>): Promise<BuyerProductModel | null> => {
        if (useDummyData) {
            const updatedProducts = buyerProducts.map(product =>
                BuyerProductModel.fromJson(product.id === productId ? { ...product, ...updatedData } : product)
            );
            setBuyerProducts(updatedProducts);
            return updatedProducts.find(product => product.id === productId) || null;
        }

        const newBuyerProduct = await updateBuyerProductInService(productId, updatedData);
        if (newBuyerProduct) setBuyerProducts(prevBuyerProducts =>
            prevBuyerProducts.map(product => product.id === productId ? newBuyerProduct : product)
        );
        return newBuyerProduct;
    };

    // Delete
    const deleteBuyerProduct = async (productId: number): Promise<boolean> => {
        if (useDummyData) {
            setBuyerProducts(prevBuyerProducts => prevBuyerProducts.filter(product => product.id !== productId));
            return true;
        }

        const isSuccess = await deleteBuyerProductInService(productId);
        if (isSuccess) setBuyerProducts(prevBuyerProducts => prevBuyerProducts.filter(product => product.id !== productId));
        return isSuccess;
    };

    return {
        buyerProducts,
        getBuyerProductList,
        createBuyerProduct,
        getBuyerProduct,
        updateBuyerProduct,
        deleteBuyerProduct
    };
};