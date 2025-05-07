import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { getRandomCategoriesInService } from '@/src/services/categoryService';
import { useRecoilState } from 'recoil';
import { viewedCategoryIdsState } from '@/src/recoil/viewedCategoryIdsState';
import CategorySection from './CategorySection';
import Footer from '@/src/components/layout/MenuFooter';
import SeeMore from '@/src/assets/images/landing-page/see-more.png';
import { useRef } from 'react';

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

const CategoryContainer = styled.div`
    background-color: #18171d;
    padding: 3.2rem 0 0 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export default function RandomCategory() {
    const currentMenuIndex = 0;
    const [viewedIds, setViewedIds] = useRecoilState(viewedCategoryIdsState);
    const [results, setResults] = useState<CategoryResult[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const hasMounted = useRef(false);

    const handleGetRandomCategory = async () => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            const response = await getRandomCategoriesInService(viewedIds);
            console.log(response);
            const withMoreCard = response.map((category: any) => ({
                categoryId: category.id,
                categoryName: category.name,
                results: [
                    ...category.items.map((item: any) => ({
                        productId: item.id,
                        thumbnail: item.thumbnail,
                        name: item.name,
                        grade: item.grade,
                        price: item.price, // 가격 정보가 없으니 빈 문자열
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

            setResults((prev) => {
                const existing = new Set(prev.map((p) => p.categoryId));
                const filtered = withMoreCard.filter((e: CategoryResult) => !existing.has(e.categoryId));
                return [...prev, ...filtered];
            });

            const newIds = response.map((response: any) => response.id);
            setViewedIds((prev) => [...prev, ...newIds]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    // 첫 호출 용
    useEffect(() => {
        handleGetRandomCategory();
    }, []);

    // 스크롤 하단 감지용
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (!hasMounted.current) {
                    hasMounted.current = true;
                    return;
                }

                if (entry.isIntersecting) {
                    handleGetRandomCategory();
                }
            },
            { threshold: 1 },
        );

        if (bottomRef.current) observer.observe(bottomRef.current);
        return () => {
            if (bottomRef.current) observer.unobserve(bottomRef.current);
        };
    }, []);

    return (
        <div>
            <CategoryContainer>
                {results.map((category) => (
                    <CategorySection
                        key={category.categoryId}
                        categoryId={category.categoryId}
                        categoryName={category.categoryName}
                        products={category.results}
                    />
                ))}
            </CategoryContainer>
            <div ref={bottomRef}></div>
            <Footer currentMenuIndex={currentMenuIndex} />
        </div>
    );
}
