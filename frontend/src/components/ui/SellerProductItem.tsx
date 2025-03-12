// 판매자 페이지의 판매 중인 물품들 페이지입니다.

import styled from "@emotion/styled";

const Item = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin-bottom: 2rem;
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
  gap: 0.3em;
`;

const Title = styled.p`
  font-size: 1.6rem;
  font-weight: bold;
  color: white;
`;

const GradeAndAmount = styled.p`
  font-size: 1.4rem;
  color: #7f7f89;
`;

const Price = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
`;

const StatusTag = styled.span<{ status: string }>`
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: ${(props) =>
    props.status === "판매 중" ? "#0d2d24" : "#7F7F89"};
  color: ${(props) => (props.status === "판매 중" ? "#01a26c" : "white")};
  padding: 0.5rem 1rem;
  border-radius: 1rem;
`;

type ProductItemProps = {
  product: {
    buyer: number | null;
    categoryId: number | null;
    description: string | null;
    grade: string | null;
    images: string[];
    name: string | null;
    price: number | null;
    purchaseDate: string | null;
    quantity: number;
    saleStatus: string | null;
    seller: number | null;
    uploadDate: string | null;
  };
};

export default function SellerProductItem({ product }: ProductItemProps) {
  return (
    <Item>
      <Thumbnail src={product.images[0]} />
      <ContentContainer>
        <Title>{product.name}</Title>
        <GradeAndAmount>
          {product.grade} ∙ {product.quantity}개
        </GradeAndAmount>
        <Price>{product.price}원</Price>
        <StatusTag status={product.grade ?? "null"}>{product.saleStatus}</StatusTag>
      </ContentContainer>
    </Item>
  );
}
