"use client";

import { useCallback, useEffect, useRef } from "react";
import useWsStore from "../stores/wsStore";
import useTaskStore from "../stores/taskStore";
// import { useAnimationLoop } from "../lib/useAnimationLoop";

const VideoStream = () => {
	const videoRef = useRef(null);
	const { ws } = useWsStore();
	const wsRef = useRef(ws);
	const addTask = useTaskStore((state) => state.addTask);
	const removeTask = useTaskStore((state) => state.removeTask);
	// const { addTask } = useAnimationLoop();
	// const lastRef = useRef(Date.now());

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

		addTask(sendFrameToBackend, 1000 / 5);

		// requestRef.current = requestIdleCallback(sendFrameToBackend);

		return () => removeTask(sendFrameToBackend);

		// return () => {
		// 	cancelIdleCallback(requestRef.current);
		// };
	}, []);

	useEffect(() => {
		console.log("Here's ws", ws, wsRef.current);
		wsRef.current = ws;
	}, [ws, wsRef]);

	// const requestRef = useRef();

	const sendFrameToBackend = () => {
		// if (Date.now() - lastRef.current < 1000 / 2) {
		// 	requestRef.current = requestAnimationFrame(sendFrameToBackend);
		// 	return;
		// }
		// lastRef.current = Date.now();
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		canvas.width = videoRef.current.videoWidth;
		canvas.height = videoRef.current.videoHeight;
		context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

		canvas.toBlob((blob) => {
			// console.log("Blob", blob);
			// console.log("socket", ws);
			// console.log("socket status", ws && ws.readyState)
			// console.log("current socket", wsRef.current);
			if (!wsRef.current) return;
			// console.log("Websocket is present");
			if (wsRef.current.readyState === WebSocket.OPEN) {
				// console.log("SENDING BLOB");
				wsRef.current.send(blob, { binary: true });
			}
		}, "image/jpeg");

		// setTimeout(() => {
		// requestRef.current = requestIdleCallback(sendFrameToBackend);
		// }, 500);
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