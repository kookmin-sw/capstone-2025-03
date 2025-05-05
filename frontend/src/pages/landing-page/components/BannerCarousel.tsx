import Carousel from './Carousel';
import {
    BannerDescription,
    BannerLength,
    BannerOrder,
    BannerText,
    CarouselImage,
    CarouselSnap,
} from './MainBanner.css';
import { useNavigate } from 'react-router-dom';

export default function BannerCarousel({
    banners,
}: {
    banners: { text: string; image: string; linkTo: string }[];
}) {
    const navigate = useNavigate();

    return (
        <Carousel>
            {banners.map((banner, index) => (
                <Carousel.Slide key={`${banner.text}-${index}`}>
                    <button onClick={() => navigate('linkTo')}>
                        <CarouselSnap>
                            <CarouselImage
                                src={banner.image}
                                alt={banner.text}
                                width="316"
                                height="316"
                            />
                            <BannerOrder>
                                {index + 1}
                                <BannerLength> / {banners.length}</BannerLength>
                            </BannerOrder>
                        </CarouselSnap>
                        <BannerDescription>
                            <BannerText>{banner.text}</BannerText>
                        </BannerDescription>
                    </button>
                </Carousel.Slide>
            ))}
        </Carousel>
    );
}
