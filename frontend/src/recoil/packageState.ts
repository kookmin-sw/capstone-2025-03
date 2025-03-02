import { atom } from "recoil";
import PackageModel from "../models/PackageModel";
import CoffeePackImage from "../assets/images/dummy/coffee_pack.png";

export const packageState = atom<PackageModel>({
    key: "packageState",
    default: PackageModel.fromJson({
        "id": 1,
        "industry_id": 1,
        "category_ids": [1, 2],
        "product_ids": [1, 2],
        "thumbnail": CoffeePackImage,
        "name": "Restaurant Starter Pack",
        "description": "Basic tools and kitchenware for new restaurants.",
        "price": 90000
    })
})