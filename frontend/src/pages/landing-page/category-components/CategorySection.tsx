import ProductCard from './ProductCard';
import styled from '@emotion/styled';

type Item = {
    image: string;
    name: string;
    grade: string;
    price: string;
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

export default function CategorySection({
    categoryId,
    categoryName,
    products,
}: CategorySectionProps) {
    return (
        <div>
            <h2>{categoryName}</h2>
            <CategoryList>
                {products.map((product, idx) => (
                    <ProductCard
                        key={idx}
                        image={product.image}
                        name={product.name}
                        grade={product.grade}
                        price={product.price}
                    />
                ))}
            </CategoryList>
        </div>
    );
}
