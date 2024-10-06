import React, { useState } from "react";
import "./Joinroom.css";
import logo from "../../assests/logo2.png";
import {v4 as uuidv4} from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

const Joinroom = () => {
    const[RoomID, setRoomID] = useState("")
    const[Username, setUsername] = useState("")
    const navigate = useNavigate()

    const GenrateRoomID = ()=>{
        const roomID = uuidv4()
        setRoomID(roomID)
        toast.success('Created a new room',{
          position:"top-right"
        })
    }

    const JoinRoom = ()=>{
        if(!RoomID || !Username){
            toast.error('Please enter room id and username',{
              position:"top-right"
            })
            return;
        }

        //redirect
        navigate(`/editor/${RoomID}`,{
            state: {Username,},
        })

        
    }

    const handleInputEnter = (e)=>{
        if(e.code === 'Enter'){
            JoinRoom()
        }
    }

  return (
    <div className="joinRoom">
      <div className="heading">
        <img src={logo} alt="" />
      </div>
      <div className="form_div">
        <input type="text" placeholder="Room ID" value={RoomID} onChange={(e)=>{setRoomID(e.target.value)}} onKeyUp={handleInputEnter} required />
        <input type="text" placeholder="Username" value={Username} onChange={(e)=>{setUsername(e.target.value)}} onKeyUp={handleInputEnter} required />
        <button onClick={JoinRoom} >Join</button>
      </div>
      <p className="new_room">
        Create room code | <span onClick={GenrateRoomID}>New Room ID</span>
      </p>
    </div>
  );
};

export default Joinroom;
