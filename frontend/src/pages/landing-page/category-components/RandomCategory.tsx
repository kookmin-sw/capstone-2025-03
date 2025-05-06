import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { getRandomCategoriesInService } from '@/src/services/categoryService';
import { useRecoilState } from 'recoil';
import { viewedCategoryIdsState } from '@/src/recoil/viewedCategoryIdsState';
import CategorySection from './CategorySection';
import Footer from '@/src/components/layout/MenuFooter';
import SeeMore from '@/src/assets/images/landing-page/see-more.png';

type Item = {
    image: string;
    name: string;
    grade: string;
    price: string;
    type?: 'product' | 'more';
};

type CategoryResult = {
    category_id: number;
    category_name: string;
    results: Item[];
};

const MOCK_DATA: CategoryResult[] = [
    {
        category_id: 1,
        category_name: '문구류',
        results: [
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367Duo_BEIFW.jpg',
                name: '노트북',
                grade: '중고',
                price: '3000',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/17140965763674iT_xKfYW.jpg',
                name: '펜 세트',
                grade: '새상품',
                price: '1500',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367wCl_mQGgg.jpg',
                name: '파일',
                grade: '새상품',
                price: '2000',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367Duo_BEIFW.jpg',
                name: '자',
                grade: '중고',
                price: '500',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/17140965763674iT_xKfYW.jpg',
                name: '가위',
                grade: '중고',
                price: '1000',
            },
        ],
    },
    {
        category_id: 2,
        category_name: '필기도구',
        results: [
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367Duo_BEIFW.jpg',
                name: '노트북',
                grade: '중고',
                price: '3000',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/17140965763674iT_xKfYW.jpg',
                name: '펜 세트',
                grade: '새상품',
                price: '1500',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367wCl_mQGgg.jpg',
                name: '파일',
                grade: '새상품',
                price: '2000',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367Duo_BEIFW.jpg',
                name: '자',
                grade: '중고',
                price: '500',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/17140965763674iT_xKfYW.jpg',
                name: '가위',
                grade: '중고',
                price: '1000',
            },
        ],
    },
    {
        category_id: 3,
        category_name: '가스레인지',
        results: [
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367Duo_BEIFW.jpg',
                name: '노트북',
                grade: '중고',
                price: '3000',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/17140965763674iT_xKfYW.jpg',
                name: '펜 세트',
                grade: '새상품',
                price: '1500',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367wCl_mQGgg.jpg',
                name: '파일',
                grade: '새상품',
                price: '2000',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367Duo_BEIFW.jpg',
                name: '자',
                grade: '중고',
                price: '500',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/17140965763674iT_xKfYW.jpg',
                name: '가위',
                grade: '중고',
                price: '1000',
            },
        ],
    },
    {
        category_id: 4,
        category_name: '청소기',
        results: [
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367Duo_BEIFW.jpg',
                name: '노트북',
                grade: '중고',
                price: '3000',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/17140965763674iT_xKfYW.jpg',
                name: '펜 세트',
                grade: '새상품',
                price: '1500',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367wCl_mQGgg.jpg',
                name: '파일',
                grade: '새상품',
                price: '2000',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367Duo_BEIFW.jpg',
                name: '자',
                grade: '중고',
                price: '500',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/17140965763674iT_xKfYW.jpg',
                name: '가위',
                grade: '중고',
                price: '1000',
            },
        ],
    },
    {
        category_id: 5,
        category_name: '자동차',
        results: [
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367Duo_BEIFW.jpg',
                name: '노트북',
                grade: '중고',
                price: '3000',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/17140965763674iT_xKfYW.jpg',
                name: '펜 세트',
                grade: '새상품',
                price: '1500',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367wCl_mQGgg.jpg',
                name: '파일',
                grade: '새상품',
                price: '2000',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/1714096576367Duo_BEIFW.jpg',
                name: '자',
                grade: '중고',
                price: '500',
            },
            {
                image: 'https://img2.joongna.com/media/original/2024/04/26/17140965763674iT_xKfYW.jpg',
                name: '가위',
                grade: '중고',
                price: '1000',
            },
        ],
    },
];

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

    // const handleGetRandomCategory = async () => {
    //     try {
    //         const response = await getRandomCategoriesInService(viewedIds);
    //         setResults(response);

    //         const newIds = response.map((response) => response.category_id);
    //         setViewedIds((prev) => [...prev, ...newIds]);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    useEffect(() => {
        // handleGetRandomCategory();

        const withMoreCard = MOCK_DATA.map((category) => ({
            ...category,
            results: [
                ...category.results,
                {
                    image: SeeMore,
                    name: '더보기',
                    grade: '',
                    price: '',
                    type: 'more',
                } satisfies Item,
            ],
        }));

        setResults(withMoreCard);
    }, []);
    console.log(results);
    return (
        <div>
            <CategoryContainer>
                {results.map((category) => (
                    <CategorySection
                        key={category.category_id}
                        categoryId={category.category_id}
                        categoryName={category.category_name}
                        products={category.results}
                    />
                ))}
            </CategoryContainer>
            <Footer currentMenuIndex={currentMenuIndex} />
        </div>
    );
}
