import BuyerProductModel from "@/src/models/BuyerProductModel";
import styled from "@emotion/styled";

const Item = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
`;

const Thumbnail = styled.img`
  width: 12rem;
  height: 12rem;
  border-radius: 2rem;
  margin-right: 1rem;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 1rem;
`;

const Title = styled.p`
  font-size: 1.6rem;
  font-weight: bold;
`;

const GradeAndAmount = styled.p`
  font-size: 1.4rem;
  color: #7F7F89;
`;

const Price = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
`;

export default function ProductItem({ product }: { product: BuyerProductModel }) {
    return (
        <Item>
        <Thumbnail src= { product.images[0] } />
        <ContentContainer>
        <Title>
        { product.name }
        </Title>
        <GradeAndAmount>
    { product.grade } 등급 ∙ { product.quantity } 개
        </GradeAndAmount>
        <Price>
    { product.price } 원
        </Price>
        </ContentContainer>
        </Item>
  )
}