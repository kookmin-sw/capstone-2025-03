import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { getRandomCategoriesInService } from '@/src/services/categoryService';
import { useRecoilState } from 'recoil';
import { viewedCategoryIdsState } from '@/src/recoil/viewedCategoryIdsState';
import CategorySection from './CategorySection';
import Footer from '@/src/components/layout/MenuFooter';
import SeeMore from '@/src/assets/images/landing-page/see-more.png';

type Item = {
    thumbnail: string;
    name: string;
    grade: string;
    price: string;
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

    const handleGetRandomCategory = async () => {
        try {
            const response = await getRandomCategoriesInService(viewedIds);
            // console.log(response)
            const withMoreCard = response.map((category: any) => ({
                categoryId: category.id,
                categoryName: category.name,
                results: [
                    ...category.items.map((item: any) => ({
                        thumbnail: item.thumbnail,
                        name: item.name,
                        grade: item.grade,
                        price: '', // 가격 정보가 없으니 빈 문자열
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
            setResults(withMoreCard);

            const newIds = response.map((response: any) => response.category_id);
            setViewedIds((prev) => [...prev, ...newIds]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleGetRandomCategory();
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
            <Footer currentMenuIndex={currentMenuIndex} />
        </div>
    );
}
