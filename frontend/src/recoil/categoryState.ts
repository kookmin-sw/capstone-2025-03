import { atom } from "recoil";
import CategoryModel from "../models/CategoryModel";

// Categories Atom
export const categoryState = atom<CategoryModel[]>({
    key: "categoryState",
    default: []
})