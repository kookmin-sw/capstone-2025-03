import { atom } from 'recoil';
import BuyerProductModel from '../models/BuyerProductModel';

// Product Atom
export const buyerProductState = atom<BuyerProductModel[]>({
    key: 'buyerProductState',
    default: [],
});

export const buyerProductNextPageUrlState = atom<string | null>({
    key: 'buyerProductNextPageUrlState',
    default: null
})

export const buyerProductHasRequestOnceState = atom<boolean>({
    key: 'buyerProductHasRequestOnceState',
    default: false
})