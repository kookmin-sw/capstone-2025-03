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

export const useCategory = () => {
    const [categories, setCategories] = useRecoilState(categoryState);

    // List Read
    const getCategoryList = async (): Promise<CategoryModel[] | null> => {
        const newCategoryList = await getCategoryListInService();
        if (newCategoryList) setCategories(newCategoryList);
        // TODO: 지워야함
        if (!newCategoryList) {
            const dummy = {
                "id": 2,
                "name": "전기오븐",
                "industry_ids": [
                    1,
                ],
                "thumbnail": "https://qi-o.qoo10cdn.com/goods_image_big/9/4/8/5/9912309485_l.jpg"
            }
            setCategories((prev) => [...prev, CategoryModel.fromJson(dummy)]);
        }
        return newCategoryList;
    }

    // Create
    const createCategory = async (categoryData: CategoryModel): Promise<CategoryModel | null> => {
        const newCategory = await createCategoryInService(categoryData);
        if (newCategory) setCategories(prevCategories => [...prevCategories, newCategory]);
        return newCategory;
    }

    // Read
    const getCategory = async (categoryId: number): Promise<CategoryModel | null> => {
        const targetCategory = categories.find((category) => category.id === categoryId);
        if (targetCategory) return targetCategory;
        const newCategory = await getCategoryInService(categoryId);
        if (newCategory) setCategories(prevCategories => [...prevCategories, newCategory]);
        return newCategory;
    }

    // Update
    const updateCategory = async (categoryId: number, updatedData: Partial<CategoryModel>): Promise<CategoryModel | null> => {
        const newCategory = await updateCategoryInService(categoryId, updatedData);
        if (newCategory) setCategories(prevCategories => prevCategories.map((category) => category.id === categoryId ? newCategory : category));
        return newCategory;
    }

    // Delete
    const deleteCategory = async (categoryId: number): Promise<boolean> => {
        const isSuccess = await deleteCategoryInService(categoryId);
        if (isSuccess) setCategories(prevCategories => prevCategories.filter((category) => category.id !== categoryId));
        return isSuccess;
    }

    return { categories, getCategoryList, createCategory, getCategory, updateCategory, deleteCategory }
}