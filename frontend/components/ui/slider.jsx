"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

import useAccentStore from "@/stores/accentStore";

const Slider = React.forwardRef(({ className, setValue, ...props }, ref) => {
	const accent = useAccentStore((state) => state.accent);
	return (
		<SliderPrimitive.Root
			ref={ref}
			className={cn(
				"relative flex w-full touch-none select-none items-center",
				className
			)}
			onValueChange={(value) => setValue(value[0])}
			{...props}
		>
			<SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20'>
				<SliderPrimitive.Range
					className='absolute h-full'
					style={{ backgroundColor: accent }}
				/>
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb className='block w-4 h-4 transition-colors border rounded-full shadow border-primary/50 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50' />
		</SliderPrimitive.Root>
	);
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
