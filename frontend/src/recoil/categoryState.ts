import { atom } from "recoil";
import CategoryModel from "../models/CategoryModel";

// Category Atom
export const categoryState = atom<CategoryModel[]>({
    key: "categoryState",
    default: []
})