import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

function CardWithForm({ setName, setRoom }) {
	return (
		<Card className='w-[350px] pt-6'>
			<CardContent>
				<form>
					<div className='grid items-center w-full gap-4'>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='name'>Your Name</Label>
							<Input
								id='name'
								placeholder='Arihan Sharma'
								setValue={setName}
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='room'>Room Name</Label>
							<Input
								id='room'
								placeholder='Shopify Room'
								setValue={setRoom}
							/>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

export default CardWithForm;
