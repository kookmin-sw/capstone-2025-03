// UserContext.ts
import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserModel } from "../models/UserModel";
import {
  createUserInService,
  getUserInService,
  updateUserInService,
  deleteUserInService,
  loginUserInService,
} from "../services/userService";

// Context에서 사용할 타입 정의
interface UserContextType {
  user: UserModel | null;
  createUser: (newUser: UserModel) => Promise<void>;
  fetchMyInfo: () => Promise<void>;
  fetchUser: (userId: string) => Promise<void>;
  updateUser: (
    userId: string,
    updatedData: Partial<UserModel>
  ) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  loginUser: (kakaoId: number) => Promise<boolean>;
  setUser: React.Dispatch<React.SetStateAction<UserModel | null>>;
}

// Context 생성
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider 컴포넌트
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserModel | null>(null);

  // 사용자 생성 (회원가입 등)
  const createUser = async (newUser: UserModel) => {
    try {
      await createUserInService(newUser);
      // 생성 후 바로 local state에 저장 (이미 UserModel의 인스턴스이므로 문제 없음)
      setUser(newUser);
    } catch (error) {
      console.error("Error creating user in context:", error);
      throw error;
    }
  };

  // 로그인 한 본인 정보 불러오기
  const fetchMyInfo = async () => {
    try {
      // const responseData = await getMyInfoInService();
      // console.log(responseData);
    } catch (error) {
      console.log("Error getting my info in context", error);
      throw error;
    }
  };

  // 사용자 데이터 fetch (특정 userId로 가져오기)
  const fetchUser = async (userId: string) => {
    try {
      const fetchedUser = await getUserInService(userId);
      setUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching user in context:", error);
      throw error;
    }
  };

  // 사용자 데이터 업데이트
  const updateUser = async (
    userId: string,
    updatedData: Partial<UserModel>
  ) => {
    try {
      await updateUserInService(userId, updatedData);
      // local state 업데이트: 단순 병합 객체 대신 새로운 UserModel 인스턴스로 생성
      if (user && user.userId === userId) {
        setUser(new UserModel({ ...user, ...updatedData }));
      }
    } catch (error) {
      console.error("Error updating user in context:", error);
      throw error;
    }
  };

  // 사용자 삭제
  const deleteUser = async (userId: string) => {
    try {
      await deleteUserInService(userId);
      if (user && user.userId === userId) {
        setUser(null);
      }
    } catch (error) {
      console.error("Error deleting user in context:", error);
      throw error;
    }
  };

  // 사용자 로그인
  const loginUser = async (kakaoId: number) => {
    try {
      const result = await loginUserInService(kakaoId);
      // console.log(result.user, "결과 유저")
      if (result.user && result.user?.userId !== null) {
        setUser(result.user);
        console.log("로그인유저정보", result.user)
        localStorage.setItem("user", JSON.stringify(result.user.toJson()));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error logging in user in context:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        createUser,
        fetchMyInfo,
        fetchUser,
        updateUser,
        deleteUser,
        loginUser,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Context를 사용하는 커스텀 훅
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
