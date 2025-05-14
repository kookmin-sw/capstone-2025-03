import axios from 'axios';
import CategoryModel from '../models/CategoryModel';
import ProductModel from '../models/ProductModel';

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
/**
 * 전체 카테고리 리스트를 가져옵니다.
 * @returns {Promise<CategoryModel[] | null>}
 */
export const getCategoryListInService = async (): Promise<CategoryModel[] | null> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories/`);
        return response.data.results.map((category: any) => CategoryModel.fromJson(category));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return null;
    }
};

/**
 * 카테고리를 생성하고 서버에 저장합니다. (`id` 제외)
 * @param {CategoryModel} category - 생성할 카테고리 객체
 * @returns {Promise<CategoryModel | null>}
 */
export const createCategoryInService = async (
    category: CategoryModel,
): Promise<CategoryModel | null> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/categories/`,
            category.toJsonWithoutId(),
        ); // `id` 제외
        return CategoryModel.fromJson(response.data); // 서버에서 생성된 id 포함된 객체 반환
    } catch (error) {
        console.error('Error creating category:', error);
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
        const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/`);
        return CategoryModel.fromJson(response.data);
    } catch (error) {
        console.error('Error fetching category:', error);
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
    updatedData: Partial<CategoryModel>,
): Promise<CategoryModel | null> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/categories/${categoryId}/`, updatedData);
        return CategoryModel.fromJson(response.data); // 업데이트된 카테고리 반환
    } catch (error) {
        console.error('Error updating category:', error);
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
        await axios.delete(`${API_BASE_URL}/${categoryId}/categories/`);
        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        return false;
    }
};

// 모든 카테고리 불러오기
export const getAllCategoryInService = async (): Promise<CategoryModel[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories/`);
        return response.data.map((category: any) => CategoryModel.fromJson(category));
    } catch (error) {
        console.error('Error fetching all categories:', error);
        throw error;
    }
};

// 랜덤 카테고리 불러오기
export const getRandomCategoriesInService = async (exclude_category_ids: number[]) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/categories/preview/`, {
            exclude_category_ids,
        });
        return response.data;
    } catch (error) {
        console.error('Error getting random categories: ', error);
    }
};

// 특정 카테고리 불러오기
export const getParticularCategoryInService = async (
    categoryId: number,
): Promise<ProductModel[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/`, {
            params: { category: categoryId },
        });
        return response.data.results.map((item: any) => ProductModel.fromJson(item));
        // return response.data;
    } catch (error) {
        console.error('Error fetching particular category products:', error);
        return [];
    }
};

// 랜덤 상품 추천
export const getRandomProductInService = async (categoryId: number, productId: number[]) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/categories/products-exclude/`, {
            category_id: categoryId,
            exclude_product_ids: productId,
        });
        return response.data;
    } catch (error) {
        console.error('Error getting random products: ', error);
    }
};
