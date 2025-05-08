import ProductCard from './ProductCard';
import styled from '@emotion/styled';
import MoreCard from './MoreCard';

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
`;

export default function CategorySection({
    categoryId,
    categoryName,
    products,
}: CategorySectionProps) {
    return (
        <div>
            <CategoryName>{categoryName}</CategoryName>
            <CategoryList>
                {products.map((product, idx) =>
                    product.type === 'more' ? (
                        <MoreCard
                            key={idx}
                            categoryId={categoryId}
                            thumbnail={product.thumbnail}
                            name={product.name}
                            grade={product.grade}
                            price={product.price}
                        />
                    ) : (
                        <ProductCard
                            key={idx}
                            productId={product.productId}
                            thumbnail={product.thumbnail}
                            name={product.name}
                            grade={product.grade}
                            price={product.price}
                        />
                    ),
                )}
            </CategoryList>
        </div>
    );
}
