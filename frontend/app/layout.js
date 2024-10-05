import { Inter } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

import "./globals.css";

export const metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body
				className={`${inter.variable} antialiased h-screen w-screen flex justify-center items-center flex-col`}
			>
				{children}
			</body>
		</html>
	);
}
