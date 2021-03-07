import React, {useEffect, useState} from 'react';
import './style.css';
import {socket_instance} from "../../utils/socket";

export default function UserList() {
    const [usersList, setUsersList] = useState([]);

    /* track getting new users list of users from socket */
    useEffect(() => {
        socket_instance.addEventListener('usersChange', onUsersChange);
        return () => {
            socket_instance.removeEventListener('usersChange', onUsersChange);
        };
    }, []);

    const onUsersChange = (data) => {
        setUsersList([...data]);
    }

    return <div className={'UsersList'}>
        <div className={'users-list-container'}>
            <ol className={"users-list"}>
                {usersList.map(value =>
                    <li key={value.id} className={'list-item'}>
                        <div className={'user-item-gradient'}/>
                        <div className={'user-item-content'}>
                            <h4>{`${value.name}`}</h4>
                        </div>
                    </li>
                )}
            </ol>
        </div>
    </div>
}