"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(
	({ className, type, setValue, ...props }, ref) => {
		const [company, setCompany] = useState("");

		const handleChange1 = (e) => {
			setValue(e.target.value);
			setCompany(e.target.value);
		};

		return (
			<div
				className={cn(
					"flex items-center gap-2 h-9 w-full rounded-md border border-input bg-transparent pr-3 pl-2 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
			>
				{(company && (
					<Image
						alt={company + " Logo"}
						width={50}
						height={50}
						className='size-6'
						src={
							"https://img.logo.dev/" +
							company +
							".com?token=pk_dD4gvgScSGCtlxrRTAYRKw"
						}
					/>
				)) || (
					<div className='flex items-center justify-center bg-gray-300 rounded-full size-6'>
						G
					</div>
				)}
				<input
					onChange={handleChange1}
					type={type}
					ref={ref}
					{...props}
				/>
			</div>
		);
	}
);
Input.displayName = "Input";

export { Input };
