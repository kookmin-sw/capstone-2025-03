import axios from 'axios';
import ProductModel from '../models/ProductModel';

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/products`;

/**
 * 상품 리스트를 서버에서 요청하여 가져옵니다.
 * 페이지네이션을 지원하며, nextPageUrl이 없으면 기본 URL에서 시작합니다.
 * @param {string | null} nextPageUrl - 다음 페이지 URL (null이면 첫 페이지 요청)
 * @param {number} pageSize - 페이지 크기
 * @param {string} category - 카테고리
 * @returns {Promise<{ results: ProductModel[]; next: string | null } | null>}
 */
export const getProductListInService = async (
    nextPageUrl: string | null,
    pageSize: number,
    category: string,
): Promise<{
    results: ProductModel[];
    next: string | null;
} | null> => {
    try {
        const params: any = { page_size: pageSize };
        if (category != 'all') {
            params.category = category;
        }
        const requestUrl = nextPageUrl ?? `${API_BASE_URL}/`;
        const response = await axios.get(requestUrl, { params });
        const data = response.data;
        return {
            results: data.results.map((product: any) => ProductModel.fromJson(product)),
            next: data.next,
        };
    } catch (error) {
        console.error('Error fetching product list:', error);
        return null;
    }
};

/**
 * 상품을 생성하고 서버에 저장합니다.
 * @param {ProductModel} product - 생성할 상품 객체
 * @returns {Promise<ProductModel | null>}
 */
export const createProductInService = async (
    product: ProductModel,
): Promise<ProductModel | null> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/`, product.toJsonWithoutId());
        return ProductModel.fromJson(response.data);
    } catch (error) {
        console.error('Error creating product:', error);
        return null;
    }
};

/**
 * 특정 productId로 서버에서 상품 데이터를 가져옵니다.
 * @param {number} productId - 가져올 상품의 ID
 * @returns {Promise<ProductModel | null>}
 */
export const getProductInService = async (productId: number): Promise<ProductModel | null> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${productId}/`);
        return ProductModel.fromJson(response.data);
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

/**
 * 특정 productId로 서버에서 상품 데이터를 업데이트합니다.
 * @param {number} productId - 업데이트할 상품의 ID
 * @param {Partial<ProductModel>} updatedData - 업데이트할 데이터 객체
 * @returns {Promise<ProductModel | null>}
 */
export const updateProductInService = async (
    productId: number,
    updatedData: Partial<ProductModel>,
): Promise<ProductModel | null> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${productId}/`, updatedData);
        return ProductModel.fromJson(response.data);
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
};

/**
 * 특정 productId로 서버에서 상품 데이터를 삭제합니다.
 * @param {number} productId - 삭제할 상품의 ID
 * @returns {Promise<boolean>}
 */
export const deleteProductInService = async (productId: number): Promise<boolean> => {
    try {
        await axios.delete(`${API_BASE_URL}/${productId}/`);
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
};