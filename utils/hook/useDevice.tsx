import { useEffect, useState } from 'react';

export enum Device {
  pc = 'pc',
  mobile = 'mobile',
}

export const useDevice = () => {
  const [device, setDevice] = useState<Device>(Device.pc);

  useEffect(() => {
    const updateCommentBasedOnWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 480) {
        setDevice(Device.mobile);
      } else {
        setDevice(Device.pc);
      }
    };

    // Update comment on mount and when resizing the window
    updateCommentBasedOnWidth();
    window.addEventListener('resize', updateCommentBasedOnWidth);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', updateCommentBasedOnWidth);
  }, []);

  return device;
};
