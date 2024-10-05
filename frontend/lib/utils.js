import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function getMostCommonColor(imageUrl) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "Anonymous"; // Handle cross-origin images

		img.src = imageUrl;

		img.onload = function () {
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");

			canvas.width = img.width;
			canvas.height = img.height;
			context.drawImage(img, 0, 0, canvas.width, canvas.height);

			const imageData = context.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			).data;
			const colorCount = {};
			const whiteThreshold = 240; // Threshold to filter out colors close to white

			// Loop through pixel data and count colors
			for (let i = 0; i < imageData.length; i += 4) {
				const r = imageData[i];
				const g = imageData[i + 1];
				const b = imageData[i + 2];

				// Ignore white and very light colors
				if (
					r > whiteThreshold &&
					g > whiteThreshold &&
					b > whiteThreshold
				) {
					continue;
				}

				const color = `rgb(${r}, ${g}, ${b})`;

				if (colorCount[color]) {
					colorCount[color]++;
				} else {
					colorCount[color] = 1;
				}
			}

			// Find the most common color
			let mostCommonColor = null;
			let maxCount = 0;

			for (const color in colorCount) {
				if (colorCount[color] > maxCount) {
					mostCommonColor = color;
					maxCount = colorCount[color];
				}
			}

			resolve(mostCommonColor); // Resolve with the most common color
		};
	});
}
