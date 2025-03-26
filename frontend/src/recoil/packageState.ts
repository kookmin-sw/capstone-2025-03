import { atom } from 'recoil';
import PackageModel from '../models/PackageModel';

// Package Atom
export const packageState = atom<PackageModel[]>({
    key: 'packageState',
    default: [],
});

export const editingPackageState = atom<PackageModel | null>({
    key: 'editingPackageState',
    default: null,
});

export const packageNextPageUrlState = atom<string | null>({
    key: 'packageNextPageUrlState',
    default: null
})

export const packageHasRequestOnceState = atom<boolean>({
    key: 'packageHasRequestOnceState',
    default: false
})