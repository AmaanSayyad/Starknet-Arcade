export function getRandomNumber() {
  return Math.floor(Math.random() * 1000000);
}

export function convertToStarknetAddress(address: bigint) {
  return "0x" + address.toString(16).padStart(64, "0");
}

export function convertAddressToStarknetAddress(address: string) {
  return "0x" + address.slice(2).padStart(64, "0");
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function decimalToText(decimal: bigint): string {
  const hex = decimal.toString(16);
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

// Utility function to format token amount
export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  symbol: string
): string {
  const divisor = BigInt(10) ** BigInt(decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;

  // Convert fractional part to string and pad with leading zeros
  let fractionalStr = fractionalPart.toString().padStart(decimals, "0");
  // Remove trailing zeros
  fractionalStr = fractionalStr.replace(/0+$/, "");

  // If no fractional part, return just the integer
  if (!fractionalStr) {
    return `${integerPart} ${symbol}`;
  }

  return `${integerPart}.${fractionalStr} ${symbol}`;
}

export const getLeaderboard = () => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("leaderboard");
  return data ? JSON.parse(data) : [];
};

export const setLeaderboard = (data: any[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("leaderboard", JSON.stringify(data));
};

export const addOrUpdatePlayer = ({
  address,
  gameType,
  status,
  earnedPoints,
}: {
  address: string;
  gameType: string;
  status: "Win" | "Loss";
  earnedPoints: number;
}) => {
  const existing = getLeaderboard();

  const updated = [...existing];
  const index = updated.findIndex((player) => player.address === address);

  if (index !== -1) {
    // Update existing player
    updated[index] = {
      ...updated[index],
      gameType,
      status,
      earnedPoints,
      totalXP: updated[index].totalXP + earnedPoints,
    };
  } else {
    // Add new player
    updated.push({
      address,
      gameType,
      status,
      earnedPoints,
      totalXP: earnedPoints,
    });
  }

  setLeaderboard(updated);
};
