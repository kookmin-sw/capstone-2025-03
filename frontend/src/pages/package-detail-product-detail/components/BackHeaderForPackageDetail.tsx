import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = styled.div<{ isTransparent: boolean }>`
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    background-color: ${({ isTransparent }) => (isTransparent ? 'transparent' : '#101012')};
    transition: background-color 0.3s ease-in-out;
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

export default function BackHeaderForPackageDetail({
    targetRef,
}: {
    targetRef: React.RefObject<HTMLElement>;
}) {
    const navigate = useNavigate();
    const [isTransparent, setTransparent] = useState<boolean>(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setTransparent(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        const el = targetRef.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [targetRef]);

    const handleClick = () => {
        navigate(-1);
    };

    return (
        <Header isTransparent={isTransparent}>
            <BackButtonWrapper onClick={handleClick}>
                <BackButton src="/images/seller/arrow_back.png" onClick={handleClick} />
            </BackButtonWrapper>
        </Header>
    );
}
