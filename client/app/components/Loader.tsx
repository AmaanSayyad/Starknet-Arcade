import React from "react";

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="relative w-full min-h-[200px] flex items-center justify-center">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-10 bg-purple-500 rounded-lg animate-bounce ${
              index % 2 === 0 ? "animation-delay-100" : "animation-delay-200"
            }`}
            style={{
              animationDuration: `${0.8 + index * 0.1}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
