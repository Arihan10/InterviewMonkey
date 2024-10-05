"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
	const [room, setRoom] = useState("");
	const router = useRouter();

	const handleCreateRoom = () => {
		const newRoom = Math.random().toString(36).substr(2, 9); // Generate a random room ID
		router.push(`/room/${newRoom}`);
	};

	const handleJoinRoom = () => {
		if (room) {
			router.push(`/room/${room}`);
		}
	};

	return (
		<div>
			<h2>Create or Join a Room</h2>
			<button onClick={handleCreateRoom}>Create Room</button>
			<input
				type='text'
				autoComplete="one-time-code"
				value={room}
				onChange={(e) => setRoom(e.target.value)}
				placeholder='Enter Room ID'
			/>
			<button onClick={handleJoinRoom}>Join Room</button>
		</div>
	);
};

export default Home;
