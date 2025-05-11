import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { getRandomCategoriesInService } from '@/src/services/categoryService';
import SeeMore from '@/src/assets/images/landing-page/see-more.png';

type CategoryResult = {
    categoryId: number;
    categoryName: string;
    results: Item[];
};

type Item = {
    thumbnail: string;
    productId: number;
    name: string;
    grade: string;
    price: number;
    type?: 'product' | 'more';
};

type PageResponse = {
    data: CategoryResult[];
    newCategoryIds: number[];
};

export const useInfiniteProductRecommendation = () => {
    return useInfiniteQuery<
        PageResponse,
        Error,
        InfiniteData<PageResponse>,
        string[],
        number[]
    >({
        queryKey: ['random-categories'],
        queryFn: async ({ pageParam = [] }) => {
            const excludeIds = pageParam;
            const response = await getRandomCategoriesInService(excludeIds);

            const newCategoryIds = response.map((cat: any) => cat.id);
            const data: CategoryResult[] = response.map((category: any) => ({
                categoryId: category.id,
                categoryName: category.name,
                results: [
                    ...category.items.map((item: any) => ({
                        productId: item.id,
                        thumbnail: item.thumbnail,
                        name: item.name,
                        grade: item.grade,
                        price: item.price,
                        type: 'product',
                    })),
                    {
                        thumbnail: SeeMore,
                        name: '더보기',
                        grade: '',
                        price: '',
                        type: 'more',
                    },
                ],
            }));

            return { data, newCategoryIds };
        },
        initialPageParam: [],
        getNextPageParam: (lastPage, allPages) => {
            const accumulatedIds = allPages.flatMap((page) => page.newCategoryIds);
            return accumulatedIds.length > 0 ? [...new Set(accumulatedIds)] : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });
};
