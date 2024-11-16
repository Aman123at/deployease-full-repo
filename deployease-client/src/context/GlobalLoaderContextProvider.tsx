import { createContext, useContext, useState } from "react";
import {
    IGlobalLoaderContext,
    IGlobalLoaderProviderProps,
} from "../interfaces/commonInterface";
import Loader from "../components/Loader";

const GlobalLoaderContext = createContext<IGlobalLoaderContext | null>(null);
export const useGlobalLoaderContext = () => {
  const state = useContext(GlobalLoaderContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
};

export const GlobalLoaderContextProvider: React.FC<IGlobalLoaderProviderProps> = ({
  children,
}) => {
  const [globalLoader,setGlobalLoader] = useState<boolean>(false)

  return (
    <GlobalLoaderContext.Provider
      value={{ globalLoader,setGlobalLoader }}
    >
        {globalLoader && <Loader />}
      {children}
    </GlobalLoaderContext.Provider>
  );
};
