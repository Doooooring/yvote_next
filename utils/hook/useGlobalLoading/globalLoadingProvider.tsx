import { PropsWithChildren, useState } from 'react';
import { GlobalLoadingContext } from './useGlobalLoading';

export function GlobalLoadingProvider({ children, ...others }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </GlobalLoadingContext.Provider>
  );
}
