"use client";
import React, { useState } from "react";

interface ControllerButtonProps {
  connected: boolean;
  username?: string;
  handleControllerClick: () => void;
}

const ControllerButton: React.FC<ControllerButtonProps> = ({
  connected,
  username,
  handleControllerClick,
}) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {/* Main Connect/Disconnect Button */}
      <button
        onClick={handleControllerClick}
        className={`fixed left-4 top-4 z-50 px-4 py-2 rounded-lg border-2 font-press-start text-xs transition-all shadow-md
          ${
            connected
              ? "bg-green-500 text-white border-green-700 hover:bg-green-600"
              : "bg-red-500 text-white border-red-700 hover:bg-red-600"
          }
          active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
          hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-sm
        `}
      >
        {connected ? username || "Connected" : "Connect Controller"}
      </button>

      {/* Small "info" button to open the popup */}
      {connected && (
        <button
          onClick={() => setShowPopup(true)}
          className="fixed left-[calc(100px)] top-4 z-50 bg-white border border-gray-300 text-xs px-2 py-1 rounded shadow hover:bg-gray-100 font-mono"
        >
          ℹ️ Status
        </button>
      )}

      {showPopup && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-2xl border-4 border-gray-800">
            <div className="flex items-center justify-between border-b-2 border-gray-300 pb-3 mb-4">
              <h2 className="text-gray-800 font-press-start text-sm">
                Controller Status
              </h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-600 hover:text-black text-lg font-bold leading-none px-2"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-gray-700 font-mono space-y-2">
              <p>
                <strong>Status:</strong>{" "}
                {connected ? "Connected" : "Disconnected"}
              </p>
              {connected && username && (
                <p>
                  <strong>Username:</strong> {username}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ControllerButton;
