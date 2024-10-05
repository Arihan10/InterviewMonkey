import { create } from "zustand";

const useAccentStore = create((set) => ({
	accent: "rgb(0, 0, 0)",
	setAccent: (accent) => set({ accent }),
}));

export default useAccentStore;
