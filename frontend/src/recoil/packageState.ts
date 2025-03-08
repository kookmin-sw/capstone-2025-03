import { atom } from "recoil";
import PackageModel from "../models/PackageModel";

// Package Atom
export const packageState = atom<PackageModel[]>({
    key: "packageState",
    default: []
})

export const edigingPackageState = atom<PackageModel>({
    key: "edigingPackageState",
    default: PackageModel.fromJson({})
})