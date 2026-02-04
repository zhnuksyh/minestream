export const Loading = () => {
    return (
        <div className="flex items-center gap-1 h-5">
            <div className="w-1 h-3 bg-indigo-400 rounded-full animate-[bounce_0.8s_infinite] delay-0"></div>
            <div className="w-1 h-5 bg-indigo-400 rounded-full animate-[bounce_0.8s_infinite] delay-100"></div>
            <div className="w-1 h-3 bg-indigo-400 rounded-full animate-[bounce_0.8s_infinite] delay-200"></div>
            <div className="w-1 h-4 bg-indigo-400 rounded-full animate-[bounce_0.8s_infinite] delay-300"></div>
        </div>
    );
};
