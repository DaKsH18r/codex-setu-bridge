/**
 * Debounce function to limit the rate at which a function can fire
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param immediate - If true, trigger the function on the leading edge, instead of the trailing
 * @returns The debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      func(...args);
    }
  };
}

export default debounce;