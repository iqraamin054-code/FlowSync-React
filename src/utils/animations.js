export function fadeInUp(delay = 0) {
  return {
    animationDelay: `${delay}ms`,
    transition: 'all 0.3s ease-in-out'
  };
}
