import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import styles from './CarouselImageViewer.module.css';

export default function CarouselImageViewer({ images }: { images: string[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');

    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    const openModal = (src: string) => {
        setModalImage(src);
        setModalOpen(true);
    };

    return (
        <div className={styles.carouselWrapper}>
            <div className={styles.embla} ref={emblaRef}>
                <div className={styles.emblaContainer}>
                    {images.map((img, idx) => (
                        <div className={styles.emblaSlide} key={idx}>
                            <img
                                src={img}
                                className={styles.slideImage}
                                onClick={() => openModal(img)}
                                alt={`image-${idx}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.dots}>
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        className={`${styles.dot} ${idx === selectedIndex ? styles.active : ''}`}
                        onClick={() => scrollTo(idx)}
                    />
                ))}
            </div>

            {isModalOpen && (
                <div className={styles.modal} onClick={() => setModalOpen(false)}>
                    <img src={modalImage} className={styles.modalImage} alt="확대 이미지" />
                </div>
            )}
        </div>
    );
}
