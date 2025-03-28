import { atom } from 'recoil';

export const sellerProductPaginationSate = atom<{ next: string | null; hasMore: boolean }>({
    key: 'sellerProductPaginationState',
    default: {
        next: null,
        hasMore: true,
    },
});
