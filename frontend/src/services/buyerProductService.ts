import axios from 'axios';
import BuyerProductModel from '../models/BuyerProductModel';

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/products`;

/**
 * 구매자 상품 리스트를 서버에서 요청하여 가져옵니다.
 * 페이지네이션을 지원하며, nextPageUrl이 없으면 기본 URL에서 시작합니다.
 * @param {string | null} nextPageUrl - 다음 페이지 URL (null이면 첫 페이지 요청)
 * @returns {Promise<{ results: BuyerProductModel[]; next: string | null } | null>}
 */
export const getBuyerProductListInService = async (
    nextPageUrl: string | null,
): Promise<{ results: BuyerProductModel[]; next: string | null } | null> => {
    try {
        const requestUrl = nextPageUrl ?? `${API_BASE_URL}/`;
        const response = await axios.get(requestUrl);
        const data = response.data;
        return {
            results: data.results.map((product: any) => BuyerProductModel.fromJson(product)),
            next: data.next
        };
    } catch (error) {
        console.error('Error fetching buyer products:', error);
        return null;
    }
};


/**
 * 구매자 상품을 생성하고 서버에 저장합니다.
 * @param {BuyerProductModel} product - 생성할 상품 객체
 * @returns {Promise<BuyerProductModel | null>}
 */
export const createBuyerProductInService = async (
    product: BuyerProductModel,
): Promise<BuyerProductModel | null> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/`, product.toJsonWithoutId());
        return BuyerProductModel.fromJson(response.data);
    } catch (error) {
        console.error('Error creating buyer product:', error);
        return null;
    }
};

/**
 * 특정 productId로 서버에서 구매자 상품 데이터를 가져옵니다.
 * @param {number} productId - 가져올 상품의 ID
 * @returns {Promise<BuyerProductModel | null>}
 */
export const getBuyerProductInService = async (
    productId: number,
): Promise<BuyerProductModel | null> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${productId}/`);
        return BuyerProductModel.fromJson(response.data);
    } catch (error) {
        console.error('Error fetching buyer product:', error);
        return null;
    }
};

/**
 * 특정 productId로 서버에서 구매자 상품 데이터를 업데이트합니다.
 * @param {number} productId - 업데이트할 상품의 ID
 * @param {Partial<BuyerProductModel>} updatedData - 업데이트할 데이터 객체
 * @returns {Promise<BuyerProductModel | null>}
 */
export const updateBuyerProductInService = async (
    productId: number,
    updatedData: Partial<BuyerProductModel>,
): Promise<BuyerProductModel | null> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${productId}/`, updatedData);
        return BuyerProductModel.fromJson(response.data);
    } catch (error) {
        console.error('Error updating buyer product:', error);
        return null;
    }
};

/**
 * 특정 productId로 서버에서 구매자 상품 데이터를 삭제합니다.
 * @param {number} productId - 삭제할 상품의 ID
 * @returns {Promise<boolean>}
 */
export const deleteBuyerProductInService = async (productId: number): Promise<boolean> => {
    try {
        await axios.delete(`${API_BASE_URL}/${productId}/`);
        return true;
    } catch (error) {
        console.error('Error deleting buyer product:', error);
        return false;
    }
};
