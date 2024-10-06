"use client";

import { useState, useRef, useEffect } from "react";
import VideoStream from "@/components/VideoStream";
import Image from "next/image";
import { TypographyH3 } from "@/components/ui/typo/TypographyH3";
import { TypographyH2 } from "@/components/ui/typo/TypographyH2";
import { TypographyP } from "@/components/ui/typo/TypographyP";
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
import { useReactMediaRecorder } from "react-media-recorder";

import Posture from "@/components/Posture";
import { set } from "zod";

const roundTime = 5; // 60 seconds for question round
const breakTime = 3; // 30 seconds for break

async function webmToWav(audioBlob) {
	const audioContext = new AudioContext();

	// Convert Blob to ArrayBuffer for decoding
	const arrayBuffer = await audioBlob.arrayBuffer();

	// Decode WebM data to raw PCM using AudioContext
	const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

	// Encode raw PCM data into WAV format
	return encodeWav(audioBuffer);
}

function encodeWav(audioBuffer) {
	const numOfChannels = audioBuffer.numberOfChannels;
	const sampleRate = audioBuffer.sampleRate;
	const format = 1; // 1 = PCM
	const bitDepth = 16;

	const result = interleaveChannels(audioBuffer, bitDepth);

	const buffer = new ArrayBuffer(44 + result.length * 2); // WAV header + audio data
	const view = new DataView(buffer);

	// WAV file header
	writeString(view, 0, "RIFF");
	view.setUint32(4, 36 + result.length * 2, true);
	writeString(view, 8, "WAVE");
	writeString(view, 12, "fmt ");
	view.setUint32(16, 16, true); // PCM chunk size
	view.setUint16(20, format, true);
	view.setUint16(22, numOfChannels, true);
	view.setUint32(24, sampleRate, true);
	view.setUint32(28, sampleRate * numOfChannels * 2, true); // Byte rate
	view.setUint16(32, numOfChannels * 2, true); // Block align
	view.setUint16(34, bitDepth, true); // Bits per sample
	writeString(view, 36, "data");
	view.setUint32(40, result.length * 2, true);

	// Write interleaved audio data
	let offset = 44;
	for (let i = 0; i < result.length; i++, offset += 2) {
		view.setInt16(offset, result[i], true);
	}

	return new Blob([view], { type: "audio/wav" });
}

function interleaveChannels(audioBuffer, bitDepth) {
	const channelData = [];
	const numOfChannels = audioBuffer.numberOfChannels;

	// Extract channel data from audioBuffer
	for (let channel = 0; channel < numOfChannels; channel++) {
		channelData[channel] = audioBuffer.getChannelData(channel);
	}

	const length = audioBuffer.length;
	const interleaved = new Int16Array(length * numOfChannels);

	for (let sampleIndex = 0; sampleIndex < length; sampleIndex++) {
		for (let channel = 0; channel < numOfChannels; channel++) {
			interleaved[sampleIndex * numOfChannels + channel] =
				Math.max(-1, Math.min(1, channelData[channel][sampleIndex])) *
				0x7fff;
		}
	}

	return interleaved;
}

function writeString(view, offset, string) {
	for (let i = 0; i < string.length; i++) {
		view.setUint8(offset + i, string.charCodeAt(i));
	}
}

const Room = () => {
	const { roomId } = useParams();
	const searchParams = useSearchParams();
	const [roomStarted, setRoomStarted] = useState(false);
	const [currentRound, setCurrentRound] = useState(-1);
	const [timeRemaining, setTimeRemaining] = useState(roundTime); // 60 seconds for question round
	const [isBreak, setIsBreak] = useState(false); // Tracks if it's break time
	const [clientId] = useState(uuidv4());
	// const [socket, setSocket] = useState(null);
	const [messages, setMessages] = useState([]);
	//const { ws: socket, setWs: setSocket } = useWsStore(); // remove? arihan
	const [interviewStarted, setInterviewStarted] = useState(false);
	const [socket, setSocket] = useState(null);

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
		startRecording();
	};

	const isSetting = useRef(false);

	const ran = useRef(false);

	const mode = searchParams.get("mode");

	const { startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
		useReactMediaRecorder({
			video: false,
			audio: true,
			echoCancellation: true,
			mediaRecorderOptions: { mimeType: "audio/wav" },
		});

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
				// if (data.includes("Posture")) {
				// 	//please partse "Posture true true" into an array
				// 	const result = data
				// 		.split(" ")
				// 		.filter((word) => word === "True" || word === "False")
				// 		.map((word) => word === "True");

				// 	console.log(result);

				// 	if (result[0] && result[1]) {
				// 		console.log("Posture is good");
				// 		if (cumSum > 0) setCumSum((prev) => prev - 1);
				// 	} else {
				// 		console.log("Posture is bad");

				// 		if (cumSum < 100) setCumSum((prev) => prev + 3);
				// 	}

				// 	if (result != posture) {
				// 		setPosture(result);
				// 	}
				// }

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

						console.log("EVENT RECEIVED!")

						if (summary != "") break; 
			
						console.log(data.message)
			
						// body = JSON.parse(data.message)
            const body = data.message
			
						setQuestions(body["questions"])
						setSummary(body["summary"])
			
						handleInterviewStart(); 

						break; 
          case "answer": 
            const ansBody = data.message

            if (clientId != ansBody["client_id"]) {
              console.log("GETTING OTHER PLAYER'S SHIT!!!!")

              console.log(ansBody)
              console.log(rounds)

              addUserToRound(currentRound - 1, {//this might break things
                userId: ansBody.client_id,
                name: ansBody.name,
                rating: ansBody.score,
                answer: ansBody.feedback,
              });
            }

            break; 
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

	const handleBreak = async (newIsBreak, message) => {
		if (isSetting && isSetting.current) return;
		isSetting.current = true;
		setIsBreak(newIsBreak);
		if (newIsBreak) {
			advanced.current = false;
			// TODO:send to backend to rate
			// HERE
			// HERE
			// HERE
			stopRecording();
		}
	};

	useEffect(() => {
		if (mediaBlobUrl) {
			(async () => {
				const audioBlob = await fetch(mediaBlobUrl).then((r) =>
					r.blob()
				);

				console.log(audioBlob);

				// const audiofile = new File([audioBlob], `test.wav`, { type: "audio/wav" })
				// const url = URL.createObjectURL(audiofile); // Create a URL for the audio file
				// const downloadLink = document.createElement('a'); // Create an anchor element
				// downloadLink.href = url; // Set the href to the created URL
				// downloadLink.download = audiofile.name; // Set the download attribute with the file name
				// document.body.appendChild(downloadLink); // Append the link to the body (not displayed to the user)
				// downloadLink.click(); // Programmatically click the link to trigger the download
				// document.body.removeChild(downloadLink); // Clean up the DOM
				// URL.revokeObjectURL(url);

				const formData = new FormData();
				formData.append("summary", summary);
				formData.append("company", room.company);
				formData.append("position", room.position);
				formData.append("question", questions[currentRound]);
				formData.append("response", audioBlob, "response.wav");
				const res = await fetch("http://localhost:8000/grade", {
					method: "POST",
					body: formData,
				});
				const body = await res.json(); 

        const resBody = {
          "feedback": body.feedback,
          "score": body.score,
          "name": room.user,
          "client_id": clientId,
        }

        console.log(body); 

        handleSendMessage("answer", resBody); 

				const rating = body.score / 20; 

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
			})();
		}

		// Cleanup the blob URL when the component unmounts or the URL changes
		return () => {
			clearBlobUrl();
		};
	}, [mediaBlobUrl]);

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

    console.log("ROOM START CALLED")

		handleSendMessage("event", body)

		setQuestions(body.questions);
		setSummary(body.summary);
		startRecording();
		setRoomStarted(true);
		setRounds([]);
		setCurrentRound(0);
		addRound(0);
	};

  const handleSendMessage = (type, message) => {
	  if (socket) {
      const payload = {
        type: type,
        client_id: clientId, // Send the client's unique ID with the message
        message: message
      };
      console.log("SENDING MF")
		  socket.send(JSON.stringify(payload));  // Send the payload as JSON
	  }
	};

	const handleInterviewStart = async () => {
		setRoomStarted(true);
			setRounds([]);
			setCurrentRound(0);
			addRound(0);
  }

    useInterval(() => {
      console.log("Socket status", socket?.readyState)
    }, 1000, true, [])
	

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
							<Button onClick={handleRoomStart}>
								Start Room
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Room;