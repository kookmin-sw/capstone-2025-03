import useEmblaCarousel from 'embla-carousel-react';
import * as React from 'react';
import {
    CarouselContainer,
    CarouselWrapper,
    CarouselSlider,
    ProgressBarContainer,
    ProgressBar,
} from './IntroduceMain';

const FullPageCarousel = Object.assign(BaseCarousel, { Slide: CarouselSlide });

export default FullPageCarousel;

export function BaseCarousel({ children }: React.PropsWithChildren) {
    const [emblaRef, emblaApi] = useEmblaCarousel();

    const slideCount = React.Children.count(children);
    const [progressRate, setProgressRate] = React.useState((1 / slideCount) * 100);

    React.useEffect(() => {
        const updateProgressRate = () => {
            const currentIndex = (emblaApi?.selectedScrollSnap() || 0) + 1;

            setProgressRate((currentIndex / slideCount) * 100);
        };

        emblaApi?.on('select', updateProgressRate);

        return () => {
            emblaApi?.off('select', updateProgressRate);
        };
    }, [emblaApi, slideCount]);

    return (
        <div>
            <ProgressBarContainer>
                <ProgressBar style={{ width: `${progressRate}%` }}></ProgressBar>
            </ProgressBarContainer>
            <CarouselContainer ref={emblaRef}>
                <CarouselWrapper>{children}</CarouselWrapper>
            </CarouselContainer>
        </div>
    );
}

export function CarouselSlide({ children }: React.PropsWithChildren) {
    return <CarouselSlider>{children}</CarouselSlider>;
}
