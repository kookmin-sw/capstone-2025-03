import styled from '@emotion/styled';
import { useCategory } from '@/src/hooks/useCategory';
import { useEffect, useState } from 'react';
import ProductModel from '@/src/models/ProductModel';

const RecommendContainer = styled.div`
    padding: 2rem;
`;

const RecommendText = styled.p`
    font-size: 1.9rem;
    font-weight: 700;
    color: white;
`;

type ProductRecommendProps = {
    categoryId: number | null;
    productId: number[];
};

export default function ProductRecommend({ categoryId, productId }: ProductRecommendProps) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = user.name ?? '손';
    const [recommend, setRecommend] = useState<ProductModel[]>([]);
    const { randomProduct } = useCategory();

    useEffect(() => {
        const fetchData = async () => {
            if (categoryId !== null) {
                const response = await randomProduct(categoryId, productId);
                setRecommend(response)
            }
        };
        fetchData()
    }, []);
    
    console.log(recommend)
    return (
        <RecommendContainer>
            <RecommendText>{name}님, 이건 어때요?</RecommendText>
        </RecommendContainer>
    );
}
