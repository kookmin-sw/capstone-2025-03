import { useEffect, useState } from 'react';
import { getRandomCategoriesInService } from '@/src/services/categoryService';
import { useRecoilState } from 'recoil';
import { viewedCategoryIdsState } from '@/src/recoil/viewedCategoryIdsState';
import CategorySection from './CategorySection';
type Item = {
    image: string;
    name: string;
    grade: string;
    price: string;
};

type CategoryResult = {
    category_id: number;
    category_name: string;
    results: Item[];
};

export default function RandomCategory() {
    const [viewedIds, setViewedIds] = useRecoilState(viewedCategoryIdsState);
    const [results, setResults] = useState<CategoryResult[]>([]);

    const handleGetRandomCategory = async () => {
        try {
            const response = await getRandomCategoriesInService(viewedIds);
            setResults(response);

            const newIds = response.map((response) => response.category_id);
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
            {results.map((category) => (
                <CategorySection
                    key={category.category_id}
                    categoryName={category.category_name}
                    products={category.results}
                />
            ))}
        </div>
    );
}
