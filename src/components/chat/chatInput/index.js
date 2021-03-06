import React, {useEffect, useRef, useState,} from "react";
import './style.css'
import {socket_instance} from "../../../utils/socket";

export default function AutoTextArea() {
    const textAreaRef = useRef(null);
    const [text, setText] = useState("");
    const [textAreaHeight, setTextAreaHeight] = useState("auto");

    useEffect(() => {
        setTextAreaHeight(`${textAreaRef.current.scrollHeight + 2}px`);
    }, [text]);

    const onChangeHandler = function (event) {
        setTextAreaHeight("auto");
        setText(event.target.value);
        console.log(text.split('\r\n'));
    };

    const onKeyDown = function (event) {
        if (!event.shiftKey && event.keyCode === 13) {
            sendMessage();
            event.preventDefault();
        }
    }

    const sendMessage = function () {
        const msg = text.trim();
        if (msg.length === 0)
            return;
        socket_instance.sendNewMessage(msg);

        setText('');
        setTextAreaHeight("auto");
    }

    return (
        <div className={'AutoTextArea'}>
            <div className={'text-area-container'}>
			<textarea className={'auto-text-area'}
                      ref={textAreaRef}
                      rows={1}
                      style={{
                          height: textAreaHeight,
                          flexGrow: 1,
                      }}
                      value={text}
                      onChange={onChangeHandler}
                      onKeyDown={onKeyDown}
            />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};
