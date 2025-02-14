import axios from "axios";
import { UserModel } from "../models/UserModel";

const API_BASE_URL = "https://api.example.com/users";

/**
 * 사용자를 생성하고 서버에 저장합니다.
 * @param {UserModel} user - 생성할 사용자 객체
 * @returns {Promise<void>}
 */
export const createUserInService = async (user: UserModel): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}`, user.toJson());
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * 특정 userId로 서버에서 사용자 데이터를 가져옵니다.
 * @param {string} userId - 가져올 사용자의 ID
 * @returns {Promise<UserModel | null>}
 */
export const getUserInService = async (userId: string): Promise<UserModel | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return UserModel.fromJson(response.data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

/**
 * 특정 userId로 서버에서 사용자 데이터를 업데이트합니다.
 * @param {string} userId - 업데이트할 사용자의 ID
 * @param {Partial<UserModel>} updatedData - 업데이트할 데이터 객체
 * @returns {Promise<void>}
 */
export const updateUserInService = async (userId: string, updatedData: Partial<UserModel>): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/${userId}`, updatedData);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * 특정 userId로 서버에서 사용자 데이터를 삭제합니다.
 * @param {string} userId - 삭제할 사용자의 ID
 * @returns {Promise<void>}
 */
export const deleteUserInService = async (userId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${userId}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

/**
 * 로그인 시 서버에 보낼 사용자 정보를 확인합니다.
 * @param {string} uid - 사용자 UID
 * @param {string} kakaoEmail - 카카오 이메일
 * @returns {Promise<UserModel | null>}
 */
export const loginUserInService = async (uid: string, kakaoEmail: string): Promise<UserModel | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { uid, kakaoEmail });
    return UserModel.fromJson(response.data);
  } catch (error) {
    console.error("Error logging in user:", error);
    return null;
  }
};