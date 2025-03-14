import axios from "axios";
import PackageModel from "../models/PackageModel";

const API_BASE_URL = "https://django-uxvt.onrender.com/packages";

/**
 * 서버에서 모든 패키지 데이터를 가져옵니다.
 * @returns {Promise<PackageModel[] | null>}
 */
export const getPackageListInService = async (): Promise<PackageModel[] | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    const packages = response.data.results ?? []; // 'results'가 없을 경우 빈 배열 사용
    return packages.map((pkg: any) => PackageModel.fromJson(pkg));
  } catch (error) {
    console.error("Error fetching packages:", error);
    return null;
  }
};

/**
 * 패키지를 생성하고 서버에 저장합니다.
 * @param {PackageModel} packageData - 생성할 패키지 객체
 * @returns {Promise<PackageModel | null>}
 */
export const createPackageInService = async (packageData: PackageModel): Promise<PackageModel | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/`, packageData.toJsonWithoutId());
    return PackageModel.fromJson(response.data);
  } catch (error) {
    console.error("Error creating package:", error);
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
    console.error("Error fetching package:", error);
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
  updatedData: Partial<PackageModel>
): Promise<PackageModel | null> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${packageId}/`, updatedData);
    return PackageModel.fromJson(response.data);
  } catch (error) {
    console.error("Error updating package:", error);
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
    console.error("Error deleting package:", error);
    return false;
  }
};