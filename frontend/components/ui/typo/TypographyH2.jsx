export function TypographyH2({ children, ...rest }) {
	return (
		<h2 {...rest} className='text-3xl font-semibold tracking-tight'>
			{children}
		</h2>
	);
}
