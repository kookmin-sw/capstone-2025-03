import axios from "axios";
import ProductModel from "../models/ProductModel";

const API_BASE_URL = "https://api.example.com/products";

/**
 * 상품을 생성하고 서버에 저장합니다.
 * @param {ProductModel} product - 생성할 상품 객체
 * @returns {Promise<void>}
 */
export const createProductInService = async (
  product: ProductModel
): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}`, product.toJson());
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * 상품을 생성하고 서버에 저장합니다.
 * @param {File} file - 생성할 상품 객체
 * @returns {Promise<string>}
 */
export const uploadProductImageInService = async (
  file: File
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const response = await axios.post(`${API_BASE_URL}/upload/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.imageUrl;
  } catch (error) {
    console.error("Error uploading product image:", error);
    throw error;
  }
};

/**
 * 특정 productId로 서버에서 상품 데이터를 가져옵니다.
 * @param {string} productId - 가져올 상품의 ID
 * @returns {Promise<ProductModel | null>}
 */
export const getProductInService = async (
  productId: string
): Promise<ProductModel | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${productId}`);
    return ProductModel.fromJson(response.data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

/**
 * 특정 productId로 서버에서 상품 데이터를 업데이트합니다.
 * @param {string} productId - 업데이트할 상품의 ID
 * @param {Partial<ProductModel>} updatedData - 업데이트할 데이터 객체
 * @returns {Promise<void>}
 */
export const updateProductInService = async (
  productId: string,
  updatedData: Partial<ProductModel>
): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/${productId}`, updatedData);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/**
 * 특정 productId로 서버에서 상품 데이터를 삭제합니다.
 * @param {string} productId - 삭제할 상품의 ID
 * @returns {Promise<void>}
 */
export const deleteProductInService = async (
  productId: string
): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${productId}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
