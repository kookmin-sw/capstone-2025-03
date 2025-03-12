import axios from "axios";
import CategoryModel from "../models/CategoryModel";

const API_BASE_URL = "https://django-uxvt.onrender.com/categories";

/**
 * 전체 카테고리 리스트를 가져옵니다.
 * @returns {Promise<CategoryModel[] | null>}
 */
export const getCategoryListInService = async (): Promise<CategoryModel[] | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data.map((category: any) => CategoryModel.fromJson(category));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

/**
 * 카테고리를 생성하고 서버에 저장합니다. (`id` 제외)
 * @param {CategoryModel} category - 생성할 카테고리 객체
 * @returns {Promise<CategoryModel | null>}
 */
export const createCategoryInService = async (category: CategoryModel): Promise<CategoryModel | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/`, category.toJsonWithoutId()); // `id` 제외
    return CategoryModel.fromJson(response.data); // 서버에서 생성된 id 포함된 객체 반환
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
};

/**
 * 특정 categoryId로 서버에서 카테고리 데이터를 가져옵니다.
 * @param {number} categoryId - 가져올 카테고리의 ID
 * @returns {Promise<CategoryModel | null>}
 */
export const getCategoryInService = async (categoryId: number): Promise<CategoryModel | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${categoryId}/`);
    return CategoryModel.fromJson(response.data);
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
};

/**
 * 특정 categoryId로 서버에서 카테고리 데이터를 업데이트합니다.
 * @param {number} categoryId - 업데이트할 카테고리의 ID
 * @param {Partial<CategoryModel>} updatedData - 업데이트할 데이터 객체
 * @returns {Promise<CategoryModel | null>}
 */
export const updateCategoryInService = async (
  categoryId: number,
  updatedData: Partial<CategoryModel>
): Promise<CategoryModel | null> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${categoryId}/`, updatedData);
    return CategoryModel.fromJson(response.data); // 업데이트된 카테고리 반환
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
  }
};

/**
 * 특정 categoryId로 서버에서 카테고리 데이터를 삭제합니다.
 * @param {number} categoryId - 삭제할 카테고리의 ID
 * @returns {Promise<boolean>}
 */
export const deleteCategoryInService = async (categoryId: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/${categoryId}/`);
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
};

// 모든 카테고리 불러오기
export const getAllCategoryInService = async (): Promise<CategoryModel[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    console.log("response")
    return response.data.map((category: any) =>
      CategoryModel.fromJson(category)
    );
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error;
  }
};