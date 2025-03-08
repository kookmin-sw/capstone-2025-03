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

export const useBuyerProduct = () => {
    const [buyerProducts, setBuyerProducts] = useRecoilState(buyerProductState);

    // List Read
    const getBuyerProductList = async (): Promise<BuyerProductModel[] | null> => {
        const newBuyerProductList = await getBuyerProductListInService();
        if (newBuyerProductList) setBuyerProducts(newBuyerProductList);
        return newBuyerProductList;
    };

    // Create
    const createBuyerProduct = async (buyerProductData: BuyerProductModel): Promise<BuyerProductModel | null> => {
        const newBuyerProduct = await createBuyerProductInService(buyerProductData);
        if (newBuyerProduct) setBuyerProducts(prevBuyerProducts => [...prevBuyerProducts, newBuyerProduct]);
        return newBuyerProduct;
    };

    // Read
    const getBuyerProduct = async (productId: number): Promise<BuyerProductModel | null> => {
        const targetBuyerProduct = buyerProducts.find((product) => product.id === productId);
        if (targetBuyerProduct) return targetBuyerProduct;
        const newBuyerProduct = await getBuyerProductInService(productId);
        if (newBuyerProduct) setBuyerProducts(prevBuyerProducts => [...prevBuyerProducts, newBuyerProduct]);
        return newBuyerProduct;
    };

    // Update
    const updateBuyerProduct = async (productId: number, updatedData: Partial<BuyerProductModel>): Promise<BuyerProductModel | null> => {
        const newBuyerProduct = await updateBuyerProductInService(productId, updatedData);
        if (newBuyerProduct) setBuyerProducts(prevBuyerProducts => 
            prevBuyerProducts.map((product) => product.id === productId ? newBuyerProduct : product)
        );
        return newBuyerProduct;
    };

    // Delete
    const deleteBuyerProduct = async (productId: number): Promise<boolean> => {
        const isSuccess = await deleteBuyerProductInService(productId);
        if (isSuccess) setBuyerProducts(prevBuyerProducts => prevBuyerProducts.filter((product) => product.id !== productId));
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