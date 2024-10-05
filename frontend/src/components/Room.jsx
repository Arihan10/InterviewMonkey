import React, { useEffect, useState } from 'react';
import { useParams } from 'react';

const Room = () => {
  const { roomId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  let socket;

  useEffect(() => {
    // Establish WebSocket connection to FastAPI
    socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

    // Handle incoming messages from the server
    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (socket) {
      socket.send(message);
      setMessage('');  // Clear the message input after sending
    }
  };

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Room;
