import React, { createContext, useContext, useState, ReactNode } from "react";
import CategoryModel from "../models/CategoryModel";
import {
  createCategoryInService,
  getCategoryInService,
  updateCategoryInService,
  deleteCategoryInService,
  getAllCategoryInService
} from "../services/categoryService";

// Context에서 사용할 타입 정의
interface CategoryContextType {
  categories: CategoryModel[];
  fetchCategory: (categoryId: string) => Promise<CategoryModel | null>;
  createCategory: (newCategory: CategoryModel) => Promise<void>;
  updateCategory: (
    categoryId: string,
    updatedData: Partial<CategoryModel>
  ) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  setCategories: React.Dispatch<React.SetStateAction<CategoryModel[]>>;
  getAllCategory: () => Promise<void>;
}

// Context 생성
const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

// Provider 컴포넌트
export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);

  // 카테고리 생성
  const createCategory = async (newCategory: CategoryModel) => {
    try {
      await createCategoryInService(newCategory);
      setCategories((prev) => [...prev, newCategory]);
    } catch (error) {
      console.error("Error creating category in context:", error);
      throw error;
    }
  };

  // 모든 카테고리 가져오기
  const getAllCategory = async() => {
    try {
      const allCategories = await getAllCategoryInService();
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching all categories:", error);
    }
  }

  // 특정 카테고리 가져오기
  const fetchCategory = async (
    categoryId: string
  ): Promise<CategoryModel | null> => {
    try {
      const existingCategory = categories.find(
        (category) => category.id === Number(categoryId)
      );
      if (existingCategory) return existingCategory;

      const fetchedCategory = await getCategoryInService(categoryId);
      if (fetchedCategory) {
        setCategories((prev) => [...prev, fetchedCategory]);
      }
      return fetchedCategory;
    } catch (error) {
      console.error("Error fetching category in context:", error);
      return null;
    }
  };

  // 카테고리 업데이트
  const updateCategory = async (
    categoryId: string,
    updatedData: Partial<CategoryModel>
  ) => {
    try {
      await updateCategoryInService(categoryId, updatedData);
      setCategories((prev) =>
        prev.map((category) =>
          category.id === Number(categoryId)
            ? new CategoryModel({ ...category, ...updatedData })
            : category
        )
      );
    } catch (error) {
      console.error("Error updating category in context:", error);
      throw error;
    }
  };

  // 카테고리 삭제
  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteCategoryInService(categoryId);
      setCategories((prev) =>
        prev.filter((category) => category.id !== Number(categoryId))
      );
    } catch (error) {
      console.error("Error deleting category in context:", error);
      throw error;
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        fetchCategory,
        createCategory,
        updateCategory,
        deleteCategory,
        setCategories,
        getAllCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// Context를 사용하는 커스텀 훅
export const useCategory = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};
