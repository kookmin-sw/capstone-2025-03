import { useRecoilState } from "recoil";
import { categoryState } from "../recoil/categoryState";
import {
    getCategoryListInService,
    createCategoryInService,
    getCategoryInService,
    updateCategoryInService,
    deleteCategoryInService
} from "../services/categoryService";
import CategoryModel from "../models/CategoryModel";
import categoryData from "@/src/data/categoryData.json";

const useLocalData = true;

export const useCategory = () => {
    const [categories, setCategories] = useRecoilState(categoryState);

    // List Read
    const getCategoryList = async (): Promise<CategoryModel[]> => {
        const newCategoryList = useLocalData
            ? categoryData.map(category => CategoryModel.fromJson(category))
            : await getCategoryListInService() ?? [];

        setCategories(newCategoryList);
        return newCategoryList;
    };

    // Create
    const createCategory = async (categoryData: CategoryModel): Promise<CategoryModel | null> => {
        if (useLocalData) {
            const newCategory = CategoryModel.fromJson({ ...categoryData, id: categories.length + 1 });
            setCategories(prevCategories => [...prevCategories, newCategory]);
            return newCategory;
        }

        const newCategory = await createCategoryInService(categoryData);
        if (newCategory) setCategories(prevCategories => [...prevCategories, newCategory]);
        return newCategory;
    };

    // Read
    const getCategory = async (categoryId: number): Promise<CategoryModel | null> => {
        if (useLocalData) {
            return categories.find(category => category.id === categoryId) || null;
        }

        const targetCategory = categories.find(category => category.id === categoryId);
        if (targetCategory) return targetCategory;

        const newCategory = await getCategoryInService(categoryId);
        if (newCategory) setCategories(prevCategories => [...prevCategories, newCategory]);
        return newCategory;
    };

    // Update
    const updateCategory = async (categoryId: number, updatedData: Partial<CategoryModel>): Promise<CategoryModel | null> => {
        if (useLocalData) {
            const updatedCategories = categories.map(category =>
                CategoryModel.fromJson(category.id === categoryId ? { ...category, ...updatedData } : category)
            );
            setCategories(updatedCategories);
            return updatedCategories.find(category => category.id === categoryId) || null;
        }

        const newCategory = await updateCategoryInService(categoryId, updatedData);
        if (newCategory) setCategories(prevCategories => prevCategories.map(category => category.id === categoryId ? newCategory : category));
        return newCategory;
    };

    // Delete
    const deleteCategory = async (categoryId: number): Promise<boolean> => {
        if (useLocalData) {
            setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
            return true;
        }

        const isSuccess = await deleteCategoryInService(categoryId);
        if (isSuccess) setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
        return isSuccess;
    };

    return { categories, getCategoryList, createCategory, getCategory, updateCategory, deleteCategory };
};