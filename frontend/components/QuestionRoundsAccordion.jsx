import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { TypographyP } from "./ui/typo/TypographyP";

import Rating from "@/components/Rating";
import { RoundDialog } from "@/components/RoundDialog";
import useRoundStore from "@/stores/roundStore";

export function QuestionRoundsAccordion() {
	const { rounds: roundsObject } = useRoundStore();
	return (
		<Accordion type='single' collapsible className='w-full'>
			{roundsObject.map((round, index) => (
				<AccordionItem key={index} value={`item-${index}`} className={!round.users.length && "hidden"}>
					<AccordionTrigger>
						<div className='flex'>
							<span className='w-5'>
								{index + 1}
								{" | "}
							</span>
							{round?.question?.length > 50
								? round.question.substring(0, 50) + "..."
								: round.question}
						</div>
					</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						{round.users.map((user) => (
							<div
								key={user.userId}
								className='flex flex-col gap-2'
							>
								<TypographyP>
									{user.name + "'s Rating: "}
								</TypographyP>
								<Rating rating={user.rating} />
								<TypographyP>
									<RoundDialog
										round={user}
										question={round.question}
									/>
								</TypographyP>
							</div>
						))}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
