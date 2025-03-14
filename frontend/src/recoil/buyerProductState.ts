import { atom } from "recoil";
import BuyerProductModel from "../models/BuyerProductModel";

// Product Atom
export const buyerProductState = atom<BuyerProductModel[]>({
    key: "buyerProductState",
    default: []
})