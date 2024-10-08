"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Logo from "@/components/TheLogo";

import Create from "@/components/tabs/Create";
import Join from "@/components/tabs/Join";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAccentStore from "@/stores/accentStore";

const Home = ({ searchParams }) => {
	// const [room, setRoom] = useState("");
	// const router = useRouter();

	// const handleCreateRoom = () => {
	// 	const newRoom = Math.random().toString(36).substr(2, 9); // Generate a random room ID
	// 	router.push(`/room/${newRoom}`);
	// };

	// const handleJoinRoom = () => {
	// 	if (room) {
	// 		router.push(`/room/${room}`);
	// 	}
	// };
	if (searchParams.code) {
		return <>Balls itch</>
	}

	const accent = useAccentStore((state) => state.accent);

	return (
		<div className='flex flex-col justify-center w-screen h-screen'>
			<Logo />
			<div className='flex items-center justify-center flex-1'>
				<Tabs
					defaultValue='create'
					className='max-w-[50rem] w-full flex flex-col gap-2'
				>
					<TabsList className='flex'>
						<TabsTrigger value='create' className='flex-1'>
							Create Room
						</TabsTrigger>
						<TabsTrigger value='join' className='flex-1'>
							Join Room
						</TabsTrigger>
					</TabsList>
					<div className='px-6 py-6 border-[1px] border-muted shadow-sm rounded-md min-h-[28rem] bg-white'>
						<TabsContent value='create'>
							<Create />
						</TabsContent>
						<TabsContent value='join'>
							<Join />
						</TabsContent>
					</div>
				</Tabs>
			</div>
			<div
				className='fixed z-[-10] w-screen h-screen '
				style={{
					clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
					backgroundColor: accent,
				}}
			></div>
		</div>
	);

	// return (
	// 	<div>
	// 		<h2>Create or Join a Room</h2>
	// 		<button onClick={handleCreateRoom}>Create Room</button>
	// 		<input
	// 			type='text'
	// 			value={room}
	// 			onChange={(e) => setRoom(e.target.value)}
	// 			placeholder='Enter Room ID'
	// 		/>
	// 		<button onClick={handleJoinRoom}>Join Room</button>
	// 	</div>
	// );
};

export default Home;
