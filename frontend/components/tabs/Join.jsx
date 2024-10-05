"use client";

import { Button } from "@/components/ui/button";
import { TypographyH2 } from "../ui/typo/TypographyH2";
import { TypographyH4 } from "../ui/typo/TypographyH4";
import { TypographyP } from "../ui/typo/TypographyP";

import { InputWithButton } from "@/components/ui/inputWithButton";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Create = () => {
	const [roomCode, setRoomCode] = useState("");

	const router = useRouter();

	const handleJoinRoom = () => {
		if (room) {
			router.push(`/room/${roomCode}`);
		}
	};

	return (
		<div className='flex flex-1 w-full'>
			<div className='flex flex-col w-full gap-6'>
				<div>
					<TypographyH2>Join an Interview Room</TypographyH2>
					<TypographyH4>
						Join anyone, test your skills against others
					</TypographyH4>
				</div>
				<form className='flex gap-8' onSubmit={handleJoinRoom}>
					<InputWithButton
						placeholder={"ABCD1234"}
						type={"text"}
						buttonText={"Join Room"}
						disabled={!roomCode}
						setValue={setRoomCode}
					/>
				</form>
			</div>
		</div>
	);
};

export default Create;
