import { atom } from 'recoil';

type PaginationInfo = {
    next: string | null;
    hasMore: boolean;
}

export const packagePaginationState = atom<Record<string, PaginationInfo>>({
    key: 'packagePaginationState',
    default: {
        'all': {
            next: null,
            hasMore: true
        }
    }
});