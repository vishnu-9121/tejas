import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useNetwork = () => {
  const [isOnline, setNetwork] = useState(window.navigator.onLine);

  useEffect(() => {
    const updateNetwork = () => {
      setNetwork(window.navigator.onLine);
      if (window.navigator.onLine) {
        toast.success("You're back online!");
      } else {
        toast.error("You are offline. Please check your internet connection.", { duration: 5000 });
      }
    };

    window.addEventListener('offline', updateNetwork);
    window.addEventListener('online', updateNetwork);

    return () => {
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('online', updateNetwork);
    };
  }, []);

  return isOnline;
};
