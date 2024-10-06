import { create } from "zustand";

const useRoomStore = create((set) => ({
	room: {
		company: "",
		position: "",
		maxParticipants: 0,
		numQuestions: 0,
		room: "",
		roomId: "",
		user: "",
	},
	setRoom: (room) => set({ room }),
	setCompany: (company) => set({ company }),
	setMaxParticipants: (maxParticipants) => set({ maxParticipants }),
	setNumQuestions: (numQuestions) => set({ numQuestions }),
	setRoomId: (roomId) => set({ roomId }),
	setUser: (user) => set({ user }),
	setRoom: (room) => set({ room }),
	setAllRoomDetails: ({
		company,
		position,
		maxParticipants,
		numQuestions,
		room,
		roomId,
		user,
	}) =>
		set((state) => ({
			room: {
				...state.room,
				company,
				position,
				maxParticipants,
				numQuestions,
				room,
				roomId,
				user,
			},
		})),
}));

export default useRoomStore;
