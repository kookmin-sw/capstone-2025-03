import React, { createContext, useContext, useState, ReactNode } from "react";
import ProductModel from "../models/ProductModel";
import {
  createProductInService,
  uploadProductImageInService,
  getProductInService,
  updateProductInService,
  deleteProductInService,
} from "../services/productService";

// Context에서 사용할 타입 정의
interface ProductContextType {
  products: ProductModel[];
  fetchProduct: (productId: number) => Promise<ProductModel | null>;
  createProduct: (newProduct: ProductModel) => Promise<void>;
  updateProduct: (
    productId: number,
    updatedData: Partial<ProductModel>
  ) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  setProducts: React.Dispatch<React.SetStateAction<ProductModel[]>>;
  uploadProductImage: (file: File) => Promise<string | null>;
}

// Context 생성
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider 컴포넌트
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductModel[]>([]);

  // 상품 생성
  const createProduct = async (newProduct: ProductModel) => {
    try {
      await createProductInService(newProduct);
      setProducts((prev) => [...prev, newProduct]);
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

  // 특정 상품 가져오기
  const fetchProduct = async (
    productId: number
  ): Promise<ProductModel | null> => {
    try {
      const existingProduct = products.find(
        (product) => product.id === productId
      );
      if (existingProduct) return existingProduct;

      const fetchedProduct = await getProductInService(productId);
      if (fetchedProduct) {
        setProducts((prev) => [...prev, fetchedProduct]);
      }
      return fetchedProduct;
    } catch (error) {
      console.error("Error fetching product in context:", error);
      return null;
    }
  };

  // 상품 업데이트
  const updateProduct = async (
    productId: number,
    updatedData: Partial<ProductModel>
  ) => {
    try {
      await updateProductInService(productId, updatedData);
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? new ProductModel({ ...product, ...updatedData })
            : product
        )
      );
    } catch (error) {
      console.error("Error updating product in context:", error);
      throw error;
    }
  };

  // 상품 삭제
  const deleteProduct = async (productId: number) => {
    try {
      await deleteProductInService(productId);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product in context:", error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        fetchProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        setProducts,
        uploadProductImage,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Context를 사용하는 커스텀 훅
export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
