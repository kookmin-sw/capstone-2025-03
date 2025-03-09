import styled from "@emotion/styled";
import WidgetImage from "../../assets/images/page/home/widget.png";
import { useNavigate } from "react-router-dom";
import PackageModel from "@/src/models/PackageModel";
import { useCategory } from "@/src/hooks/useCategory";
import { useEffect, useState } from "react";
import { useBuyerProduct } from "@/src/hooks/useBuyerProduct";
import { Spinner } from "@chakra-ui/react";

const Item = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
`;

const Thumbnail = styled.img`
  width: 12rem;
  height: 12rem;
  border-radius: 1.2rem;
  margin-right: 1rem;
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
  font-size:1.4rem;
  color: #7F7F89;
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
  align-items: center;
`;

const CategoryIcon = styled.img`
  width: 1.8rem;
  height: 1.8rem;
`;

const CategoryText = styled.p`
  font-size: 1.4rem;
  color: #7F7F89;
`;

type PackageProps = {
  pkg: PackageModel;
}

export default function PackageItem({ pkg }: PackageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { categories, getCategory } = useCategory();
  const { buyerProducts, getBuyerProduct } = useBuyerProduct();
  const [categoryPreview, setCategoryPreview] = useState("");
  const navigate = useNavigate();

  // useEffect
  useEffect(() => {
    const missingCategories = pkg.categoryIds.filter(
      (categoryId) => !categories.find((category) => category.id === categoryId)
    );
    for (let i = 0; i < missingCategories.length; i++) getCategory(missingCategories[i]);
    const missingProducts = pkg.productIds.filter(
      (productId) => !buyerProducts.find((buyerProduct) => buyerProduct.id === productId)
    );
    for (let i = 0; i < missingProducts.length; i++) getBuyerProduct(missingProducts[i]);
  }, []);

  useEffect(() => {
    if (isLoading
      && pkg.categoryIds.every((categoryId) => categories.some((category) => category.id === categoryId))
      && pkg.productIds.every((productId) => buyerProducts.some((buyerProduct) => buyerProduct.id === productId))) {
      setIsLoading(false);
    }
  }, [categories, buyerProducts])

  useEffect(() => {
    const categoryNames = [];
    let count = 0;
    for (let i = 0; i < pkg.categoryIds.length; i++) {
      if (categoryNames.length >= 2) count += 1;
      categoryNames.push(categories.find((category) => category.id === pkg.categoryIds[i])?.name);
    }
    setCategoryPreview(`${categoryNames.join(", ")} ${count > 0 ? `외 ${count}가지로 구성` : "로 구성"}`);
  }, [isLoading])

  // Function: 패키지 아이템 클릭
  const handlePackageItemClick = () => {
    navigate('/package-detail', { state: { pkg: pkg.toJson() } });
  }

  return (
    <Item onClick={handlePackageItemClick}>
      {isLoading ? <Spinner
        color="#00A36C"
        borderWidth="0.6rem"
        animationDuration="0.8s"
        style={{ width: "2rem", height: "2rem" }}
      /> : (<>
        <Thumbnail src={pkg.thumbnail ?? undefined} />
        <ContentContainer>
          <Title>
            {pkg.name}
          </Title>
          <Description>
            {pkg.description}
          </Description>
          <Price>
            {pkg.price}원
          </Price>
          <CategoryContainer>
            <CategoryIcon src={WidgetImage} />
            <CategoryText>
              {categoryPreview}
            </CategoryText>
          </CategoryContainer>
        </ContentContainer>
      </>)}
    </Item>
  )
}