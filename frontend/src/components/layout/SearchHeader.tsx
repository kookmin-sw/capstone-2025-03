import styled from "@emotion/styled";
import ArrowBack from "../../assets/images/header/arrow_back.png";
import { useNavigate } from "react-router-dom";
import SearchIconImage from "../../assets/images/header/search.png";

const Header = styled.div`
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #18171D;
    padding: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
`;

const BackButton = styled.img`
    height: 2.4rem;
`;

const SearchContainer = styled.div`
    background-color: #2C2C36;
    flex-grow: 1;
    padding: 0.8rem 1.2rem;
    border-radius: 1.2rem;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: row;
    gap: 1rem;
`;

const SearchIcon = styled.img`
    width: 2.4rem;
    height: 2.4rem;
`;

const SearchText = styled.p`
    font-size: 1.4rem;
`;

export default function SearchHeader({ text }: { text: string }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    }

    return (
        <Header>
            <BackButton src={ArrowBack} onClick={handleClick} />
            <SearchContainer>
                <SearchIcon src={SearchIconImage} />
                <SearchText>
                    {text}
                </SearchText>
            </SearchContainer>
        </Header>
    )
}