"use client";

import { useEffect, useRef } from "react";

const VideoStream = () => {
	const videoRef = useRef(null);

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
	}, []);

	const sendFrameToBackend = () => {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		canvas.width = videoRef.current.videoWidth;
		canvas.height = videoRef.current.videoHeight;
		context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

		// Convert the frame to a data URL or blob for transmission
		const frameData = canvas.toDataURL("image/jpeg"); // You can also use a blob for better performance
		sendFrameToBackend(frameData);
	};

	return (
		<div className='absolute w-full'>
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
