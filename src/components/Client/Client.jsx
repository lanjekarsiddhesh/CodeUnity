import React from 'react'
import './Client.css'
import Avatar from 'react-avatar';

const Client = ({username}) => {
  return (
    <div className="client">
        <Avatar round="10px" size={40} name={username}/>
        <span className='username'>{username}</span>
    </div>
  )
}

export default Client
