import FullPageCarousel from './components/FullPageCarousel';
import IntroduceMain from './components/IntroduceMain';
import IntroduceTemplate from './components/IntroduceTemplate';
import { IntroduceContents } from './components/IntroduceContents';
import { IntroducePage } from './components/Introduce.css';
import IntroduceEnd from './components/IntroduceEnd';
import { useEffect, useState } from 'react';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import { CarouselContext } from '@/src/contexts/CarouselContext';
import styled from '@emotion/styled';

const LeftButton = styled.button`
    position: fixed;
    font-size: 3rem;
    top: 50%;
    left: calc((100vw - 768px) / 2 - 3rem);
    transform: translateY(-50%);
    z-index: 1000;
    color: white;
    padding: 1rem;
    border: none;
    border-radius: 50%;
    cursor: pointer;

    transition: opacity 1s ease-in-out;
    @media (max-width: 1000px) {
        opacity: 0;
    }
`;

const RightButton = styled.button`
    position: fixed;
    font-size: 3rem;
    top: 50%;
    right: calc((100vw - 768px) / 2 - 3rem);
    transform: translateY(-50%);
    z-index: 1000;
    color: white;
    padding: 1rem;
    border: none;
    border-radius: 50%;
    cursor: pointer;

    transition: opacity 1s ease-in-out;
    @media (max-width: 1000px) {
        opacity: 0;
    }
`;
type EmblaApi = UseEmblaCarouselType[1];

export default function LandingPageIntroduce() {
    const [emblaRef, emblaApi] = useEmblaCarousel();
    const [api, setApi] = useState<EmblaApi | null>(null);

    useEffect(() => {
        if (emblaApi) setApi(emblaApi);
    }, [emblaApi]);

    const scrollPrev = () => api?.scrollPrev();
    const scrollNext = () => api?.scrollNext();

    return (
        <CarouselContext.Provider value={{ scrollPrev, scrollNext }}>
            <LeftButton
                onClick={() => {
                    scrollPrev();
                }}
            >
                ◀
            </LeftButton>
            <IntroducePage>
                <FullPageCarousel emblaRef={emblaRef} emblaApi={emblaApi}>
                    <FullPageCarousel.Slide>
                        <IntroduceMain />
                    </FullPageCarousel.Slide>
                    {IntroduceContents.map(({ id, title, subTitle, description, image }) => {
                        return (
                            <FullPageCarousel.Slide key={id}>
                                <IntroduceTemplate
                                    title={title}
                                    subTitle={subTitle}
                                    description={description}
                                    image={image}
                                />
                            </FullPageCarousel.Slide>
                        );
                    })}
                    <FullPageCarousel.Slide>
                        <IntroduceEnd />
                    </FullPageCarousel.Slide>
                </FullPageCarousel>
            </IntroducePage>
            <RightButton onClick={scrollNext}>▶</RightButton>
        </CarouselContext.Provider>
    );
}
