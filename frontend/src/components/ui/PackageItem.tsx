import styled from '@emotion/styled';
import WidgetImage from '../../assets/images/page/home/widget.png';
import { useNavigate } from 'react-router-dom';
import PackageModel from '@/src/models/PackageModel';
import { useCategory } from '@/src/hooks/useCategory';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { editingPackageState } from '@/src/recoil/packageState';
import PackageAlternativeImage from '../../assets/images/alternative/package.png';
import ProductModel from '@/src/models/ProductModel';
import { useProduct } from '@/src/hooks/useProduct';


const Item = styled.div`
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


type PackageProps = {
    pkg: PackageModel;
};

export default function PackageItem({ pkg }: PackageProps) {
    const [price, setPrice] = useState(0);
    const { categories } = useCategory();
    const [categoryPreview, setCategoryPreview] = useState('');
    const [, setEditingPackage] = useRecoilState(editingPackageState);
    const navigate = useNavigate();
    const { productList } = useProduct();
    const [myProductList, setMyProductList] = useState<ProductModel[]>([]);

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
        const newProductList: ProductModel[] = pkg.products
            .map((productId) => productList.find((product) => product.id === productId))
            .filter(Boolean) as ProductModel[];
        newProductList.forEach((product) => {
            myPrice += product.price || 0;
        });
        setMyProductList(newProductList);
        setPrice(myPrice);
    }, []);

    // Function: 패키지 아이템 클릭
    const handlePackageItemClick = () => {
        setEditingPackage(null);
        navigate('/package-detail', { state: { pkg: pkg.toJson() } });
    };

    const CustomThumbnail = () => {
        return (
            <ThumbnailContainer>
                {myProductList.length === 0 && (
                    <OneThumbnail src={PackageAlternativeImage} />
                )}

                {myProductList.length === 1 && (
                    <OneThumbnail src={myProductList[0].images[0]} />
                )}

                {myProductList.length === 2 && (
                    <TwoGrid>
                        {myProductList.slice(0, 2).map((p, i) => (
                            <GridImage key={i} src={p.images[0]} />
                        ))}
                    </TwoGrid>
                )}

                {myProductList.length === 3 && (
                    <ThreeGrid>
                        <ThreeTop>
                            <GridImage src={myProductList[0].images[0]} />
                        </ThreeTop>
                        <ThreeBottom>
                            {myProductList.slice(1, 3).map((p, i) => (
                                <GridImage key={i} src={p.images[0]} />
                            ))}
                        </ThreeBottom>
                    </ThreeGrid>
                )}

                {myProductList.length >= 4 && (
                    <FourGrid>
                        {myProductList.slice(0, 4).map((p, i) => (
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
        </Item>
    );
}
