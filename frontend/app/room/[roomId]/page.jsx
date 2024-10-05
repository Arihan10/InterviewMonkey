"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const Room = () => {
	const { roomId } = useParams();
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [clientId] = useState(uuidv4()); // Generate unique client ID once
	const [socket, setSocket] = useState(null);
	const [interviewStarted, setInterviewStarted] = useState(false); 

	const ran = useRef(false);

	useEffect(() => {
		if (!ran.current) {
			// Establish WebSocket connection to FastAPI
			const socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
			setSocket(socket);

			// Handle incoming messages from the server
			socket.onmessage = (event) => {
				console.log(event)

				const data = JSON.parse(event.data); 

				switch (data.type) {
					case 'message': 
						setMessages((prev) => [...prev, `Message: ${data.message}`]); 
						break; 
					case 'rating':
						setMessages((prev) => [...prev, `Rating: ${data.message}`]);
						break;
					case 'event':
						setMessages((prev) => [...prev, `Event: ${data.message}`]);
						setInterviewStarted(true); 
					default: 
						setMessages((prev) => [...prev, `Unhandled Type: ${data.message}`]); 
						break; 
				}
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
  
	const handleSendMessage = (type) => {
	  if (socket) {
		const payload = {
			type: type,
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

		{!interviewStarted && (
			<button onClick={() => handleSendMessage('event')}>Start Interview</button>
		)}

		{interviewStarted && (
			<>
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
				<button onClick={() => handleSendMessage('message')}>Send Message</button>
				<button onClick={() => handleSendMessage('rating')}>Send Rating</button>
			</>
		)}
	  </div>
	);
};
  
export default Room;