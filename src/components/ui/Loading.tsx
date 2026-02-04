export const Loading = () => {
    return (
        <div className="flex items-center justify-center gap-2 h-full">
            <div className="w-3 h-3 bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-indigo-500 animate-bounce"></div>
        </div>
    );
};
