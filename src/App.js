import './App.css';
import {useEffect, useState} from "react";
import {onBeforeUnload, webRTC_instance} from "./utils/webRTC";
import room from "./ids/room";
import user from "./ids/user";
import Index from './components/login'
import AutoTextArea from "./components/chat/chatInput";
import ChatHistory from "./components/chat/chatHistory";

function App() {
    const [roomID, setRoomID] = useState('');
    const [userID, setUserID] = useState('');
    const [connectionNum, setConnectionNum] = useState(0);
    const [logged, setLogged] = useState(false)

    const onConnectionsChange = (event) => {
        setConnectionNum(event.count);
    }

    const onLogged = (event) => {
        console.log(logged);
        setLogged(true);
    }

    useEffect(() => {
        user.addEventListener('logged', onLogged);
        if (!logged)
            return;
        webRTC_instance.addEventListener('connectionsChange', onConnectionsChange);
        setUserID(user.id);
        setRoomID(room.id);
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => {
            user.removeEventListener('logged', onLogged);
            webRTC_instance.removeEventListener('connectionsChange', onConnectionsChange);
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
    }, [logged]);

    const element =
        <div className="App"> {logged ? <>
            <>
                <header className="App-header">
                </header>
                <div className='App-body'>
                    <div>User ID: <span id="user_id">{userID}</span> peers</div>
                    <div>Connected to <span id="connection_num">{connectionNum}</span> peers</div>
                    <ChatHistory/>
                    <AutoTextArea/>
                    <div id="room_link"><a href={`#${roomID}`}>Link to the room</a></div>
                </div>
            </>
        </> : <Index/>}
        </div>;
    return element;
}

export default App;
