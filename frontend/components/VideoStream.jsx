"use client";

import { useCallback, useEffect, useRef } from "react";
import useWsStore from "../stores/wsStore";

const VideoStream = () => {
	const videoRef = useRef(null);
	const { ws } = useWsStore();

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

		requestAnimationFrame(sendFrameToBackend);

		return () => {

		};
	}, []);

	useEffect(() => {
		console.log("Here's ws", ws);
	}, [ws]);

	const sendFrameToBackend = useCallback(() => {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		canvas.width = videoRef.current.videoWidth;
		canvas.height = videoRef.current.videoHeight;
		context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
	
		canvas.toBlob((blob) => {
			// console.log("Blob", blob);
			// console.log("socket", ws);
			// console.log("socket status", ws && ws.readyState)
			if (!ws) return;
			// console.log("Websocket is present")
			if (ws.readyState === WebSocket.OPEN) {
				// console.log("SENDING BLOB");
				ws.send(blob, { binary: true });
			}
		}, "image/jpeg");
		requestAnimationFrame(sendFrameToBackend);
	}, [ws]);

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
