import RegisterAndLoginForm from "./RegisterAndLoginForm";
import {useContext} from "react";
import { UserContext } from "./UserContext.jsx"


export default function Routes(){

    const{username,id}=useContext(UserContext);
    if(username){
        return 'Logged In '+username;
    }  
    return(
        <RegisterAndLoginForm/>
    )
}