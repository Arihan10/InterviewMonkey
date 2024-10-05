import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InputWithButton({
	placeholder,
	type,
	setValue,
	disabled,
	buttonText,
}) {
	return (
		<div className='flex items-center w-full max-w-sm space-x-2'>
			<Input type={type} placeholder={placeholder} setValue={setValue} />
			<Button disabled={disabled} type='submit'>
				{buttonText}
			</Button>
		</div>
	);
}
