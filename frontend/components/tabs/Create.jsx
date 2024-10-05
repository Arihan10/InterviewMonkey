"use client";

import { CompanyInputWithButton } from "@/components/ui/CompanyInputWithButton";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "../ui/typo/TypographyH2";
import { TypographyH4 } from "../ui/typo/TypographyH4";
import { TypographyP } from "../ui/typo/TypographyP";

import CardWithForm from "@/components/tabs/NameCard";
import { Slider } from "@/components/ui/slider";

import { useState, useEffect } from "react";

const Create = () => {
	const [company, setCompany] = useState("");
	const [maxParticipants, setMaxParticipants] = useState(2);
	const [numQuestions, setNumQuestions] = useState(5);
	const [room, setRoom] = useState("");
	const [user, setUser] = useState("");

	// useEffect(() => {
	// 	console.log("Company: ", company);
	// 	console.log("Max Participants: ", maxParticipants);
	// 	console.log("Number of Questions: ", numQuestions);
	// 	console.log("Room: ", room);
	// 	console.log("User: ", user);
	// }, [company, maxParticipants, numQuestions, room, user]);

	return (
		<div className='flex flex-1 w-full'>
			<div className='flex flex-col w-full gap-6'>
				<div>
					<TypographyH2>Create an Interview Room</TypographyH2>
					<TypographyH4>
						Choose any company, test your skills against others
					</TypographyH4>
				</div>
				<div className='flex gap-8'>
					<div className='flex flex-col gap-4'>
						<div>
							<TypographyP>Enter a Company</TypographyP>
							<CompanyInputWithButton
								setValue={setCompany}
								placeholder='Google'
								buttonText={"Search"}
								type={"text"}
							/>
						</div>
						<div className='space-y-2'>
							<TypographyP>Max Participants</TypographyP>
							<Slider
								defaultValue={[2]}
								max={5}
								step={1}
								setValue={setMaxParticipants}
							/>
						</div>
						<div className='space-y-2'>
							<TypographyP># of Questions</TypographyP>
							<Slider
								defaultValue={[5]}
								max={10}
								step={1}
								setValue={setNumQuestions}
							/>
						</div>
					</div>
					<div className='w-full max-w-[20rem]'>
						<div>
							<TypographyP>Room Details</TypographyP>
							<CardWithForm setName={setUser} setRoom={setRoom} />
						</div>
					</div>
				</div>
				<div>
					{numQuestions && (
						<Button
							disabled={
								!(
									company &&
									maxParticipants &&
									numQuestions &&
									room &&
									user
								)
							}
							className='disabled:opacity-40'
						>
							Create Room
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Create;
