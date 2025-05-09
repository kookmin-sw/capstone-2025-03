import ProductCard from './ProductCard';
import styled from '@emotion/styled';
import MoreCard from './MoreCard';
import ProductCardSkeleton from '../../../components/ui/ProductCardSkeleton';

type Item = {
    productId: number;
    thumbnail: string;
    name: string;
    grade: string;
    price: number;
    type?: 'product' | 'more';
};

type CategorySectionProps = {
    categoryId: number;
    categoryName: string;
    products: Item[];
    isLoading?: boolean;
};

const CategoryList = styled.ul`
    display: flex;
    gap: 1.2rem;
    overflow-x: auto;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const CategoryName = styled.div`
    font-weight: 700;
    font-size: 2rem;
    line-height: 5.6rem;
    margin-top: 2rem;
`;

const SkeletonGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr); // 한 행에 4개
    gap: 1.2rem;
    margin-top: 4rem;
`;

export default function CategorySection({
    categoryId,
    categoryName,
    products,
    isLoading = false,
}: CategorySectionProps) {
    return (
        <div>
            <CategoryName>{categoryName}</CategoryName>
            <CategoryList>
                {isLoading ? (
                    <SkeletonGrid>
                        {Array.from({ length: 20 }).map((_, idx) => (
                            <ProductCardSkeleton key={idx} />
                        ))}
                    </SkeletonGrid>
                ) : (
                    products.map((product, idx) =>
                        product.type === 'more' ? (
                            <MoreCard key={idx} {...product} categoryId={categoryId} />
                        ) : (
                            <ProductCard key={idx} {...product} />
                        ),
                    )
                )}
            </CategoryList>
        </div>
    );
}
