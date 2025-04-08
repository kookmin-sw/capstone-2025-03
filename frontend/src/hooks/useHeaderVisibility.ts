// 스크롤 방향 감지 후 show, hide 와 같은 플래그 리턴하는 훅
import { useEffect, useRef, useState } from 'react';

export function useHeaderVisibility(threshold = 10) {
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const lastScrollY = useRef(window.scrollY);
    const ticking = useRef(false);

    const updateScrollDirection = () => {
        const scrollY = window.scrollY;
        const diff = scrollY - lastScrollY.current;

        if (Math.abs(diff) >= threshold) {
            setIsVisible(diff < 0);
        }

        lastScrollY.current = scrollY;
        ticking.current = false;
    };

    useEffect(() => {
        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updateScrollDirection);
                ticking.current = true;
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);

    return isVisible;
}
