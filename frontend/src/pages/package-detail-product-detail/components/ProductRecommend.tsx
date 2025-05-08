import styled from '@emotion/styled';
import { useCategory } from '@/src/hooks/useCategory';
import { useEffect, useState } from 'react';
import ProductCard from '../../landing-page/category-components/ProductCard';
import ProductCardModel from '@/src/models/ProductCardModel';

const RecommendContainer = styled.div`
    padding: 2rem;
`;

const RecommendText = styled.p`
    font-size: 1.9rem;
    font-weight: 700;
    color: white;
`;

const RecommendSubText = styled.p`
    margin-top: 2rem;
    font-size: 1.7rem;
    font-weight: 700;
    color: white;
`;

const ProductsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 2rem;
    & img {
        width: 16rem !important;
        height: 16rem !important;
    }
`;

type ProductRecommendProps = {
    categoryId: number | null;
    productId: number[];
    categoryName: string | null;
};

export default function ProductRecommend({
    categoryId,
    productId,
    categoryName,
}: ProductRecommendProps) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = user.name ?? '손';
    const [recommend, setRecommend] = useState<ProductCardModel[]>([]);
    const { randomProduct } = useCategory();

    useEffect(() => {
        const fetchData = async () => {
            if (categoryId !== null) {
                const response = await randomProduct(categoryId, productId);
                setRecommend(response);
            }
        };
        fetchData();
    }, [productId]);

    return (
        <RecommendContainer>
            <RecommendText>{name}님, 이건 어때요?</RecommendText>
            <RecommendSubText>더 많은 {categoryName} 보기</RecommendSubText>
            <ProductsContainer>
                {recommend.map((product, idx) => (
                    <ProductCard
                        productId={product.id}
                        thumbnail={product.thumbnail}
                        name={product.name}
                        grade={product.grade}
                        price={product.price}
                    />
                ))}
            </ProductsContainer>
        </RecommendContainer>
    );
}
