import { create } from "zustand";

const useWsStore = create((set) => ({
	ws: null,
	setWs: (ws) => set({ ws }),
}));

export default useWsStore;
