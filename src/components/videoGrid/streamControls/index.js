import React, {useState} from 'react';
import camera_icon from './assets/camera.svg';
import microphone_icon from './assets/microphone.svg';
import './style.css';
import {media_instance} from "../../../storage/mediaStreams";

export default function StreamControls() {
    /* Vars to change style of video and mice icons */
    const [video, setVideo] = useState(media_instance.getState(media_instance.localId, 'video').enabled);
    const [audio, setAudio] = useState(media_instance.getState(media_instance.localId, 'audio').enabled);

    /* Toggle track state for local id (tracks from local user media devices) */
    const toggleCamera = function () {
        setVideo(media_instance.toggleStream(media_instance.localId, 'video').enabled);
    }
    const toggleMic = function () {
        setAudio(media_instance.toggleStream(media_instance.localId, 'audio').enabled);
    }

    return (<div className={'StreamControls'}>
        <div className={'controls-container'}>
            <div style={{backgroundColor: (video ? '#B1D9CD' : '#FDB196')}} className={'round-container'}
                 onClick={toggleCamera}>
                <img src={camera_icon} alt="camera icon"/>
            </div>
            <div style={{backgroundColor: (audio ? '#B1D9CD' : '#FDB196')}} className={'round-container'}
                 onClick={toggleMic}>
                <img src={microphone_icon} alt="microphone icon"/>
            </div>
        </div>
    </div>);
}