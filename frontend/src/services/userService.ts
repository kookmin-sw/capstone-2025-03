import axios from "axios";
import { UserModel } from "../models/UserModel";

const API_BASE_URL = "https://django-uxvt.onrender.com";
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const REDIRECT_URI = `${window.location.origin}/name-and-birth-day-input`;

/**
 * 사용자를 생성하고 서버에 저장합니다.
 * @param {UserModel} user - 생성할 사용자 객체
 * @returns {Promise<void>}
 */
export const createUserInService = async (user: UserModel): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/users/`, user.toJson());
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
export const getUserInService = async (
  userId: string
): Promise<UserModel | null> => {
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
export const updateUserInService = async (
  userId: string,
  updatedData: Partial<UserModel>
): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/${userId}`, updatedData);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// 로그인한 본인 정보 불러오기
export const getMyInfoInService = async () => {
  try {
    await axios.get(`${API_BASE_URL}/users/info/`);
  } catch (error) {
    console.log("Error fetching my data:", error);
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
export const loginUserInService = async (
  kakao_id: number
): Promise<{ success: boolean; user?: UserModel; error?: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login/`, {
      kakao_id,
    });
    return { success: true, user: UserModel.fromJson(response.data.user_info) };
  } catch (error) {
    console.error("Error logging in user:", error);
    return { success: false };
  }
};

// 액세스 토큰 요청 함수
export const getKakaoAccessToken = async (code: string) => {
  try {
    const response = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: KAKAO_REST_API_KEY,
          redirect_uri: REDIRECT_URI,
          code: code,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.log("액세스 토큰 요청 오류: ", error);
    throw error;
  }
};

// 사용자 정보 요청 함수
export const getKakaoUserInfo = async (accessToken: string) => {
  try {
    const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      kakaoId: response.data.id,
      nickname: response.data.properties.nickname,
      profileImage: response.data.properties.profile_image,
      email: response.data.kakao_account.email || "이메일 없음",
    };
  } catch (error) {
    console.error("카카오 사용자 정보 요청 오류:", error);
    throw error;
  }
};
