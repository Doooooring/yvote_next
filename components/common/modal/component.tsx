import { MouseEvent, PropsWithChildren, useCallback, useEffect } from 'react';
import { CommonModalBackground } from '../commonStyles';

interface CommonModalLayoutInterface extends PropsWithChildren {
  onOutClick?: (e?: MouseEvent<HTMLDivElement>) => void;
}

export function CommonModalLayout({
  onOutClick: onOutClickUser = () => {},
  children,
}: CommonModalLayoutInterface) {
  const onOutClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onOutClickUser(e);
      }
    },
    [onOutClickUser],
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return <CommonModalBackground onClick={onOutClick}>{children}</CommonModalBackground>;
}
