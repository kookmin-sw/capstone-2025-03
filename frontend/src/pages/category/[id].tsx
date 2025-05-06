import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getParticularCategoryInService } from '@/src/services/categoryService';
import ProductModel from '@/src/models/ProductModel';
import SellerProductItem from '@/src/components/ui/SellerProductItem';
import BackHeader from '@/src/components/layout/BackHeader';
import { useNavigate } from 'react-router-dom';

const MainContainer = styled.div`
    background-color: #18171d;
`;

const ProductContainer = styled.div`
    padding-top: 7rem;
    padding-bottom: 2rem;
`;

const CategoryName = styled.p`
    font-weight: 600;
    font-size: 2rem;
    padding: 2rem;
`

export default function Category() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getParticularCategoryInService(Number(id)).then((res) => {
                setProducts(res);
                console.log(res[0].categoryName);
                if (res.length > 0) {
                    setCategoryName(res[0].categoryName ?? '');
                }
            });
        }
    }, []);

    const handleProductClick = (product: ProductModel) => {
        navigate('/package-detail-product-detail', {
            state: { product: product.toJson() },
        });
    };

    return (
        <MainContainer>
            <BackHeader />
            <ProductContainer>
                <CategoryName>{categoryName}</CategoryName>
                {products.map((product) => (
                    <div onClick={() => handleProductClick(product)}>
                        <SellerProductItem product={product} />
                    </div>
                ))}
            </ProductContainer>
        </MainContainer>
    );
}
