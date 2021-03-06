import React, {useEffect, useRef, useState} from 'react';
import './style.css';
import {webRTC_instance} from "../../../utils/webRTC";

export default function VideoBox({videoId, title, type, onClick}) {
    const videoEl = useRef(null);
    useEffect(() => {
        webRTC_instance.addEventListener(`streamAdded-${videoId}`, handleStream);
        if (videoEl !== null)
            videoEl.current.srcObject = webRTC_instance.getStream(videoId);
        return () => {
            webRTC_instance.addEventListener(`streamAdded-${videoId}`, handleStream);
        }
    }, [])

    const handleStream = function (stream) {
        if (videoEl !== null)
            videoEl.current.srcObject = stream;
    }

    const handleClick = function (event) {
        onClick(event);
    }

    return (<article key={`article-${videoId}`} className="video-listing">
        <div onClick={handleClick}
             id={`title-${videoId}`}
             className="video-title">{title}</div>
        <div className="video-container">
            <video ref={videoEl} autoPlay muted={type === 'local'} className={`${type}-video`}
                   id={`video-${videoId}`}/>
        </div>
    </article>);
}