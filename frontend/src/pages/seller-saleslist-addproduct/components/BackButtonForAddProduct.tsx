import styled from "@emotion/styled";
import ArrowBack from "@/src/assets/images/page/seller-saleslist-addproduct-getcategory/arrow_back.png";
import { useNavigate } from "react-router-dom";

const Button = styled.img`
  height: 2.4rem;
  cursor: pointer;
`;

export default function BackButtonForAddProduct() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/seller-saleslist");
  };

  return <Button src={ArrowBack} onClick={handleClick} />;
}
