import {  createContext, useCallback, useContext, useEffect, useState } from "react";
import { IAuthContext, IAuthProviderProps, IAxiosResponse, User } from "../interfaces/commonInterface";
import axios from "axios";

const AuthContext = createContext<IAuthContext | null>(null)
export const useAuthContext = ()=>{
    const state = useContext(AuthContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
}

export const AuthContextProvider:React.FC<IAuthProviderProps> = ({children})=>{
    const [user,setUser]=useState<User|null>(null)
    const fetchUser = useCallback(async()=>{
        try {
            
            const result = await axios.get("http://localhost:9000/api/user/loggedInUser",{withCredentials:true})
            if(result && result.status){
                const resData:IAxiosResponse<User>= result.data
                setUser(resData.data)
            }
        } catch (error) {
            console.log(error)
        }
    },[])
    useEffect(()=>{
        fetchUser()
    },[])
    return (
        <AuthContext.Provider value={{user,setUser,fetchUser}}>
            {children}
        </AuthContext.Provider>
    )
}