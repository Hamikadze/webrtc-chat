import React, {useEffect, useRef, useState,} from "react";
import './style.css'
import {sendNewMessage} from "../../../utils/socket";

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
    };


    const sendMessage = function () {
        const msg = text.trim();
        if (msg.length === 0)
            return;
        console.log(msg);
        sendNewMessage(msg);

        /*for (let id in webRTC_instance.peers) {
            if (webRTC_instance.peers.hasOwnProperty(id)) {
                if (webRTC_instance.peers[id].channel !== undefined) {
                    try {
                        webRTC_instance.peers[id].channel.send(msg);
                    } catch (e) {
                    }
                }
            }
        }*/

        setText('');
    }

    return (
        <div className={'AutoTextArea'}>
            <div className={'container'}  >
			<textarea className={'auto-textArea'}
                      ref={textAreaRef}
                      rows={1}
                      style={{
                          height: textAreaHeight,
                          flexGrow: 1,
                      }}
                      value={text}
                      onChange={onChangeHandler}
            />
                <button className={'send-button'} onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};
