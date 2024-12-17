import { ReactNode } from 'react';

interface ToggleProps {
  state: boolean;
  is: ReactNode;
  notIs: ReactNode;
}

export default function Toggle({ state, is, notIs }: ToggleProps) {
  return <>{state ? is : notIs}</>;
}
