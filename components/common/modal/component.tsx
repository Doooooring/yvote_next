import { MouseEvent, PropsWithChildren, useEffect } from 'react';

import { CommonModalBackground } from '../commonStyles';

interface CommonModalLayoutInterface extends PropsWithChildren {
  onOutClick?: (e?: MouseEvent<HTMLDivElement>) => void;
}

const noop = () => undefined;

export function CommonModalLayout({
  onOutClick: onOutClickUser = noop,
  children,
}: CommonModalLayoutInterface) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <CommonModalBackground
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onOutClickUser(e);
        }
      }}
    >
      {children}
    </CommonModalBackground>
  );
}
