import { create } from "zustand";

const usePostureStore = create((set) => ({
	posture: [false, false], //0: head tilt, 1: shoulder alignment
	setPosture: (posture) => set({ posture }),
	setHeadTilt: (headTilt) =>
		set((state) => ({
			posture: [headTilt, state.posture[1]],
		})),
	setShoulderAlignment: (shoulderAlignment) =>
		set((state) => ({
			posture: [state.posture[0], shoulderAlignment],
		})),
}));

export default usePostureStore;
