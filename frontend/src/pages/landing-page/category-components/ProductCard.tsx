import styled from '@emotion/styled';
import { useProduct } from '@/src/hooks/useProduct';
import ProductModel from '@/src/models/ProductModel';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCardSkeleton from '@/src/components/ui/ProductCardSkeleton';
type ProductCardProps = {
    productId: number;
    thumbnail: string;
    name: string;
    grade: string;
    price: number;
};

const Card = styled.div`
    display: flex;
    min-width: 14rem;
    flex-direction: column;
    background-color: #2c2c36;
    padding: 1rem;
    border-radius: 0.6rem;
    overflow: hidden;
    gap: 0.2rem;
`;

const ImageWrapper = styled.div`
    align-items: center;
`;

const Image = styled.img`
    height: 14rem;
    width: 14rem;
    object-fit: cover;
    border-radius: 0.6rem;
`;

const Name = styled.p`
    width: 100%;
    font-weight: 600;
    margin: 0.6rem 0 0.4rem;
    font-size: 1.4rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const Info = styled.p`
    font-size: 1.2rem;
    color: #666;
`;

export default function ProductCard({
    productId,
    thumbnail,
    name,
    grade,
    price,
}: ProductCardProps) {
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
    const navigate = useNavigate();

    const { getProduct } = useProduct();

    const handleProductCardClicked = async () => {
        const productInfo = await getProduct(productId);
        navigate('/package-detail-product-detail', {
            state: { product: productInfo?.toJson() },
        });
    };

    return (
        <Card onClick={handleProductCardClicked}>
            {!isImageLoaded && <ProductCardSkeleton />}{' '}
            <ImageWrapper>
                <Image
                    src={thumbnail}
                    alt={name}
                    style={{ display: isImageLoaded ? 'block' : 'none' }}
                    onLoad={() => setIsImageLoaded(true)}
                />
            </ImageWrapper>
            {isImageLoaded && (
                <>
                    <Name>{name}</Name>
                    <Info>
                        {grade} / {price}원
                    </Info>
                </>
            )}
        </Card>
    );
}
