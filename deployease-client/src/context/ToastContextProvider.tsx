import { createContext, useContext } from "react";
import {
  IToastContext,
  IToastProviderProps,
} from "../interfaces/commonInterface";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext<IToastContext | null>(null);
export const useToastContext = () => {
  const state = useContext(ToastContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
};

export const ToastContextProvider: React.FC<IToastProviderProps> = ({
  children,
}) => {
  const showToast = (toastType:string,toastMsg:string)=>{
    switch(toastType){
        case "success":
            toast.success(toastMsg, {
                position: "top-center",
                closeOnClick:true
            });
            break;
        case "error":
            toast.error(toastMsg, {
                position: "top-center",
                closeOnClick:true,
                
            });
            break;
        case "info":
            toast.info(toastMsg, {
                position: "top-center",
                closeOnClick:true
            });
            break;

        default:
            break;


    }
  }

  return (
    <ToastContext.Provider
      value={{ showToast }}
    >
        <ToastContainer autoClose={2000} />
      {children}
    </ToastContext.Provider>
  );
};
