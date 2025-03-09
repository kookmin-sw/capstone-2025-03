import axios from "axios";
import CategoryModel from "../models/CategoryModel";
import ProductModel from "../models/ProductModel";

const API_BASE_URL = "https://restart-s4b8.onrender.com";

/**
 * 배치 API: categoryIds와 productIds를 기반으로 카테고리 및 상품 데이터를 가져옴.
 * @param {number[]} categoryIds - 가져올 카테고리 ID 리스트
 * @param {number[]} productIds - 가져올 상품 ID 리스트
 * @returns {Promise<{ categories: CategoryModel[]; products: ProductModel[] }>}
 */
export const getCategoriesAndProductsInBatch = async (
  categoryIds: number[],
  productIds: number[]
): Promise<{ categories: CategoryModel[]; products: ProductModel[] }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, {
      categoryIds,
      productIds,
    });

    return {
      categories: response.data.categories.map((c: any) => CategoryModel.fromJson(c)),
      products: response.data.products.map((p: any) => ProductModel.fromJson(p)),
    };
  } catch (error) {
    console.error("Error fetching batch categories and products:", error);
    throw error;
  }
};
