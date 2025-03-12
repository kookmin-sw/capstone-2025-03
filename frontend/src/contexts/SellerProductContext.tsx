import React, { createContext, useContext, useState, ReactNode } from "react";
import SellerProductModel from "../models/SellerProductModel";
import {
  createProductInService,
  uploadProductImageInService,
  getUserProductListInService,
} from "../services/sellerProductService";

// Context에서 사용할 타입 정의
interface SellerProductContextType {
  sellerProduct: SellerProductModel;
  createSellerProduct: (newProduct: SellerProductModel) => Promise<void>;
  setSellerProduct: React.Dispatch<React.SetStateAction<SellerProductModel>>;
  uploadProductImage: (file: File) => Promise<string | null>;
  getProductList: (id: number) => Promise<SellerProductModel[] | null>;
}

// Context 생성
const SellerProductContext = createContext<
  SellerProductContextType | undefined
>(undefined);

// Provider 컴포넌트
export const SellerProductProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [sellerProduct, setSellerProduct] = useState<SellerProductModel>(
    {} as SellerProductModel
  );

  // 상품 생성
  const createSellerProduct = async (newProduct: SellerProductModel) => {
    try {
      await createProductInService(newProduct);
    } catch (error) {
      console.error("Error creating product in context:", error);
      throw error;
    }
  };

  const uploadProductImage = async (file: File): Promise<string | null> => {
    try {
      const imageUrl = await uploadProductImageInService(file);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image in product", error);
      return null;
    }
  };

  const getProductList = async (id: number): Promise<SellerProductModel[] | null> => {
    try {
      const productList = await getUserProductListInService(id);
      console.log(productList)
      return productList;
    } catch (error) {
      console.error("Error getting productlist", error);
      return null;
    }
  };

  return (
    <SellerProductContext.Provider
      value={{
        sellerProduct,
        createSellerProduct,
        setSellerProduct,
        uploadProductImage,
        getProductList
      }}
    >
      {children}
    </SellerProductContext.Provider>
  );
};

// Context를 사용하는 커스텀 훅
export const useSellerProduct = (): SellerProductContextType => {
  const context = useContext(SellerProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
