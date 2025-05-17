import { atom } from 'recoil';
import CategoryModel from '../models/CategoryModel';
import categoryData from '../data/categoryData.json';

// Category Atom
export const categoryState = atom<CategoryModel[]>({
    key: 'categoryState',
    default: categoryData.map((category) => CategoryModel.fromJson(category)),
});
