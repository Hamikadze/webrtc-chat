import React, {useEffect, useState} from 'react';
import VideoGrid from "../videoGrid";
import UserList from "../usersList";
import Chat from "../chat";
import './style.css';
import {socket_instance} from "../../utils/socket";
import {media_instance} from "../../storage/mediaStreams";
import {user_instance} from "../../storage/user";
import VideoBanner from "../videoBanner";

export default function MainScreen() {
    const [hasTracks, setHasTracks] = useState(false);

    /*
    * sets local id to media instance (store local and peers streams/tracks)
    */
    useEffect(() => {
        media_instance.localId = user_instance.user.id;
        setHasTracks(media_instance.hasAccess);
    }, []);

    /*
    * Send message to socket about waiting for new requests throw webRTC
    */
    useEffect(() => {
        if (hasTracks)
            socket_instance.sendRTCOverSocket(undefined, 'newPeerReceived', undefined)
    }, [hasTracks]);

    return <div className='MainScreen'>
        <div className={'video-grid-container'}>
            {hasTracks ? <VideoGrid/> :
                <VideoBanner/>}
        </div>
        <div className={'info-chat-container'}>
            <UserList/>
            <Chat/>
        </div>
    </div>;
}
