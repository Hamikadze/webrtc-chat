import React from 'react';
import './style.css';
import ChatHistory from "./chatHistory";
import AutoTextArea from "./chatInput";

export default function Chat() {
    return <div className={'Chat'}>
        <ChatHistory/>
        <AutoTextArea/>
    </div>
}