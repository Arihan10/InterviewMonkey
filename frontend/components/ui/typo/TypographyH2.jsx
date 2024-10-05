import { cn } from "@/lib/utils";

export function TypographyH2({ children, ...rest }) {
	return (
		<h2 {...rest} className={cn('text-3xl font-semibold tracking-tight', rest.className)}>
			{children}
		</h2>
	);
}
