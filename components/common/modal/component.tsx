import { MouseEvent, PropsWithChildren, useEffect } from 'react';
import { CommonModalBackground } from '../commonStyles';

interface CommonModalLayoutInterface extends PropsWithChildren {
  onOutClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export function CommonModalLayout({ onOutClick = () => {}, children }: CommonModalLayoutInterface) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return <CommonModalBackground onClick={onOutClick}>{children}</CommonModalBackground>;
}
