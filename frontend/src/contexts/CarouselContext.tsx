import { createContext, useContext } from 'react';

interface CarouselContextType {
    scrollPrev: () => void;
    scrollNext: () => void;
}

export const CarouselContext = createContext<CarouselContextType | null>(null);

export const useCarouselControl = () => {
    const ctx = useContext(CarouselContext);
    if (!ctx) throw new Error('사용 불가능');
    return ctx;
};
