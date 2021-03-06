import './style.css';
import React, {useEffect, useRef, useState} from "react";
import {socket_instance} from "../../utils/socket";
import {user_instance} from "../../storage/user";
import VideoBox from "./videoBox/index";
import StreamControls from "./streamControls";

export default function VideoGrid() {
    const [usersList, setUsersList] = useState([]);
    const selectedVideo = useRef(null);

    useEffect(() => {
        socket_instance.addEventListener('usersChange', onUsersChange);
        return () => {
            socket_instance.removeEventListener('usersChange', onUsersChange);
        };
    }, []);

    const onUsersChange = (data) => {
        setUsersList(data);
    }

    const handleClick = (event) => {
        selectedVideo.current.srcObject = document.getElementById(`video-${event.target.id.substr(6)}`).srcObject;
    }

    return <div className={'VideoGrid'}>
        <div className={"video-row-container"}>

            <VideoBox title={user_instance.user.name}
                      videoId={user_instance.user.id} onClick={handleClick}
                      type={'local'}/>
            {
                usersList.filter(user => user.id !== user_instance.user.id).map(user =>
                    <VideoBox title={user.name}
                              videoId={user.id} onClick={handleClick}
                              type={'remote'}/>
                )
            }

        </div>
        <div className={'selected-video-container'}>
            <video ref={selectedVideo} autoPlay muted className="selected-video" id="selected-video"/>
        </div>
        <div className={'stream-controls-container'}>
            <StreamControls/>
        </div>
    </div>;
}