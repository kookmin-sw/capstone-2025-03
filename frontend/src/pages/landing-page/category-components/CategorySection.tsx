import ProductCard from './ProductCard';

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

export default function CategorySection({
    categoryId,
    categoryName,
    products,
}: CategorySectionProps) {
    return (
        <div>
            <h2>{categoryName}</h2>
            <ul>
                {products.map((product, idx) => (
                    <ProductCard
                        key={idx}
                        image={product.image}
                        name={product.name}
                        grade={product.grade}
                        price={product.price}
                    />
                ))}
            </ul>
        </div>
    );
}
