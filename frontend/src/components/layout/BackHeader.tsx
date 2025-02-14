import styled from "@emotion/styled";
import ArrowBack from "../../assets/images/header/arrow_back.png";
import { useNavigate } from "react-router-dom";

const Header = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
`;

const BackButton = styled.img`
    height: 2.4rem;
`;

export default function BackHeader() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    }

    return (<Header>
        <BackButton src={ArrowBack} onClick={handleClick} />
    </Header>)
}