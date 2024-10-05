import { create } from "zustand";

const useQuestionSummaryStore = create((set) => ({
	questions: [],
	summary: "",
	setQuestions: (questions) => set({ questions }),
	setSummary: (summary) => set({ summary }),
}));

export default useQuestionSummaryStore;
