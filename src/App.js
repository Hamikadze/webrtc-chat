import './App.css';
import {useEffect, useState} from "react";
import {webRTC_instance} from "./utils/webRTC";
import Login from './components/login'
import {socket_instance} from "./utils/socket";
import UserList from "./components/usersList";
import VideoGrid from "./components/videoGrid";
import Chat from "./components/chat";
import {user_instance} from "./storage/user";

function App() {
    const [logged, setLogged] = useState(false)

    const onLogged = (data) => {
        user_instance.user = data.data;
        setLogged(true);
    }

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then(stream => user_instance.localStream = stream)
            .catch(error => console.error('Error get user media', error));

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
