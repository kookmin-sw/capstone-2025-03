import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const Header = styled.div`
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 500px;
    background-color: #101012;
    padding: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
`;

const BackButtonWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    display: flex;
    flex-direction: row;
    cursor: pointer;
    background-color: #101012;
`;

const BackButton = styled.img`
    height: 2.4rem;
    position: relative;
    z-index: 1;
`;

const CategoryName = styled.p`
    display: flex;
    font-weight: 600;
    font-size: 2rem;
`;

const Nothing = styled.div`
    width: 2.4rem;
`

type BackHeaderForCategoryProps = {
    category: string;
};

export default function BackHeaderForCategory({ category }: BackHeaderForCategoryProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    };

    return (
        <Header>
            <BackButtonWrapper>
                <BackButton src="/images/seller/arrow_back.png" onClick={handleClick} />
                <CategoryName>{category}</CategoryName>
                <Nothing></Nothing>
            </BackButtonWrapper>
        </Header>
    );
}
