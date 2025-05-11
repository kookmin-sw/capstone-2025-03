import styled from '@emotion/styled';
import { useEffect } from 'react';
import CategorySection from './CategorySection';
import Footer from '@/src/components/layout/MenuFooter';
import { useRef } from 'react';
import { useInfiniteProductRecommendation } from '@/src/hooks/useInfiniteProductsRecommendation';
import RefreshIcon from '../../../assets/images/landing-page/refresh.png';
import { useQueryClient } from '@tanstack/react-query';

const CategorySectionContainer = styled.div`
    position: relative;
    min-height: 30vh;
    background-color: #101012;
    padding: 3.2rem 0 0 1rem;
    display: flex;
    flex-direction: column;
`;

const HeadContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const HeadText = styled.p`
    font-size: 2.4rem;
    font-weight: 700;
    margin-bottom: 1rem;
`;

const ResfreshButton = styled.button`
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    align-items: center;
    font-size: 1.4rem;
    font-weight: 600;
    padding: 1rem;
`;

const RefreshImage = styled.img`
    width: 1.4rem;
    margin-left: 0.4rem;
`;

const CategoryContainer = styled.div`
    background-color: #18171d;
    border-radius: 1.2rem;
    padding: 0rem 2rem 0 1rem;
    margin-bottom: 2rem;
`;

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

export default function RandomCategory() {
    const currentMenuIndex = 0;

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const queryClient = useQueryClient();

    const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } =
        useInfiniteProductRecommendation();

    // 스크롤 하단 감지용
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;

            if (entry.isIntersecting && !isFetchingNextPage && hasNextPage) {
                fetchNextPage();
            }
        });

        const currentRef = bottomRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [bottomRef, isFetchingNextPage, hasNextPage, fetchNextPage]);

    const handleRefresh = () => {
        queryClient.removeQueries({ queryKey: ['random-categories'] });
        refetch();
    };

    return (
        <div>
            <CategorySectionContainer>
                <HeadContainer>
                    <HeadText>카테고리</HeadText>
                    <ResfreshButton onClick={handleRefresh}>
                        새로고침
                        <RefreshImage src={RefreshIcon} />
                    </ResfreshButton>
                </HeadContainer>

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
