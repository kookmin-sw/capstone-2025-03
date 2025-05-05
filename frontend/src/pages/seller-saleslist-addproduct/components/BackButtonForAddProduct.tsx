import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

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

export default function BackButtonForAddProduct() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/seller-saleslist');
    };

    return (
        <BackButtonWrapper onClick={handleClick}>
            <BackButton src="/images/seller/arrow_back.png" onClick={handleClick} />
        </BackButtonWrapper>
    );
}
