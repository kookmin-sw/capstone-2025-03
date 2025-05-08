import styled from '@emotion/styled';
import WidgetImage from '../../assets/images/page/home/widget.png';
import { useNavigate } from 'react-router-dom';
import PackageModel from '@/src/models/PackageModel';
import { useCategory } from '@/src/hooks/useCategory';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { editingPackageState } from '@/src/recoil/packageState';
import PackageAlternativeImage from '../../assets/images/alternative/package.png';
import FavoriteIcon from '../../assets/images/page/wishlist/favorite_fill.png';
import FavoriteNotFillIcon from '../../assets/images/page/wishlist/favorite_not_fill.png';
import { useCreatePackage, useDeletePackage } from '@/src/hooks/useCustomPackage';
import { useUser } from '@/src/contexts/UserContext';


const Item = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: start;
`;

const ContentContainer = styled.div`
    flex: 1;
`;

const Title = styled.p`
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
`;

const Description = styled.p`
    font-size: 1.4rem;
    color: #7f7f89;
    margin-bottom: 0.5rem;
`;

const Price = styled.p`
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1rem;
`;

const CategoryContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: start;
    align-items: start;
`;

const CategoryIcon = styled.img`
    width: 1.8rem;
    height: 1.8rem;
`;

const CategoryText = styled.p`
    font-size: 1.4rem;
    color: #7f7f89;
`;

const ThumbnailContainer = styled.div`
    width: 12rem;
    height: 12rem;
    margin-right: 1rem;
    object-fit: cover;
    aspect-ratio: 1 / 1;
    overflow: hidden;
`;

const OneThumbnail = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.6rem;
`;

const TwoGrid = styled.div`
  display: flex;
`;

const ThreeGrid = styled.div`
  display: flex;
  flex-direction: column;
`;

const ThreeTop = styled.div`
  flex: 1;
  overflow: hidden;
`;

const ThreeBottom = styled.div`
  display: flex;
  flex: 1;
`;

const FourGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
`;

const GridImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  flex: 1;
  padding: 0.2rem;
  border-radius: 0.6rem;
`;

const LikeButton = styled.button`
    width: 2.4rem;
    height: 2.4rem;
    background-size: cover;
`



type PackageProps = {
    pkg: PackageModel;
    fromDetail: boolean;
};

export default function PackageItem({ pkg, fromDetail }: PackageProps) {
    const { user } = useUser();
    const [price, setPrice] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const { categories } = useCategory();
    const [categoryPreview, setCategoryPreview] = useState('');
    const [, setEditingPackage] = useRecoilState(editingPackageState);
    const navigate = useNavigate();
    // react-query
    const { mutateAsync: createPackage } = useCreatePackage();
    const { mutateAsync: deletePackage } = useDeletePackage();
    const [isLoading, setIsLoading] = useState(false);
    const [copiedPackageId, setCopiedPackageId] = useState(0);

    useEffect(() => {
        const categoryNames = [];
        let count = 0;
        for (let i = 0; i < pkg.categories.length; i++) {
            if (categoryNames.length >= 2) {
                count += 1;
            } else {
                categoryNames.push(
                    categories.find((category) => category.id === pkg.categories[i])?.name
                );
            }
        }

        setCategoryPreview(
            `${categoryNames.join(', ')} ${count > 0 ? `외 ${count}가지로 구성` : '로 구성'}`,
        );
        let myPrice = 0;
        pkg.products.forEach((product) => {
            myPrice += product.price || 0;
        });
        setPrice(myPrice);
    }, []);

    // Function: 패키지 아이템 클릭
    const handlePackageItemClick = () => {
        if (fromDetail) return;
        setEditingPackage(null);
        navigate('/package-detail', { state: { pkg: pkg.toJson() } });
    };

    // function
    const handleClickFavorite = async (pkg: PackageModel) => {
        console.log(pkg.toJson());
        if (isLoading) return;
        setIsLoading(true);
        setIsFavorite(!isFavorite);
        if (isFavorite) {
            await deletePackage({id: copiedPackageId, user: user?.userId!})
        } else {
            const newPackage = await createPackage(PackageModel.fromJson({
                ...pkg,
                user: user?.userId
            }));
            setCopiedPackageId(newPackage.id!);
        }

        setIsLoading(false);
    }

    const CustomThumbnail = () => {
        return (
            <ThumbnailContainer>
                {pkg.products.length === 0 && (
                    <OneThumbnail src={PackageAlternativeImage} />
                )}

                {pkg.products.length === 1 && (
                    <OneThumbnail src={pkg.products[0].images[0]} />
                )}

                {pkg.products.length === 2 && (
                    <TwoGrid>
                        {pkg.products.slice(0, 2).map((p, i) => (
                            <GridImage key={i} src={p.images[0]} />
                        ))}
                    </TwoGrid>
                )}

                {pkg.products.length === 3 && (
                    <ThreeGrid>
                        <ThreeTop>
                            <GridImage src={pkg.products[0].images[0]} />
                        </ThreeTop>
                        <ThreeBottom>
                            {pkg.products.slice(1, 3).map((p, i) => (
                                <GridImage key={i} src={p.images[0]} />
                            ))}
                        </ThreeBottom>
                    </ThreeGrid>
                )}

                {pkg.products.length >= 4 && (
                    <FourGrid>
                        {pkg.products.slice(0, 4).map((p, i) => (
                            <GridImage key={i} src={p.images[0]} />
                        ))}
                    </FourGrid>
                )}
            </ThumbnailContainer>
        );
    };

    return (
        <Item onClick={handlePackageItemClick}>
            <CustomThumbnail />
            <ContentContainer>
                <Title>{pkg.name}</Title>
                <Description>{pkg.description}</Description>
                <Price>{price.toLocaleString()}원</Price>
                <CategoryContainer>
                    <CategoryIcon src={WidgetImage} />
                    <CategoryText>{categoryPreview}</CategoryText>
                </CategoryContainer>
            </ContentContainer>
            <LikeButton style={{ backgroundImage: `url(${isFavorite ? FavoriteIcon : FavoriteNotFillIcon})` }} onClick={(e) => {
                e.stopPropagation();
                handleClickFavorite(pkg);
            }}>
            </LikeButton>
        </Item>
    );
}
