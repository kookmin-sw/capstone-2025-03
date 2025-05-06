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

export default function Category() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductModel[]>([]);

    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getParticularCategoryInService(Number(id)).then(setProducts);
        }
    }, []);

    const handleProductClick = (product: ProductModel) => {
        navigate('/package-detail-product-detail', {
            state: { product: product.toJson() },
        });
    };

    console.log(products);
    return (
        <MainContainer>
            <BackHeader />
            <ProductContainer>
                {products.map((product) => (
                    <div onClick={() => handleProductClick(product)}>
                        <SellerProductItem product={product} />
                    </div>
                ))}
            </ProductContainer>
        </MainContainer>
    );
}
