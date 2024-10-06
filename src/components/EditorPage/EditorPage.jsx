import React, { useState } from 'react'
import './EditorPage.css'
import logo from '../../assests/logo3.png'
import Client from '../Client/Client'
import Editor from '../Editor/Editor'
import toast from 'react-hot-toast'

const EditorPage = () => {
    const [clients, setClient] = useState([
        { SocketId: 1, Username: 'John Doe'},
        { SocketId: 2, Username: 'Siddhesh'},
        { SocketId: 3, Username: 'John'},
        { SocketId: 4, Username: 'Doe'},
    ])


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
                        return <Client key={client.SocketId} username={client.Username}/>
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
