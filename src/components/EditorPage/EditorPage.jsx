import React, { useEffect, useRef, useState } from 'react'
import './EditorPage.css'
import logo from '../../assests/logo3.png'
import Client from '../Client/Client'
import Editor from '../Editor/Editor'
import toast from 'react-hot-toast'
import { initSocket } from '../../socket'
import ACTIONS from '../../Action'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

const EditorPage = () => {
    const socketRef = useRef(null)
    const location = useLocation()
    const [clients, setClient] = useState([])
    const reactNvigator = useNavigate()
    const {roomID} = useParams()

    useEffect(()=>{
        const init = async ()=>{
            socketRef.current = await initSocket();

            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('socket connection failed try again !!!');
                reactNvigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN,{
                roomID,
                username: location.state?.username,
            });


            //listing for join event

            socketRef.current.on(ACTIONS.JOINED, ({client, username,socketId})=>{
                if(username !== location.state?.username){
                    toast.success(`${username} joined the room`)
                    console.log(`${username} joined the room`)
                }
                setClient(client)
            })
        }
        init();
    },[])

    console.log(clients)


    if (!location.state){
        return <Navigate to="/"/>
    }
    


    const CopyRoomID = ()=>{
        navigator.clipboard.writeText('1234567890')
        toast.success("Room ID Copied successfully",{
            position:"top-right"
        })
        return;
    }

    
  return (
    <div className='mainwrap'>
        <div className="aside">
            <div className="aside-inner">
                <div className="logo">
                    <img className='logoimg' src={logo} alt='' />
                </div>
                <hr/>
                <h3>Connected</h3>
                <div className="clientlist">
                    {clients.map((client)=>{
                        return <Client key={client.socketId} username={client.username}/>
                    })}
                </div>
            </div>
            <button className='btn copubtn' onClick={CopyRoomID}>Copy Room ID</button>
            <button className='btn leavebtn'>Leave</button>
            <p className='footer'>Developed By ❤️ Siddhesh</p>
        </div>
        
        <div className="editorwrap">
            <Editor/>
        </div>
      
    </div>
  )
}

export default EditorPage
