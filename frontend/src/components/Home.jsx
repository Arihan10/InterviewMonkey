import React, { useState } from 'react';
import { useNavigate } from 'react';

const Home = () => {
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const newRoom = Math.random().toString(36).substr(2, 9); // Generate a random room ID
    navigate(`/room/${newRoom}`);
  };

  const handleJoinRoom = () => {
    if (room) {
      navigate(`/room/${room}`);
    }
  };

  return (
    <div>
      <h2>Create or Join a Room</h2>
      <button onClick={handleCreateRoom}>Create Room</button>
      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Enter Room ID"
      />
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default Home;
