import { create } from "zustand";

import useQuestionSummaryStore from "./questionsStore";

const useRoundStore = create((set) => ({
	rounds: [],
	setRounds: (rounds) => set({ rounds }),
	addRound: (roundIndex) =>
		set((state) => ({
			rounds: [
				...state.rounds,
				{
					question:
						useQuestionSummaryStore.getState().questions[
							roundIndex
						],
					users: [],
				},
			],
		})),
	addUserToRound: (roundIndex, user) =>
		set((state) => {
			// console.log("Adding index", roundIndex, user);
			const newRounds = [...state.rounds];
			// newRounds[roundIndex].users.push(user);
			newRounds[roundIndex] = {
				...newRounds[roundIndex],
				users: [
					...newRounds[roundIndex]?.users,
					user
				]
			};
			// console.log("New round", newRounds);
			return { rounds: newRounds };
		}),
}));

export default useRoundStore;
