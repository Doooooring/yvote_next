import { useEffect, useState } from 'react';
import { Device } from '../interface/common';

export const useDevice = () => {
  const [device, setDevice] = useState<Device>(Device.pc);

  useEffect(() => {
    const updateCommentBasedOnWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 480) {
        setDevice(Device.mobile);
      } else if (screenWidth < 768) {
        setDevice(Device.tablet);
      } else {
        setDevice(Device.pc);
      }
    };

    updateCommentBasedOnWidth();
    window.addEventListener('resize', updateCommentBasedOnWidth);

    return () => window.removeEventListener('resize', updateCommentBasedOnWidth);
  }, []);

  return device;
};
