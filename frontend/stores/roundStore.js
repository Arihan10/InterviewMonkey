import { create } from "zustand";

const useRoundStore = create((set) => ({
	rounds: [],
	setRounds: (rounds) => set({ rounds }),
}));
