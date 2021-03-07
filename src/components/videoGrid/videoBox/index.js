import React, {useEffect, useRef} from 'react';
import './style.css';
import {media_instance} from "../../../storage/mediaStreams";

export default function VideoBox({videoId, title, type, onClick}) {
    const videoEl = useRef(null);

    /* tracks adding or changing video/audio stream from peer in stream array */
    useEffect(() => {
        media_instance.addEventListener(`streamAdded-${videoId}`, onStreamAdded);
        media_instance.addEventListener(`streamToggled-${videoId}`, onStreamToggled);

        const stream = media_instance.getStream(videoId);
        /*
        * if  video element exist and streams array contains tracks for current id
        * adding it to video element
        */
        if (videoEl !== null && stream !== undefined) {
            videoEl.current.srcObject = stream;
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

    /*
    * Tracks click on video and then transfer clicked element to videoGrid
    * for setting to selected video box (big view)
    */
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