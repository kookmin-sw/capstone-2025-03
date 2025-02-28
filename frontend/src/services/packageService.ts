import axios from "axios";
import PackageModel from "../models/PackageModel";

const API_BASE_URL = "https://restart-s4b8.onrender.com/packages";

/**
 * 서버에서 모든 패키지 데이터를 가져옵니다.
 * @returns {Promise<PackageModel | null>}
 */
export const getPackageListInService = async (): Promise<PackageModel[] | null> => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/`);

    const responses = data.results ?? []; // 'results'가 없을 경우 빈 배열 사용

    const packages:PackageModel[] = responses.map((response:any) => {
      return PackageModel.fromJson(response);
    });

    return packages;
  } catch (error) {
    console.error("Error fetching package:", error);
    return null;
  }
};

/**
 * 패키지를 생성하고 서버에 저장합니다.
 * @param {PackageModel} packageData - 생성할 패키지 객체
 * @returns {Promise<void>}
 */
export const createPackageInService = async (packageData: PackageModel): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}`, packageData.toJson());
  } catch (error) {
    console.error("Error creating package:", error);
    throw error;
  }
};

/**
 * 특정 packageId로 서버에서 패키지 데이터를 가져옵니다.
 * @param {string} packageId - 가져올 패키지의 ID
 * @returns {Promise<PackageModel | null>}
 */
export const getPackageInService = async (
  packageId: string
): Promise<PackageModel | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${packageId}`);
    return PackageModel.fromJson(response.data);
  } catch (error) {
    console.error("Error fetching package:", error);
    return null;
  }
};

/**
 * 특정 packageId로 서버에서 패키지 데이터를 업데이트합니다.
 * @param {string} packageId - 업데이트할 패키지의 ID
 * @param {Partial<PackageModel>} updatedData - 업데이트할 데이터 객체
 * @returns {Promise<void>}
 */
export const updatePackageInService = async (
  packageId: string,
  updatedData: Partial<PackageModel>
): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/${packageId}`, updatedData);
  } catch (error) {
    console.error("Error updating package:", error);
    throw error;
  }
};

/**
 * 특정 packageId로 서버에서 패키지 데이터를 삭제합니다.
 * @param {string} packageId - 삭제할 패키지의 ID
 * @returns {Promise<void>}
 */
export const deletePackageInService = async (packageId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${packageId}`);
  } catch (error) {
    console.error("Error deleting package:", error);
    throw error;
  }
};