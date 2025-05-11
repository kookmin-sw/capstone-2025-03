import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getParticularCategoryInService } from '@/src/services/categoryService';
import ProductModel from '@/src/models/ProductModel';
import SellerProductItem from '@/src/components/ui/SellerProductItem';
import BackHeader from '@/src/components/layout/BackHeader';
import { useNavigate } from 'react-router-dom';
import SellerProductItemSkeleton from '@/src/components/ui/SellerProductItemSkeleton';

const MainContainer = styled.div`
    background-color: #18171d;
    min-height: 100vh;
    position: relative;
`;

const ProductContainer = styled.div`
    padding-top: 7rem;
    padding-bottom: 2rem;
`;

const CategoryName = styled.p`
    font-weight: 600;
    font-size: 2rem;
    padding: 2rem;
`;

const SpinnerWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

export default function Category() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getParticularCategoryInService(Number(id)).then((res) => {
                setProducts(res);

                if (res.length > 0) {
                    setCategoryName(res[0].categoryName ?? '');
                }
                setIsLoading(false);
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
                {isLoading
                    ? Array.from({ length: 6 }).map((_, idx) => (
                          <SellerProductItemSkeleton key={idx} />
                      ))
                    : products.map((product) => (
                          <div onClick={() => handleProductClick(product)} key={product.id}>
                              <SellerProductItem product={product} />
                          </div>
                      ))}
            </ProductContainer>
        </MainContainer>
    );
}
