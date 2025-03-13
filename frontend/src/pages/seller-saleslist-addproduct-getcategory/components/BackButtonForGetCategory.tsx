import styled from "@emotion/styled";
import ArrowBack from "@/src/assets/images/page/seller-saleslist-addproduct-getcategory/arrow_back.png";
import { useNavigate } from "react-router-dom";

const Button = styled.img`
  height: 2.4rem;
  margin-left: 2rem;
  cursor: pointer;
`;

export default function BackButtonForGetCategory() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return <Button src={ArrowBack} onClick={handleClick} />;
}
