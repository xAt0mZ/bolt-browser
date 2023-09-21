import { PropsWithChildren, createContext, useContext, useState } from 'react';

export type Option = {
  [field: string]: boolean;
};

export type Options = {
  [bucket: string]: Option & { __internal__enabled: boolean };
};

type State = {
  options: Options;
  setOptions: React.Dispatch<React.SetStateAction<Options>>;
};

const OptionsContext = createContext<State | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useOptions() {
  const ctx = useContext(OptionsContext);
  if (!ctx) {
    throw new Error('useContext inside provider');
  }
  return ctx;
}

export function OptionsProvider({ children }: PropsWithChildren) {
  const [options, setOptions] = useState<Options>({});

  return (
    <OptionsContext.Provider value={{ options, setOptions }}>
      {children}
    </OptionsContext.Provider>
  );
}
