import axios from 'axios';
import PackageModel from '../models/PackageModel';

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/packages`;

/**
 * 서버에서 패키지 리스트를 요청하여 가져옵니다.
 * 페이지네이션을 지원하며, nextPageUrl이 없을 경우 기본 URL에서 pageSize 만큼 데이터를 요청합니다.
 *
 * @param {string | null} nextPageUrl - 다음 페이지 URL (null이면 첫 페이지 요청)
 * @param {number} pageSize - 한 페이지에 불러올 패키지 개수
 * @param {string} industry - 업종
 * @returns {Promise<{
 *   results: PackageModel[];       // 파싱된 패키지 모델 리스트
 *   next: string | null;           // 다음 페이지 URL (더 이상 없으면 null)
 * } | null>} - 요청 실패 시 null 반환
 */
export const getPackageListInService = async (
    nextPageUrl: string | null,
    pageSize: number,
    industry: string,
): Promise<{
    results: PackageModel[];
    next: string | null;
} | null> => {
    try {
        // industry가 있을 때만 params에 포함
        const params: any = { page_size: pageSize };
        if (industry != 'all') {
            params.industry = industry;
        }
        const requestUrl = nextPageUrl ?? `${API_BASE_URL}/`;
        const response = await axios.get(requestUrl, { params });
        const data = response.data;

        return {
            results: data.results.map((pkg: any) => PackageModel.fromJson(pkg)),
            next: data.next,
        };
    } catch (error) {
        console.error('Error fetching packages:', error);
        return null;
    }
};

/**
 * 특정 user에 해당하는 모든 커스텀 패키지를 가져옵니다 (페이지네이션 없음).
 * @param {number} user - 사용자 ID
 * @returns {Promise<PackageModel[] | null>}
 */
export const getPackageListByUserInService = async (
    user: number,
): Promise<PackageModel[] | null> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/`, {
            params: { user: user },
        });
        const data = response.data;
        return data.results.map((pkg: any) => PackageModel.fromJson(pkg));
    } catch (error) {
        console.error('Error fetching all packages by user:', error);
        return null;
    }
};

/**
 * 패키지를 생성하고 서버에 저장합니다.
 * @param {PackageModel} packageData - 생성할 패키지 객체
 * @returns {Promise<PackageModel | null>}
 */
export const createPackageInService = async (
    packageData: PackageModel,
): Promise<PackageModel | null> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/`, packageData.toJsonWithoutId());
        return PackageModel.fromJson(response.data);
    } catch (error) {
        console.error('Error creating package:', error);
        return null;
    }
};

/**
 * 특정 packageId로 서버에서 패키지 데이터를 가져옵니다.
 * @param {number} packageId - 가져올 패키지의 ID
 * @returns {Promise<PackageModel | null>}
 */
export const getPackageInService = async (packageId: number): Promise<PackageModel | null> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${packageId}/`);
        return PackageModel.fromJson(response.data);
    } catch (error) {
        console.error('Error fetching package:', error);
        return null;
    }
};

/**
 * 특정 packageId로 서버에서 패키지 데이터를 업데이트합니다.
 * @param {number} packageId - 업데이트할 패키지의 ID
 * @param {Partial<PackageModel>} updatedData - 업데이트할 데이터 객체
 * @returns {Promise<PackageModel | null>}
 */
export const updatePackageInService = async (
    packageId: number,
    updatedData: Partial<PackageModel>,
): Promise<PackageModel | null> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${packageId}/`, updatedData);
        return PackageModel.fromJson(response.data);
    } catch (error) {
        console.error('Error updating package:', error);
        return null;
    }
};

/**
 * 특정 packageId로 서버에서 패키지 데이터를 삭제합니다.
 * @param {number} packageId - 삭제할 패키지의 ID
 * @returns {Promise<boolean>}
 */
export const deletePackageInService = async (packageId: number): Promise<boolean> => {
    try {
        await axios.delete(`${API_BASE_URL}/${packageId}/`);
        return true;
    } catch (error) {
        console.error('Error deleting package:', error);
        return false;
    }
};
