"use client";

import { TypographyH2 } from "@/components/ui/typo/TypographyH2";
import useAccentStore from "@/stores/accentStore";
import React from "react";

const Logo = () => {
	const accent = useAccentStore((state) => state.accent);

	return (
		<div className='flex w-screen px-8 py-4'>
			<TypographyH2>
				<span className='leading-5'>
					Interview <br />{" "}
					<span className='font-bold' style={{ color: accent }}>
						Monkey
					</span>
				</span>
			</TypographyH2>
		</div>
	);
};

export default Logo;
