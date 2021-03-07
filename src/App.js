import {useEffect, useState} from "react";
import {webRTC_instance} from "./utils/webRTC";
import Login from './components/login'
import {socket_instance} from "./utils/socket";
import UserList from "./components/usersList";
import VideoGrid from "./components/videoGrid";
import Chat from "./components/chat";
import {user_instance} from "./storage/user";
import {media_instance} from "./storage/mediaStreams";
import './App.css';

function App() {
    const [logged, setLogged] = useState(false)

    /* Tracks logged status
    * sets user data from server to local storage {name, id, room}
    * sets local id to media instance (store local and peers streams/tracks)
    */
    const onLogged = (data) => {
        user_instance.user = data.data;
        media_instance.localId = data.data.id;
        setLogged(true);
    }

    /* Subscribe to login event and add before unload for socket and RTC connections*/
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

    return <div className="App"> {logged ? <>
        <>
            <div className='App-body'>
                <div className={'video-grid-container'}>
                    <VideoGrid/>
                </div>
                <div className={'info-chat-container'}>
                    <UserList/>
                    <Chat/>
                </div>
            </div>
        </>
    </> : <Login/>}
    </div>;
}

export default App;
