import { useEffect, useState } from 'react';

export enum ScrollDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

export const useScrollInfo = () => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(ScrollDirection.DOWN);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollTop = window.scrollY;
    setScrollY(currentScrollTop);

    if (currentScrollTop > lastScrollTop) {
      setScrollDirection(ScrollDirection.DOWN);
    } else {
      setScrollDirection(ScrollDirection.UP);
    }
    setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollDirection, scrollY };
};
