import {useEffect, useState} from "react";
import {webRTC_instance} from "./utils/webRTC";
import LoginScreen from './components/loginScreen'
import {socket_instance} from "./utils/socket";
import {user_instance} from "./storage/user";
import './App.css';
import MainScreen from "./components/mainScreen";

function App() {
    const [logged, setLogged] = useState(false)

    /*
    * Handle login status
    * sets user data from server to local storage {name, id, room}
    */
    const onLogged = (data) => {
        user_instance.user = data.data;
        setLogged(true);
    }

    /* Subscribe to loginScreen event and add before unload for socket and RTC connections*/
    useEffect(() => {
        socket_instance.addEventListener('logged', onLogged);
        if (!logged)
            return;
        window.addEventListener("beforeunload", socket_instance.onBeforeUnload);
        window.addEventListener("beforeunload", webRTC_instance.onBeforeUnload);
        return () => {
            socket_instance.removeEventListener('logged', onLogged);
            window.removeEventListener("beforeunload", webRTC_instance.onBeforeUnload);
            window.removeEventListener("beforeunload", socket_instance.onBeforeUnload);
        };
    }, [logged]);

    return <div className="App">
        {logged ? <MainScreen/> : <LoginScreen/>}
    </div>;
}

export default App;
