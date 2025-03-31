import { atom } from 'recoil';
import ProductModel from '../models/ProductModel';

// Product Atom
export const productListState = atom<ProductModel[]>({
    key: 'productListState',
    default: [],
});