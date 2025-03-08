import { atom } from "recoil";
import PackageModel from "../models/PackageModel";

// Package Atom
export const packageState = atom<PackageModel[]>({
    key: "packageState",
    default: []
})