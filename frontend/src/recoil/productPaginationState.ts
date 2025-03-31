import { atom } from 'recoil';

type PaginationInfo = {
    next: string | null;
    hasMore: boolean;
}

export const productPaginationState = atom<Record<string, PaginationInfo>>({
    key: 'productPaginationState',
    default: {
        'all': {
            next: null,
            hasMore: true
        }
    }
});