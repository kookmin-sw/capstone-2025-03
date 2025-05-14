import useEmblaCarousel from 'embla-carousel-react';
import * as React from 'react';
import {
    CarouselContainer,
    CarouselWrapper,
    CarouselSlider,
    ProgressBarContainer,
    ProgressBar,
} from './Introduce.css';
import { CarouselContext } from '../../../contexts/CarouselContext';
import { forwardRef } from 'react';

interface BaseCarouselProps extends React.PropsWithChildren {
    emblaRef: (node: HTMLElement | null) => void;
    emblaApi: ReturnType<typeof useEmblaCarousel>[1] | null;
}


const BaseCarousel = forwardRef<HTMLDivElement, BaseCarouselProps>(
    ({ children, emblaRef, emblaApi }, ref) => {
        const slideCount = React.Children.count(children);
        const [progressRate, setProgressRate] = React.useState((1 / slideCount) * 100);

        React.useEffect(() => {
            if (!emblaApi) {
                return undefined;
            }

            const updateProgressRate = () => {
                const currentIndex = (emblaApi.selectedScrollSnap() || 0) + 1;
                setProgressRate((currentIndex / slideCount) * 100);
            };

            emblaApi.on('select', updateProgressRate);
            updateProgressRate(); // 초기 반영

            return () => {
                emblaApi.off('select', updateProgressRate);
            };
        }, [emblaApi, slideCount]);

        return (
            <CarouselContext.Provider value={{ scrollPrev: () => emblaApi?.scrollPrev(), scrollNext: () => emblaApi?.scrollNext() }}>
                <div>
                    <ProgressBarContainer>
                        <ProgressBar style={{ width: `${progressRate}%` }} />
                    </ProgressBarContainer>
                    <CarouselContainer
                        ref={(node) => {
                            emblaRef(node);
                            if (typeof ref === 'function') ref(node);
                            else if (ref && 'current' in ref) ref.current = node;
                        }}
                    >
                        <CarouselWrapper>{children}</CarouselWrapper>
                    </CarouselContainer>
                </div>
            </CarouselContext.Provider>
        );
    }
);

const FullPageCarousel = Object.assign(BaseCarousel, { Slide: CarouselSlide });
export default FullPageCarousel;

export function CarouselSlide({ children }: React.PropsWithChildren) {
    return <CarouselSlider>{children}</CarouselSlider>;
}
