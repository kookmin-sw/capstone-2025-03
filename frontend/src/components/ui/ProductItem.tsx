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
  color: #7f7f89;
`;

const Price = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
`;

type ProductItemProps = {
  product: {
    id: string;
    name: string;
    grade: string;
    amount: number;
    price: number | null;
    thumbnail: string;
  };
};

export default function ProductItem({ product }: ProductItemProps) {
  return (
    <Item>
      <Thumbnail src={product.thumbnail} />
      <ContentContainer>
        <Title>{product.name}</Title>
        <GradeAndAmount>
          {product.grade}등급 ∙ {product.amount}개
        </GradeAndAmount>
        <Price>
          {product.price !== null
            ? `${product.price.toLocaleString()}원`
            : "가격 미정"}
        </Price>
      </ContentContainer>
    </Item>
  );
}
