import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getParticularCategoryInService } from '@/src/services/categoryService';
import ProductModel from '@/src/models/ProductModel';
import SellerProductItem from '@/src/components/ui/SellerProductItem';
import BackHeaderForCategory from './components/BackHeaderForCategory';
import { useNavigate } from 'react-router-dom';
import SellerProductItemSkeleton from '@/src/components/ui/SellerProductItemSkeleton';

const MainContainer = styled.div`
    background-color: #101012;
    min-height: 100vh;
    position: relative;
    padding: 2rem;
`;

const ProductWrapper = styled.div`
    background-color: #18171d;
`;

const ProductContainer = styled.div`
    padding: 4rem 2rem 2rem 2rem;
`;

export default function Category() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchVisible, setSearchVisible] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
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

    const filteredProducts = products.filter((product) =>
        product.name!.toLowerCase().includes(searchText.toLowerCase()),
    );

    return (
        <MainContainer>
            <BackHeaderForCategory
                category={categoryName}
                searchVisible={searchVisible}
                setSearchVisible={setSearchVisible}
                searchText={searchText}
                setSearchText={setSearchText}
            />
            <ProductWrapper>
                <ProductContainer>
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, idx) => (
                              <SellerProductItemSkeleton key={idx} />
                          ))
                        : filteredProducts.map((product) => (
                              <div onClick={() => handleProductClick(product)} key={product.id}>
                                  <SellerProductItem product={product} />
                                  <div style={{ borderBottom: '1px solid #2a2a2a' }}></div>
                              </div>
                          ))}
                </ProductContainer>
            </ProductWrapper>
        </MainContainer>
    );
}
