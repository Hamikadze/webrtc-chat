import React from 'react';
import './style.css';

export default function VideoBanner() {
    /* reload page to join current room with video and audio */
    const handleCheck = () => {
        window.location.reload();
    }

    return <div className='VideoBanner'>
        <span>This site doesn't have access to your camera or microphone.</span>
        <div className={'banner-info-container'}>
            <span>I gave access to the camera and microphone. Check me again!</span>
            <button onClick={handleCheck}>Check</button>
        </div>
    </div>;
}
