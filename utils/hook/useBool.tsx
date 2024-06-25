import { useCallback, useState } from 'react';

export const useBool: (state: boolean) => [boolean, () => void, () => void, () => void] = (
  state: boolean,
) => {
  const [is, setIs] = useState<boolean>(state);

  const setTrue = () => {
    setIs(true);
  };

  const setFalse = () => {
    setIs(false);
  };

  const toggleState = useCallback(() => {
    setIs(!is);
  }, [is]);

  return [is, setTrue, setFalse, toggleState];
};
