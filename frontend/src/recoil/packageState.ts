import { atom } from 'recoil';
import PackageModel from '../models/PackageModel';

// Package Atom
export const packageListState = atom<PackageModel[]>({
    key: 'packageListState',
    default: [],
});

export const editingPackageState = atom<PackageModel | null>({
    key: 'editingPackageState',
    default: null,
});