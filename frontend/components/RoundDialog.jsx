import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Rating from "@/components/Rating";

export function RoundDialog({ index, round, question }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline'>View Round Answer</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>{round.name + "'s Answer"}</DialogTitle>
				</DialogHeader>
				<div>
					<Label>Question</Label>
					<DialogDescription>{question}</DialogDescription>
					<Label>Answer</Label>
					<DialogDescription>{round.answer}</DialogDescription>
					<Label>Rating</Label>
					<Rating rating={round.rating} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
