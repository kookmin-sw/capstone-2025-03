// sellerProductState atom 에 대한 selector

import { selector } from 'recoil';
import { sellerProductState } from '../sellerProductState';

export const useSellerProductSelector = (userId: number) => {
    selector({
        key: `userSellerProductsSelector_${userId}`,
        get: ({ get }) => {
            const allProducts = get(sellerProductState);
            return allProducts.filter((product) => product.sellerId === userId);
        },
    });
};
