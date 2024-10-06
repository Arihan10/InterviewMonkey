"use client";

import { TypographyH2 } from "../ui/typo/TypographyH2";
import { TypographyH4 } from "../ui/typo/TypographyH4";

import { InputWithButton } from "@/components/ui/inputWithButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import useRoomStore from "@/stores/roomStore";

const Create = () => {
	const [roomCode, setRoomCode] = useState("");
	const [name, setName] = useState("");

	const router = useRouter();

	const { setRoom } = useRoomStore();

	const handleJoinRoom = (e) => {
		e.preventDefault();
		if (roomCode != "") {
			setRoom(roomCode);
			router.push(`/room/room/${roomCode}?mode=join`);
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
				<form className='flex flex-col gap-8' onSubmit={handleJoinRoom}>
					<div className='space-y-2'>
						<Label
							htmlFor='name'
							className='px-2 whitespace-nowrap'
						>
							Your name
						</Label>
						<div className='flex items-center w-full max-w-sm space-x-2'>
							<Input
								id='name'
								placeholder={"Minglun Shao"}
								type={"text"}
								setValue={setName}
							/>
						</div>
					</div>
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
