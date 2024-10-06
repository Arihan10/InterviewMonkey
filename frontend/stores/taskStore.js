import { create } from "zustand";

// Zustand store for task management
const useTaskStore = create((set, get) => ({
    tasks: [],
    animationId: null,

    // Add a new task to the list
    addTask: (callback, interval) => {
        const newTask = { callback, interval, lastRun: 0 };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
    },

    // Remove a task
    removeTask: (callback) => {
        set((state) => ({
            tasks: state.tasks.filter((task) => task.callback !== callback),
        }));
    },

    // Start the animation loop if not already running
    startLoop: () => {
        const loop = (currentTime) => {
            const { tasks } = get();

            console.log("current tasks", tasks);

            tasks.forEach((task) => {
                if (currentTime - task.lastRun >= task.interval) {
                    task.callback(currentTime);
                    task.lastRun = currentTime;
                }
            });

            // Continue the loop
            const id = requestAnimationFrame(loop);
            set({ animationId: id });
        };

        // Start only if there's no active animation loop
        if (!get().animationId) {
            const id = requestAnimationFrame(loop);
            set({ animationId: id });
        }
    },

    // Stop the animation loop
    stopLoop: () => {
        const { animationId } = get();
        if (animationId) {
            cancelAnimationFrame(animationId);
            set({ animationId: null });
        }
    },
}));

export default useTaskStore;