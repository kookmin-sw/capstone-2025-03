import axios from "axios";
import SellerProductModel from "../models/SellerProductModel";

const API_BASE_URL = "https://django-uxvt.onrender.com";
const IMAGE_BASE_URL = "https://image-535482967924.asia-northeast1.run.app";
// const AI_BASE_URL = "https://fastapi-lokg.onrender.com";
/**
 * 상품을 생성하고 서버에 저장합니다.
 * @param {ProductModel} product - 생성할 상품 객체
 * @returns {Promise<void>}
 */

export const createProductInService = async (
  product: SellerProductModel
): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/products/`, product.toJson());
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * 상품을 이미지를 서버에 저장합니다.
 * @param {File} file
 * @returns {Promise<string>}
 */
export const uploadProductImageInService = async (
  file: File
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const response = await axios.post(`${IMAGE_BASE_URL}/upload/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.image_url;
  } catch (error) {
    console.error("Error uploading product image:", error);
    throw error;
  }
};

// 특정 사용자의 판매 상품들 가져오기
export const getUserProductListInService = async (id: number): Promise<SellerProductModel[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/`, {params: {seller: id}})
    return response.data.results;
  } catch (error) {
    console.error("Error getting selling products: ", error)
    throw error
  }
}



/**
 * 특정 productId로 서버에서 상품 데이터를 가져옵니다.
 * @param {string} productId - 가져올 상품의 ID
 * @returns {Promise<ProductModel | null>}
 */
export const getProductInService = async (
  productId: string
): Promise<SellerProductModel | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${productId}`);
    return SellerProductModel.fromJson(response.data);
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
  updatedData: Partial<SellerProductModel>
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

// AI 가 예측한 적정 판매가격을 반환
// export const predictedPrice = async (: string, ) => {
//   try {
//     // const response = await axios.get(`${AI_BASE_URL}/predict`);
//   } catch (error) {
//     console.log("Error predicting price: ", error);
//     throw error;
//   }
// };
