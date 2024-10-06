import { TypographyP } from "./ui/typo/TypographyP";
import usePostureStore from "@/stores/postureStore";

const Posture = () => {
	const posture = usePostureStore((state) => state.posture);

	return (
		<div className='absolute z-30 flex gap-4 top-4 left-4'>
			<svg
				className='size-12'
				viewBox='0 0 202 163'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<g id='posture'>
					<path
						id='head'
						d='M143.5 66.5C143.5 83.3932 138.342 98.3999 130.361 109.015C122.381 119.628 111.925 125.5 101 125.5C90.0747 125.5 79.6186 119.628 71.6392 109.015C63.6577 98.3999 58.5 83.3932 58.5 66.5C58.5 49.6068 63.6577 34.6001 71.6392 23.9846C79.6186 13.3721 90.0747 7.5 101 7.5C111.925 7.5 122.381 13.3721 130.361 23.9846C138.342 34.6001 143.5 49.6068 143.5 66.5Z'
						stroke={posture[1] ? "black" : "red"}
						stroke-width='15'
						className={
							"origin-bottom " + (posture[1] ? "" : "-rotate-12")
						}
					/>
					<rect
						id='shoulders'
						y='148'
						width='202'
						height='15'
						fill={posture[0] ? "black" : "red"}
						className={
							"origin-center " + (posture[0] ? "" : "-rotate-12")
						}
					/>
				</g>
			</svg>
			<div className='text-red-500'>
				{!posture[1] && <TypographyP>Straighten Your Head</TypographyP>}
				{!posture[0] && (
					<TypographyP>Re-Align your Shoudlers</TypographyP>
				)}
			</div>
		</div>
	);
};

export default Posture;
