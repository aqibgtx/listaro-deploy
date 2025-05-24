import { useState, useEffect, RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  direction?: 'left' | 'right' | 'up' | 'down' | 'none';
  distance?: number;
  delay?: number;
}

export function useInView(
  ref: RefObject<Element>,
  options: UseInViewOptions = { 
    threshold: 0,
    direction: 'none',
    distance: 50,
    delay: 0 
  }
): [boolean, string] {
  const [isIntersecting, setIntersecting] = useState(false);
  
  const getTransformStyle = () => {
    switch (options.direction) {
      case 'left':
        return `translate3d(-${options.distance}px, 0, 0)`;
      case 'right':
        return `translate3d(${options.distance}px, 0, 0)`;
      case 'up':
        return `translate3d(0, -${options.distance}px, 0)`;
      case 'down':
        return `translate3d(0, ${options.distance}px, 0)`;
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const animationStyle = `
    opacity: ${isIntersecting ? '1' : '0'};
    transform: ${isIntersecting ? 'translate3d(0, 0, 0)' : getTransformStyle()};
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    transition-delay: ${options.delay}ms;
  `;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return [isIntersecting, animationStyle];
}