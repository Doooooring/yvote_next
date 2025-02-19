import { createContext, useContext } from 'react';

export interface GlobalLoadingContextProp {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
}

export const GlobalLoadingContext = createContext<GlobalLoadingContextProp | null>(null);

export const useGlobalLoading = () => {
  return useContext(GlobalLoadingContext)!;
};
