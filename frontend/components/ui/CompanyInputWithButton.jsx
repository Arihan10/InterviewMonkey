import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/companyInput";

export function CompanyInputWithButton({ placeholder, type, setValue }) {
	return (
		<div className='flex items-center w-full max-w-sm space-x-2'>
			<Input type={type} placeholder={placeholder} setValue={setValue} />
			{/* <Button type='submit'>{buttonText}</Button> */}
		</div>
	);
}
