"use client";
import VideoStream from "@/components/VideoStream";
import Image from "next/image";
import { TypographyH3 } from "@/components/ui/typo/TypographyH3";
import { TypographyH2 } from "@/components/ui/typo/TypographyH2";
import { TypographyP } from "@/components/ui/typo/TypographyP";

import useRoomStore from "@/stores/roomStore";
import useAccentStore from "@/stores/accentStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getCompanyLogo } from "@/lib/utils";

import { QuestionRoundsAccordion } from "@/components/QuestionRoundsAccordion";

const roundsObject = [
	{
		question: "Why do you want to work at shopify?",
		users: [
			{
				userId: 0,
				name: "John Doe",
				rating: 4,
				answer: "I want to work at shopify because it is a great company. They have a great culture and I want to be a part of it. I also love the products they make and I think I can contribute to the company in a positive way.",
			},
			{
				userId: 1,
				name: "Jane Doe",
				rating: 1,
				answer: "I want to work at shopify because it is a great company ",
			},
		],
	},
	{
		question: "What is your favorite color?",
		users: [
			{
				userId: 0,
				name: "John Doe",
				rating: 4,
				answer: "My favorite color is blue.",
			},
			{
				userId: 1,
				name: "Jane Doe",
				rating: 1,
				answer: "My favorite color is red.",
			},
		],
	},
];

const Room = () => {
	const question = ["Why do you want to work at shopify?"];

	const state = useRoomStore();
	const accent = useAccentStore((state) => state.accent);

	const router = useRouter();

	useEffect(() => {
		console.log({
			company: state.room.company,
			maxParticipants: state.room.maxParticipants,
			numQuestions: state.room.numQuestions,
			room: state.room.room,
			roomId: state.room.roomId,
			user: state.room.user,
		});
	}, []);

	return (
		<div className='flex flex-col w-full h-full px-4'>
			<div className='flex items-center gap-8 px-8 py-4'>
				<svg
					onClick={() => router.push("/test")}
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					className='cursor-pointer size-6'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18'
					/>
				</svg>
				<div className='flex items-center justify-center gap-4'>
					<Image
						src={getCompanyLogo(state.room.company)}
						alt='Shopify Logo'
						width={50}
						height={50}
					/>
					<TypographyH2>{state.room.room}</TypographyH2>
				</div>
			</div>
			<div className='flex flex-1 w-full gap-4'>
				<div className='flex flex-col flex-1 h-full gap-4'>
					<div className='relative flex items-center justify-center flex-1 overflow-hidden rounded-md bg-zinc-100'>
						<VideoStream />
					</div>
					<div className='flex items-center justify-center py-6 mb-4 border-2 rounded-xl border-muted'>
						<TypographyH3>{question[0]}</TypographyH3>
					</div>
				</div>
				<div className='w-1/4 h-full px-4 py-4 rounded-md bg-zinc-100'>
					<TypographyH3>
						Room Code:{" "}
						<span className='font-normal'>{state.room.roomId}</span>
					</TypographyH3>
					<TypographyP></TypographyP>
					<QuestionRoundsAccordion roundsObject={roundsObject} />
				</div>
			</div>
		</div>
	);
};

export default Room;
