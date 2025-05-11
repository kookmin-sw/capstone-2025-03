/** @jsxImportSource @emotion/react */
import { keyframes, css } from '@emotion/react';
import styled from '@emotion/styled';

const color = {
    primary: {},
    grayScale: {
        gray500: '#111111',
        gray400: '#777777',
        gray300: '#EEEEEE',
        gray200: '#F5F5F5',
        gray100: '#FFFFFF',
    },
    flavor: {
        fruit: '#DB1C24',
        floral: '#DB0D69',
        sweet: '#E45833',
        nutty: '#A97B64', // 코코아 동일
        spices: '#AE202E',
        roasted: '#C94930',
        green: '#177A30', // vagetable 동일
        sour: '#ECB50F',
        other: '#0AA4B6',
    },
};

const title4 = {
    fontFamily: 'Pretendard, sans-serif',
    fontWeight: '600',
    fontSize: '1.8rem',
    lineHeight: '2.4rem',
    letterSpacing: '-0.2%',
};

export const caption = {
    fontFamily: 'Pretendard, sans-serif',
    fontWeight: '400',
    fontSize: '1.8rem',
    lineHeight: '1.8rem',
    letterSpacing: '-0.2%',
};

export const heroBanner = styled.div`
    padding-top: 3.2rem;
    background: ${color.grayScale.gray500};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const bannerTypo = styled.div`
    margin: 2.474rem auto;

    @media (max-width: 375px) {
        width: 33.5rem;
    }

    @media (min-width: 376px) and (max-width: 500px) {
        width: 35rem;
    }

    @media (min-width: 501px) {
        width: 37.4rem;
        margin: 2.68rem auto;
    }
`;

export const MainCarousel = styled.div`
    overflow: hidden;
    width: 100%;
    position: relative;
`;

export const CarouselWrapper = styled.ol`
    display: flex;
`;

export const CarouselSlider = styled.li`
    flex: 0 0 100%;
    min-width: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    /* cursor: pointer; */
`;

export const CarouselImage = styled.img`
    object-fit: cover;

    @media (max-width: 375px) {
        width: 26.8rem;
        height: 26.8rem;
    }

    @media (min-width: 376px) and (max-width: 500px) {
        width: 29.2rem;
        height: 29.2rem;
    }

    @media (min-width: 501px) {
        width: 31.6rem;
        height: 31.6rem;
    }

    &:hover {
        cursor: pointer;
    }
`;

export const CarouselSnap = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
`;

export const BannerDescription = styled.div`
    color: white;
    margin-top: 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (min-width: 501px) {
        margin-top: 1.4rem;
    }
`;

export const BannerText = styled.span`
    line-height: 2.3rem;
    font-size: 1.5rem;
    font-weight: 600;

    @media (min-width: 501px) {
        ${title4}
    }
`;

export const BannerOrder = styled.span`
    ${caption};
    padding: 0.4rem 0.8rem;
    color: white;
    background: rgba(17, 17, 17, 0.8);
    position: absolute;
    bottom: 0;
    right: 0;
    white-space: nowrap;
`;

export const BannerLength = styled.span`
    color: #777777;
`;

export const ProgressBarContainer = styled.div`
    background-color: #bcbcbc;
    height: 0.4rem;
    margin-top: 4rem;
`;

export const autoplayProgress = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const ProgressBar = styled.div`
    background: ${color.grayScale.gray400};
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    transform: translateX(-100%);
    animation-name: ${autoplayProgress};
    animation-timing-function: linear;
`;
