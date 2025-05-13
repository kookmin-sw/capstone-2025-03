import React from 'react';
import {
    MainCarousel,
    CarouselWrapper,
    ProgressBarContainer,
    ProgressBar,
    CarouselSlider,
} from './MainBanner.css';
import { useCarousel } from '@/src/hooks/useCarousel';

const CAROUSEL_AUTOPLAY_DELAY = 3000;

const Carousel = Object.assign(BaseCarousel, { Slide: CarouselSlide });

export default Carousel;

function BaseCarousel({ children }: React.PropsWithChildren) {
    if (React.Children.count(children) === 0) {
        throw new Error('캐러셀이 비어 있습니다.');
    }

    const { containerRef, progressBarRef } = useCarousel(CAROUSEL_AUTOPLAY_DELAY);

    return (
        <MainCarousel ref={containerRef}>
            <CarouselWrapper>{children}</CarouselWrapper>
            <ProgressBarContainer>
                <ProgressBar ref={progressBarRef}></ProgressBar>
            </ProgressBarContainer>
        </MainCarousel>
    );
}

function CarouselSlide({ children }: React.PropsWithChildren) {
    return <CarouselSlider>{children}</CarouselSlider>;
}
