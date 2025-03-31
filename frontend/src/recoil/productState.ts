import { atom } from 'recoil';
import ProductModel from '../models/ProductModel';

// Product Atom
export const productState = atom<ProductModel[]>({
    key: 'productState',
    default: [],
});

export const productNextPageUrlState = atom<string | null>({
    key: 'productNextPageUrlState',
    default: null
})

export const productHasRequestOnceState = atom<boolean>({
    key: 'productHasRequestOnceState',
    default: false
})