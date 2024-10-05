import { create } from "zustand";

import useQuestionSummaryStore from "./questionsStore";
import { use } from "react";

const useRoundStore = create((set) => ({
	rounds: [],
	setRounds: (rounds) => set({ rounds }),
	addRound: (roundIndex) =>
		set((state) => ({
			rounds: [
				{
					question:
						useQuestionSummaryStore.getState().questions[
							roundIndex
						],
					users: [],
				},
				...state.rounds,
			],
		})),
	addUserToRound: (roundIndex, user) =>
		set((state) => {
			const newRounds = [...state.rounds];
			newRounds[roundIndex].users.push(user);
			return { rounds: newRounds };
		}),
}));

export default useRoundStore;
