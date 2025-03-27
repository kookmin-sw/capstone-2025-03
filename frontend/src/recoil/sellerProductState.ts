import { atom } from 'recoil';
import SellerProductModel from '../models/SellerProductModel';

export const sellerProductState = atom<SellerProductModel[]>({
    key: 'sellerProductState',
    default: [],
});