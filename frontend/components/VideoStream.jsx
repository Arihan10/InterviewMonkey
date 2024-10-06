"use client";

import { useEffect, useRef } from "react";
import useWsStore from "../stores/wsStore";

const VideoStream = () => {
	const videoRef = useRef(null);
	const recognitionRef = useRef(null);
	const { ws } = useWsStore();

	const startSpeechRecognition = () => {
		if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
			console.error("SpeechRecognition is not supported in this browser.");
			return;
		}

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		const recognition = new SpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = "en-US";

		recognition.onstart = () => {
			console.log("Speech recognition started");
		};

		recognition.onresult = (event) => {
			let transcript = '';
			for (let i = event.resultIndex; i < event.results.length; i++) {
				transcript += event.results[i][0].transcript;
			}
			// let transcript = event.results[event.results.length-1][0].transcript
			console.log("Recognized Speech:", transcript, "Length: ", event.results.length);
		};

		recognition.onerror = (event) => {
			console.error("Speech recognition error:", event.error);
		};

		recognition.onend = () => {
			console.log("Speech recognition ended");
		};

		recognition.start();
		recognitionRef.current = recognition;
	};

	useEffect(() => {
		async function startVideo() {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				});
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			} catch (err) {
				console.error("Error accessing the camera: ", err);
			}
		}

		startVideo();
		startSpeechRecognition();

		requestAnimationFrame(sendFrameToBackend);

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
				console.log("Speech recognition stopped");
			}
		};
	}, []);

	const sendFrameToBackend = () => {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		canvas.width = videoRef.current.videoWidth;
		canvas.height = videoRef.current.videoHeight;
		context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
	
		canvas.toBlob((blob) => {
			// console.log("Blob", blob);
			if (!ws) return;
			if (ws.readyState === WebSocket.OPEN) ws.send(blob, { binary: true });
		}, "image/jpeg");
		requestAnimationFrame(sendFrameToBackend);
	};

	return (
		<div className='absolute left-0 w-full'>
			<video
				ref={videoRef}
				autoPlay
				playsInline
				className='w-full h-full'
			></video>
			{/* Optionally, set up an interval or use a button to send frames */}
		</div>
	);
};

export default VideoStream;
