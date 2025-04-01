import { atom } from 'recoil';
import SellerProductModel from '../models/SellerProductModel';

// sellerProduct 의 전체 목록
export const sellerProductListState = atom<SellerProductModel[]>({
    key: 'sellerProductListState',
    default: [],
});

// // sellerProduct 생성 상태
// export const sellerProductState = atom<SellerProductModel>({
//     key: 'sellerProductState',
//     default: new SellerProductModel({}),
// });
