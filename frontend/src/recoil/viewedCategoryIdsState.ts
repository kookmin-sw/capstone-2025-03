// 랜딩페이지에 불러온 카테고리 id 목록
import { atom } from 'recoil';

export const viewedCategoryIdsState = atom<number[]>({
    key: 'viewedCategoryIdsState',
    default: [],
});