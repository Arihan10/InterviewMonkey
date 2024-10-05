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

export function getCompanyLogo(company) {
	return `https://img.logo.dev/${company}.com?token=pk_dD4gvgScSGCtlxrRTAYRKw`;
}

export const isTooDarkForBlackText = (rgbString) => {
	// Extract the RGB values from the string
	const rgbValues = rgbString.match(/\d+/g)?.map(Number);
	if (!rgbValues || rgbValues.length !== 3) {
		throw new Error("Invalid RGB string format");
	}

	const [r, g, b] = rgbValues;

	// Helper function to convert RGB to sRGB
	const getSRGB = (c) => {
		const normalized = c / 255;
		return normalized <= 0.03928
			? normalized / 12.92
			: Math.pow((normalized + 0.055) / 1.055, 2.4);
	};

	// Calculate the relative luminance
	const luminance =
		0.2126 * getSRGB(r) + 0.7152 * getSRGB(g) + 0.0722 * getSRGB(b);

	// Return true if luminance is below the threshold (too dark for black text)
	return luminance < 0.179;
};
