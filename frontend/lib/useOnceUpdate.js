import { useEffect, useRef } from 'react';

/**
 * Custom hook that runs a callback function once per state update.
 * 
 * @param {Function} callback - The function to run on state update.
 * @param {Array} deps - The dependency array.
 */
const useOncePerUpdate = (callback, deps) => {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!hasRunRef.current) {
      hasRunRef.current = true; // Mark as run for the first time
    } else {
      callback(); // Call the callback only on subsequent updates
    }
  }, deps);
};

export default useOncePerUpdate;