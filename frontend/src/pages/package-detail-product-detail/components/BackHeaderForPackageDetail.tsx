import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomeIcon from '@/src/assets/images/page/package-detail/homeicon.png';
const Header = styled.div<{ isTransparent: boolean }>`
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    background: ${({ isTransparent }) =>
        isTransparent
            ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0))'
            : '#101012'};    transition: background-color 0.3s ease-in-out;
    padding: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const BackButtonWrapper = styled.div`
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

const HomeButton = styled.img`
    height: 2.4rem;
    position: relative;
    margin-left: 1rem;
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
            { threshold: 0.1 },
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
            <ButtonsWrapper>
                <BackButtonWrapper onClick={handleClick}>
                    <BackButton src="/images/seller/arrow_back.png" onClick={handleClick} />
                </BackButtonWrapper>
                <HomeButton
                    src={HomeIcon}
                    onClick={() => {
                        navigate('/landing-page');
                    }}
                />
            </ButtonsWrapper>
        </Header>
    );
}
