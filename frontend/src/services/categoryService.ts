import axios from "axios";
import { CategoryModel } from "../models/CategoryModel";

const API_BASE_URL = "https://api.example.com/categories";

/**
 * 카테고리를 생성하고 서버에 저장합니다.
 * @param {CategoryModel} category - 생성할 카테고리 객체
 * @returns {Promise<void>}
 */
export const createCategoryInService = async (category: CategoryModel): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}`, category.toJson());
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

/**
 * 특정 categoryId로 서버에서 카테고리 데이터를 가져옵니다.
 * @param {string} categoryId - 가져올 카테고리의 ID
 * @returns {Promise<CategoryModel | null>}
 */
export const getCategoryInService = async (
  categoryId: string
): Promise<CategoryModel | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${categoryId}`);
    return CategoryModel.fromJson(response.data);
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
};

/**
 * 특정 categoryId로 서버에서 카테고리 데이터를 업데이트합니다.
 * @param {string} categoryId - 업데이트할 카테고리의 ID
 * @param {Partial<CategoryModel>} updatedData - 업데이트할 데이터 객체
 * @returns {Promise<void>}
 */
export const updateCategoryInService = async (
  categoryId: string,
  updatedData: Partial<CategoryModel>
): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/${categoryId}`, updatedData);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

/**
 * 특정 categoryId로 서버에서 카테고리 데이터를 삭제합니다.
 * @param {string} categoryId - 삭제할 카테고리의 ID
 * @returns {Promise<void>}
 */
export const deleteCategoryInService = async (categoryId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${categoryId}`);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};