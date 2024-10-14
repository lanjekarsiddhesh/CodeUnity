import React, { useEffect, useRef, useState } from 'react';
import './EditorPage.css';
import logo from '../../assests/logo3.png';
import Client from '../Client/Client';
import Editor from '../Editor/Editor';
import toast from 'react-hot-toast';
import { initSocket } from '../../socket';
import ACTIONS from '../../Action';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null)
    const location = useLocation();
    const [clients, setClient] = useState([]);
    const reactNavigator = useNavigate();
    const { roomID } = useParams();

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error');
                toast.error('Socket connection failed, try again!', {
                    position: "top-right",
                });
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomID,
                username: location.state?.username,
            });

            // Listening for join event
            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room`, {
                        position: "top-right",
                    });
                }
                setClient(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId,
                });
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClient((prev) => prev.filter((client) => client.socketId !== socketId));
            });
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            }
        };
    }, [roomID, location.state?.username]);

    if (!location.state) {
        return <Navigate to="/" />;
    }

    const CopyRoomID = async () => {
        try{
            navigator.clipboard.writeText(roomID);
        toast.success("Room ID copied successfully", {
            position: "top-right",
        });
        }
        catch (err){
            toast.error("Could not copy the roomID")
        }
        
    };

    function leaveRoom(){
       reactNavigator('/join-room')

    }



    return (
        <div className='mainwrap'>
            <div className="aside">
                <div className="aside-inner">
                    <div className="logo">
                        <img className='logoimg' src={logo} alt='' />
                    </div>
                    <hr />
                    <h3>Connected</h3>
                    <div className="clientlist">
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>
                </div>
                <button className='btn copubtn' onClick={CopyRoomID}>Copy Room ID</button>
                <button className='btn leavebtn' onClick={leaveRoom}>Leave</button>
                <p className='footer'>Developed By ❤️ Siddhesh</p>
            </div>

            <div className="editorwrap">
                <Editor socketRef={socketRef} roomID={roomID} onCodeChange={(code)=>{codeRef.current=code;
                }} />
            </div>
        </div>
    );
};

export default EditorPage;
