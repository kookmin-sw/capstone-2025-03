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
import { useEffect, useState } from "react";

export const useBuyerProduct = () => {
    const [buyerProducts, setBuyerProducts] = useRecoilState(buyerProductState);
    const [isTest, setIsTest] = useState(true);

    useEffect(() => {
        if (!isTest) return;
        // TODO: 지워야함
        const dummy = {
            "id": 1192,
            "categoryId": 2,
            "images": [
                "https://search.pstatic.net/common/?src=http%3A%2F%2Fshopping.phinf.naver.net%2Fmain_5219342%2F52193428036.20241230220850.jpg&type=sc960_832",
            ],
            "name": "전기오븐",
            "description": "개좋은 전기 오븐입니다",
            "grade": "A",
            "quantity": 50,
            "price": 12900,
            "sellerId": 501,
            "uploadDate": "2025-03-09T14:30:00.000Z",
            "buyerId": null,
            "purchaseDate": null,
            "salesStatus": "available"
        };
        setBuyerProducts((prev) => [...prev, BuyerProductModel.fromJson(dummy)]);
    }, []);

    // List Read
    const getBuyerProductList = async (): Promise<BuyerProductModel[] | null> => {
        const newBuyerProductList = await getBuyerProductListInService();
        // if (newBuyerProductList) setBuyerProducts(newBuyerProductList);
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