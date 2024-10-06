"use client";

import { useState, useRef, useEffect } from "react";
import VideoStream from "@/components/VideoStream";
import Image from "next/image";
import { TypographyH3 } from "@/components/ui/typo/TypographyH3";
import { TypographyH2 } from "@/components/ui/typo/TypographyH2";
import useRoomStore from "@/stores/roomStore";
import useAccentStore from "@/stores/accentStore";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { getCompanyLogo } from "@/lib/utils";
import { QuestionRoundsAccordion } from "@/components/QuestionRoundsAccordion";
import { Button } from "@/components/ui/button";
import useQuestionSummaryStore from "@/stores/questionsStore";
import useRoundStore from "@/stores/roundStore";
import { useInterval } from "@/lib/useInterval";
import { v4 as uuidv4 } from "uuid";
import useWsStore from "@/stores/wsStore";
import usePostureStore from "@/stores/postureStore";

import Posture from "@/components/Posture";
import { set } from "zod";

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

const roundTime = 5; // 60 seconds for question round
const breakTime = 3; // 30 seconds for break

const Room = () => {
	const { roomId } = useParams();
	const searchParams = useSearchParams();
	const [roomStarted, setRoomStarted] = useState(false);
	const [currentRound, setCurrentRound] = useState(-1);
	const [timeRemaining, setTimeRemaining] = useState(roundTime); // 60 seconds for question round
	const [isBreak, setIsBreak] = useState(false); // Tracks if it's break time
	const [clientId] = useState(uuidv4());
	// const [socket, setSocket] = useState(null);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const { ws: socket, setWs: setSocket } = useWsStore();
	const [interviewStarted, setInterviewStarted] = useState(false);

	const advanced = useRef(false);

	//   const state = useRoomStore();
	const router = useRouter();

	const { setQuestions, setSummary, questions, summary } =
		useQuestionSummaryStore();
	const accent = useAccentStore((state) => state.accent);
	const { addRound, addUserToRound, rounds, setRounds } = useRoundStore();
	const { room } = useRoomStore();
	const { posture, setPosture } = usePostureStore();
	const [cumSum, setCumSum] = useState(0);

	const handleNextRound = () => {
		setCurrentRound(currentRound + 1);
		addRound(currentRound + 1);
	};

	const isSetting = useRef(false);

	const ran = useRef(false);

	const mode = searchParams.get("mode");

	useEffect(() => {
		console.log("RUNNING!!!");
		if (!ran.current) {
			// Establish WebSocket connection to FastAPI
			console.log("NOT RAN.CURRENT");

			const socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
			console.log("Wtf??? socket", socket);
			setSocket(socket);

			// Handle incoming messages from the server
			socket.onmessage = (event) => {
				// console.log(event);

				const data = JSON.parse(event.data);
				if (data.includes("Posture")) {
					//please partse "Posture true true" into an array
					const result = data
						.split(" ")
						.filter((word) => word === "True" || word === "False")
						.map((word) => word === "True");

					console.log(result);

					if (result[0] && result[1]) {
						console.log("Posture is good");
						setCumSum((prev) => prev - 1);
					} else {
						console.log("Posture is bad");
						setCumSum((prev) => prev + 3);
					}

					if (result != posture) {
						setPosture(result);
					}
				}

				switch (data.type) {
					case "message":
						setMessages((prev) => [
							...prev,
							`Message: ${data.message}`,
						]);
						break;
					case "rating":
						setMessages((prev) => [
							...prev,
							`Rating: ${data.message}`,
						]);
						break;
					case "event":
						setMessages((prev) => [
							...prev,
							`Event: ${data.message}`,
						]);
						setInterviewStarted(true);
					default:
						setMessages((prev) => [
							...prev,
							`Unhandled Type: ${data.message}`,
						]);
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
				client_id: clientId, // Send the client's unique ID with the message
				message: message,
			};
			socket.send(JSON.stringify(payload)); // Send the payload as JSON
			setMessage(""); // Clear the message input after sending
		}
	};

	const handleBreak = async (newIsBreak) => {
		if (isSetting && isSetting.current) return;
		isSetting.current = true;
		setIsBreak(newIsBreak);
		if (newIsBreak) {
			advanced.current = false;
			// TODO:send to backend to rate
			// HERE
			// HERE
			// HERE
			const res = await fetch("http://localhost:8000/grade", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					summary: summary,
					company: room.company,
					position: room.position,
					question: questions[currentRound],
					response: `My dad owns ${room.company}`,
				}),
			});
			const body = await res.json();

			const rating = body.score / 20;
			// TODO: FIX STARS, ADD FEEDBACK
			// HERE
			// HERE
			// HERE

			if (currentRound + 1 >= questions.length && roomStarted) {
				endRoom();
			}

			console.log("HANDLING BREAK AND ADDING USER TO ROUND!!!");

			addUserToRound(currentRound, {
				userId: 0,
				name: room.user,
				rating: rating,
				answer: `My dad owns ${room.company}`,
			});
		}
	};

	const endRoom = () => {
		setRoomStarted(false);
		setCurrentRound(-1);
		setIsBreak(false);
		setTimeRemaining(roundTime);
		console.log("Room ended. Rounds:", rounds);
	};

	// Timer useEffect to handle question and break intervals
	useInterval(
		() => {
			isSetting.current = false;
			setTimeRemaining((prev) => {
				if (prev === 1) {
					const newIsBreak = !isBreak;
					console.log("calling handle break");
					handleBreak(newIsBreak);

					if (!newIsBreak && !advanced.current) {
						advanced.current = true;
						handleNextRound();
					}

					// Pseudo-ping to backend when round/break changes
					//TODO: PING BACKEND OUT UPDATE

					return newIsBreak ? breakTime : roundTime;
				}
				return prev - 1;
			});
		},
		1000,
		roomStarted,
		[roomStarted, isBreak, currentRound]
	);

	const handleRoomStart = async () => {
		console.log(
			JSON.stringify({
				company: room.company,
				position: room.position,
				n: room.numQuestions,
			})
		);

		const res = await fetch("http://localhost:8000/questions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				company: room.company,
				position: room.position,
				n: room.numQuestions,
			}),
		});
		const body = await res.json();

		setQuestions(body.questions);
		setSummary(body.summary);

		setRoomStarted(true);
		setRounds([]);
		setCurrentRound(0);
		addRound(0);
	};

	if (mode == "join" && !roomStarted) {
		return (
			<div className='relative flex flex-col items-center justify-center w-screen h-screen'>
				<div className='relative w-1/2 -translate-y-20 h-96'>
					<VideoStream />
				</div>
				<div>
					<TypographyH2>Waiting for room to start...</TypographyH2>
					<TypographyP>Room Code: {room.room}</TypographyP>
				</div>
			</div>
		);
	}

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
						src={getCompanyLogo(room.company)}
						alt='Shopify Logo'
						width={50}
						height={50}
					/>
					<TypographyH2>{room.room}</TypographyH2>
				</div>
			</div>
			<div className='flex flex-1 w-full gap-4'>
				<div className='flex flex-col flex-1 h-full gap-4'>
					<div className='relative flex items-center justify-center flex-1 overflow-hidden rounded-md bg-zinc-100'>
						<Posture cumSum={cumSum} />
						<VideoStream />
						<div
							className='absolute flex items-center justify-center rounded-full size-16 bottom-2 right-2'
							style={{ backgroundColor: accent }}
						>
							<TypographyH2 className='text-white'>
								{timeRemaining}
							</TypographyH2>
						</div>
					</div>

					<div className='flex items-center justify-center py-6 mb-4 border-2 rounded-xl border-muted'>
						<TypographyH3>
							{isBreak
								? "Break Time"
								: questions[currentRound] ||
								  "No more questions"}
						</TypographyH3>
					</div>
				</div>

				<div className='w-1/4 h-full px-4 py-4 rounded-md bg-zinc-100'>
					{roomStarted ? (
						<>
							<TypographyH3>
								Room Code:{" "}
								<span className='font-normal'>{room.room}</span>
							</TypographyH3>
							<QuestionRoundsAccordion />
						</>
					) : (
						<div className='space-y-4'>
							<TypographyH3>Start Room</TypographyH3>
							{questions.length > 0 && (
								<Button onClick={handleRoomStart}>
									Start Room
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Room;
