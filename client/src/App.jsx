import axios from "axios";
import { UserContextProvider } from "./UserContext";
import Routes from "./Routes";

function App() {

//back end port
axios.defaults.baseURL='http://localhost:4000';

//set cookies from API

axios.defaults.withCredentials=true;


  return (  
    <UserContextProvider>
      <Routes/>
    </UserContextProvider>
        
  )
}

export default App

