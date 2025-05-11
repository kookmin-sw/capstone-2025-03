import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const Header = styled.div`
    position: fixed;
    max-width: 500px;
    top: 0;
    width: 100%;
    background-color: #101012;
    padding: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
`;

const BackButtonWrapper = styled.div`
    position: relative;
    display: inline-block;
    cursor: pointer;

    &::before {
        content: '';
        position: absolute;
        top: -3rem;
        bottom: -2rem;
        left: -3rem;
        right: -2rem;
    }
`;

const BackButton = styled.img`
    height: 2.4rem;
    position: relative;
    z-index: 1;
`;

export default function BackHeader() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    };

    return (
        <Header>
            <BackButtonWrapper>
                <BackButton src="/images/seller/arrow_back.png" onClick={handleClick} />
            </BackButtonWrapper>
        </Header>
    );
}
