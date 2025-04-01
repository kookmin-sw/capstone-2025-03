import { atom } from 'recoil';
import ProductModel from '../models/ProductModel';

// Product Atom
export const productListState = atom<ProductModel[]>({
    key: 'productListState',
    default: [],
});

// sellerProduct 의 전체 목록
export const sellerProductListState = atom<ProductModel[]>({
    key: 'sellerProductListState',
    default: [],
});

// sellerProduct 생성 상태
export const sellerProductState = atom<ProductModel>({
    key: 'sellerProductState',
    default: new ProductModel({}),
});
