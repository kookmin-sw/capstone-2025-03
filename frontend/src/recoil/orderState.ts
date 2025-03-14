import { atom } from "recoil";
import OrderModel from "../models/OrderModel";

// Order Atom
export const orderState = atom<OrderModel[]>({
    key: "orderState",
    default: []
})