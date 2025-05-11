import styled from '@emotion/styled';
import { useEffect } from 'react';
import CategorySection from './CategorySection';
import Footer from '@/src/components/layout/MenuFooter';
import { useRef } from 'react';
import { useInfiniteProductRecommendation } from '@/src/hooks/useInfiniteProductsRecommendation';

type Item = {
    thumbnail: string;
    productId: number;
    name: string;
    grade: string;
    price: number;
    type?: 'product' | 'more';
};

type CategoryResult = {
    categoryId: number;
    categoryName: string;
    results: Item[];
};

type PageResponse = {
    data: CategoryResult[];
    newCategoryIds: number[];
};

const CategorySectionContainer = styled.div`
    position: relative;
    min-height: 30vh;
    background-color: #101012;
    padding: 3.2rem 0 0 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const CategoryContainer = styled.div`
    background-color: #18171d;
    border-radius: 1.2rem;
    padding: 2rem;
    margin-bottom: 2rem;
`;

export default function RandomCategory() {
    const currentMenuIndex = 0;

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useInfiniteProductRecommendation();

    // 스크롤 하단 감지용
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;

            if (entry.isIntersecting && !isFetchingNextPage && hasNextPage) {
                fetchNextPage();
            }
        });

        if (bottomRef.current) observer.observe(bottomRef.current);
        return () => {
            if (bottomRef.current) observer.unobserve(bottomRef.current);
        };
    }, [bottomRef, isFetchingNextPage, hasNextPage, fetchNextPage]);

    return (
        <div>
            <CategorySectionContainer>
                {isLoading ? (
                    <CategorySection
                        key="initial"
                        categoryId={-1}
                        categoryName=""
                        products={[]}
                        isLoading
                    />
                ) : (
                    <>
                        <CategoryContainer>
                            {(data as any)?.pages.flatMap((page: PageResponse) =>
                                page.data.map((category) => (
                                    <CategorySection
                                        key={category.categoryId}
                                        categoryId={category.categoryId}
                                        categoryName={category.categoryName}
                                        products={category.results}
                                    />
                                )),
                            )}
                        </CategoryContainer>
                        {isFetchingNextPage && (
                            <CategorySection
                                key="fetching"
                                categoryId={-2}
                                categoryName=""
                                products={[]}
                                isLoading
                            />
                        )}
                    </>
                )}
            </CategorySectionContainer>
            <div ref={bottomRef}></div>
            <Footer currentMenuIndex={currentMenuIndex} />
        </div>
    );
}
