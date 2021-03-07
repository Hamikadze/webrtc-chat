import React, {useEffect, useState} from 'react';
import './style.css';
import {socket_instance} from "../../utils/socket";
import {user_instance} from "../../storage/user";

export default function Login() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [connected, setConnected] = useState('');

    /* Track socket connection status and auth errors (duplicate/empty/unallowed logins) */
    useEffect(() => {
        socket_instance.addEventListener('error', onError);
        socket_instance.addEventListener('connectionChange', onConnectionChange);
        return () => {
            socket_instance.removeEventListener('error', onError);
            socket_instance.removeEventListener('connectionChange', onConnectionChange);
        };
    }, []);

    const onError = function (error) {
        switch (error.type) {
            case 'addUser':
                setError(error.error);
                break;
        }
    }

    /* Track enter press to imitate button press */
    const onKeyDown = function (event){
        if (event.keyCode === 13) {
            handlerOnClick();
        }
    }

    const onConnectionChange = function (data) {
        setConnected(data);
    }

    const handlerOnUsernameInput = function (event) {
        setUsername(event.target.value);
    }

    /* send username to socket to check and get {user ID, validated username, room ID}*/
    const handlerOnClick = function (value) {
        socket_instance.connect({user: username, room: user_instance.user.room});
    }

    return <div className={'Login'}>
        <div className={'login-container'}>
            <div className={'login-info-container'}>
                <label htmlFor="uname"><b>Username</b></label>
                <label className="info-connected" style={{color: connected ? '#B1D9CD' : '#FDB196'}}><b>{connected ? 'Connected' : 'Disconnected'}</b></label>
            </div>
            <input type="text"
                   placeholder="Enter Username"
                   onChange={handlerOnUsernameInput}
                   onKeyDown={onKeyDown}
                   required/>
            <div className={'login-error'}>{error}</div>
            <button type="submit" onClick={handlerOnClick}>Login</button>
        </div>
    </div>
}