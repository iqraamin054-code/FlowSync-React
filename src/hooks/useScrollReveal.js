import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach((element) => {
      element.classList.add('is-visible');
    });
  }, []);
}
