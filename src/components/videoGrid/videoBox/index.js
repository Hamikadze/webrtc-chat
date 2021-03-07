import React, {useEffect, useRef} from 'react';
import './style.css';
import {media_instance} from "../../../storage/mediaStreams";

export default function VideoBox({videoId, title, type, onClick}) {
    const videoEl = useRef(null);
    useEffect(() => {
        media_instance.addEventListener(`streamAdded-${videoId}`, onStreamAdded);
        media_instance.addEventListener(`streamToggled-${videoId}`, onStreamToggled);
        if (videoEl !== null) {
            videoEl.current.srcObject = media_instance.getStream(videoId);
            console.log([videoId, media_instance.getStream(videoId), media_instance._streams]);
        }
        return () => {
            media_instance.removeEventListener(`streamAdded-${videoId}`, onStreamAdded);
            media_instance.removeEventListener(`streamToggled-${videoId}`, onStreamToggled);
        }
    }, [])

    const onStreamAdded = function (stream) {
        if (videoEl !== null)
            videoEl.current.srcObject = stream;
    }

    const onStreamToggled = function (stream) {
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