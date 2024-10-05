"use client"

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

const Room = () => {
	const { roomId } = useParams();
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [clientId] = useState(uuidv4());  // Generate unique client ID once
	const [socket, setSocket] = useState(null);

	const ran = useRef(false); 
  
	useEffect(() => {
		if (!ran.current) {
			// Establish WebSocket connection to FastAPI
			const socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
			setSocket(socket);

			// Handle incoming messages from the server
			socket.onmessage = (event) => {
				setMessages((prev) => [...prev, event.data]);
			};
			ran.current = true; 
		}
		return () => {
			// Clean up WebSocket connection on component unmount
			if (ran.current && socket) {
				socket.close();
			}
		};
	}, [roomId]);
  
	const handleSendMessage = () => {
	  if (socket) {
		const payload = {
		  clientId: clientId, // Send the client's unique ID with the message
		  message: message
		};
		socket.send(JSON.stringify(payload));  // Send the payload as JSON
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