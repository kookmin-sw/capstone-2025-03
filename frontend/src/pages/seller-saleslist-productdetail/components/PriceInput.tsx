import styled from "@emotion/styled";
import { Flex } from "@chakra-ui/react";

const Price = styled.div`
  margin-top: 3rem;
`;

const TextPrice = styled.div`
  font-size: 1.4rem;
  color: #747477;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #666;
  padding: 0.5rem 0;
  width: 100%;
`;

const StyledInput = styled.input`
  flex: 1;
  font-size: 2.2rem;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  padding-right: 0.5rem;
`;

const CurrencyText = styled.span`
  font-size: 2.2rem;
  color: white;
`;
interface PriceInputProps {
  price: number | null;
  setPrice: (value: number | null) => void;
}

export default function PriceInput({ price, setPrice }: PriceInputProps) {
  return (
    <Price>
      <Flex direction={"column"}>
        {price !== null && <TextPrice>가격</TextPrice>}
        <InputContainer>
          <StyledInput
            type="number"
            value={price === null ? "" : price}
            placeholder="가격"
            onChange={(e) => {
              const value = e.target.value;
              setPrice(value === "" ? null : Number(value));
            }}
          />
          <CurrencyText>원</CurrencyText>
        </InputContainer>
      </Flex>
    </Price>
  );
}
