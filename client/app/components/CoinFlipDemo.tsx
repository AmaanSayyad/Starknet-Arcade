import { useState } from "react";
import { FlipChoice, FlipState } from "../types";
import { useCoinFlip } from "../contexts/CoinFlipContext";
import { convertToStarknetAddress } from "../utils";

export function CoinFlipDemo() {
  // Get context values and functions
  const {
    flipCoin,
    getFlipDetails,
    getContractBalance,
    status,
    error,
    currentFlip,
    setCurrentFlip,
  } = useCoinFlip();

  // Local form state
  const [amount, setAmount] = useState("0.01");
  const [choice, setChoice] = useState<FlipChoice>(FlipChoice.Heads);
  const [tokenAddress, setTokenAddress] = useState("");
  const [requestId, setRequestId] = useState("");
  const [fetchRequestId, setFetchRequestId] = useState("");
  const [contractBalance, setContractBalance] = useState<string | null>(null);
  const [fetchedFlip, setFetchedFlip] = useState<typeof currentFlip>(null);

  // Handle flip coin action
  const handleFlipCoin = async () => {
    try {
      await flipCoin(choice, amount);
    } catch (error) {
      console.error("Error flipping coin:", error);
    }
  };

  // Fetch flip details by request ID
  const fetchFlipDetails = async (id: bigint | string) => {
    try {
      const requestIdBigInt = typeof id === "string" ? BigInt(id) : id;
      const details = await getFlipDetails(requestIdBigInt);
      console.log("Flip details:", details);
      if (details) {
        setCurrentFlip(details);

        // If this is from the lookup section, update the fetched flip state
        if (id.toString() === fetchRequestId) {
          setFetchedFlip(details);
        }
      }
    } catch (error) {
      console.error("Error fetching flip details:", error);
    }
  };

  // Check contract balance
  const checkContractBalance = async () => {
    try {
      if (!tokenAddress) return;
      const balance = await getContractBalance(tokenAddress);
      if (balance !== undefined) {
        setContractBalance(balance.toString());
      }
    } catch (error) {
      console.error("Error checking contract balance:", error);
    }
  };

  // Handle lookup for a specific flip
  const handleFlipLookup = async () => {
    if (!fetchRequestId) return;
    await fetchFlipDetails(fetchRequestId);
  };

  const renderFlipDetails = (flip: typeof currentFlip) => {
    if (!flip) return null;

    return (
      <div className="mt-4 flex flex-col gap-2 p-3 bg-gray-800 rounded-lg">
        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span className="text-white">
            {flip.state === FlipState.Idle
              ? "Idle"
              : flip.state === FlipState.Flipping
              ? "Flipping..."
              : "Complete"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Your Choice:</span>
          <span className="text-white">
            {flip.choice.variant.Heads ? "Heads" : "Tails"}
          </span>
        </div>

        {flip.result !== null && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400">Result:</span>
              <span className="text-white">
                {flip.result.Some.variant.Heads ? "Heads" : "Tails"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Outcome:</span>
              <span
                className={
                  flip.choice === flip.result
                    ? "text-green-500 font-bold"
                    : "text-red-500 font-bold"
                }
              >
                {flip.choice === flip.result ? "Win! 🎉" : "Loss 😢"}
              </span>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <span className="text-gray-400">Player:</span>
          <span className="text-white text-sm truncate max-w-[180px]">
            {convertToStarknetAddress(BigInt(flip.player))}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Amount:</span>
          <span className="text-white">{flip.amount.toString()}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-xl font-bold text-white">CoinFlip Game</h2>

      {/* Error display */}
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-400">
          <p className="font-medium mb-1">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Coin flip controls */}
      <div className="flex flex-col gap-4 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
        <h3 className="text-lg font-medium text-white">Flip a Coin</h3>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Your Choice</label>
          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 px-4 rounded-lg text-center transition-colors ${
                choice === FlipChoice.Heads
                  ? "bg-blue-700 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setChoice(FlipChoice.Heads)}
            >
              Heads
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg text-center transition-colors ${
                choice === FlipChoice.Tails
                  ? "bg-blue-700 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setChoice(FlipChoice.Tails)}
            >
              Tails
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Bet Amount</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="Enter amount"
          />
        </div>

        <button
          onClick={handleFlipCoin}
          disabled={status === "loading"}
          className={`py-2 px-4 rounded-lg text-center text-white font-medium ${
            status === "loading"
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 transition-colors"
          }`}
        >
          {status === "loading" ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Flipping...
            </div>
          ) : (
            "Flip Coin"
          )}
        </button>
      </div>

      {/* View flip results */}
      {requestId && (
        <div className="flex flex-col gap-4 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
          <h3 className="text-lg font-medium text-white">Your Last Flip</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Request ID:</span>
              <span className="text-white">{requestId}</span>
            </div>

            <button
              onClick={() => fetchFlipDetails(requestId)}
              disabled={status === "loading"}
              className={`py-2 px-4 rounded-lg text-center text-white font-medium ${
                status === "loading"
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 transition-colors"
              }`}
            >
              Refresh Results
            </button>

            {currentFlip && renderFlipDetails(currentFlip)}
          </div>
        </div>
      )}

      {/* Lookup specific flip */}
      <div className="flex flex-col gap-4 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
        <h3 className="text-lg font-medium text-white">Look Up Flip Details</h3>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Request ID</label>
          <input
            type="text"
            value={fetchRequestId}
            onChange={(e) => setFetchRequestId(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="Enter request ID to look up"
          />
        </div>

        <button
          onClick={handleFlipLookup}
          disabled={!fetchRequestId || status === "loading"}
          className={`py-2 px-4 rounded-lg text-center text-white font-medium ${
            !fetchRequestId || status === "loading"
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 transition-colors"
          }`}
        >
          Fetch Flip Details
        </button>

        {fetchedFlip && renderFlipDetails(fetchedFlip)}
      </div>

      {/* Contract balance */}
      <div className="flex flex-col gap-4 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
        <h3 className="text-lg font-medium text-white">Contract Balance</h3>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Token Address</label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="Enter token address"
          />
        </div>

        <button
          onClick={checkContractBalance}
          disabled={!tokenAddress || status === "loading"}
          className={`py-2 px-4 rounded-lg text-center text-white font-medium ${
            !tokenAddress || status === "loading"
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 transition-colors"
          }`}
        >
          Check Balance
        </button>

        {contractBalance !== null && (
          <div className="mt-2 p-3 bg-gray-800 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-400">Contract Balance:</span>
              <span className="text-white font-mono">{contractBalance}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
