import React, {useState} from 'react';
import camera_icon from './assets/camera.svg';
import microphone_icon from './assets/microphone.svg';
import './style.css';
import {user_instance} from "../../../storage/user";

export default function StreamControls() {
    const [video, setVideo] = useState(user_instance.localStream.getVideoTracks()[0].enabled);
    const [audio, setAudio] = useState(user_instance.localStream.getVideoTracks()[0].enabled);
    const videoTrack = user_instance.localStream.getVideoTracks()[0];
    const audioTrack = user_instance.localStream.getAudioTracks()[0];

    const toggleCamera = function () {
        videoTrack.enabled = !videoTrack.enabled;
        setVideo(videoTrack.enabled)
    }

    const toggleMic = function () {
        audioTrack.enabled = !audioTrack.enabled;
        setAudio(audioTrack.enabled);
    }

    return (<div className={'StreamControls'}>
        <div className={'controls-container'}>
            <div style={{backgroundColor: (video ? '#B1D9CD' : '#FDB196')}} className={'round-container'} onClick={toggleCamera}>
                <img src={camera_icon} alt="camera icon" />
            </div>
            <div style={{backgroundColor: (audio ? '#B1D9CD' : '#FDB196')}} className={'round-container'} onClick={toggleMic}>
                <img src={microphone_icon} alt="microphone icon"/>
            </div>
        </div>
    </div>);
}