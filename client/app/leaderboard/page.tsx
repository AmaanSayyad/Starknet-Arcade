"use client";
import { useEffect } from "react";
import { getLeaderboard, setLeaderboard } from "../utils";
import { useState } from "react";

export default function LeaderboardTable() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  useEffect(() => {
    // On initial load: set default data if localStorage is empty
    const existing = getLeaderboard();
    if (existing.length === 0) {
      const defaultData = [
        {
          address: "0x04c3aaa63...6d4d7E70888",
          totalXP: 1420,
          gameType: "Coin Flip",
          status: "Win",
          earnedPoints: 120,
        },
        {
          address: "0x0793feb8c8e...8d22859b88454",
          totalXP: 1340,
          gameType: "Snake & Ladder",
          status: "Loss",
          earnedPoints: 80,
        },
        {
          address: "0x01e8e9987d4...ba3f2c52f3",
          totalXP: 1280,
          gameType: "Rock Paper Scissor",
          status: "Win",
          earnedPoints: 95,
        },
        {
          address: "0x3M4n...5O6p",
          totalXP: 1100,
          gameType: "Coin Flip",
          status: "Loss",
          earnedPoints: 50,
        },
        {
          address: "0x7Q8r...9S0t",
          totalXP: 980,
          gameType: "Snake & Ladder",
          status: "Win",
          earnedPoints: 105,
        },
      ];

      setLeaderboard(defaultData);
      setLeaderboardData(defaultData);
    } else {
      setLeaderboardData(existing);
    }
  }, []);
  return (
    <section className="py-12 px-6 w-full max-w-4xl mx-auto font-techno">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
        🏆Leaderboard
      </h2>

      <div className="overflow-hidden">
        <div className="h-[70vh] overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <table className="min-w-full text-sm text-left text-white">
            <thead className="bg-white/10 text-white uppercase text-xs sticky top-0 backdrop-blur-md z-10">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Game Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Earned Points</th>
                <th className="px-6 py-3">Total XP</th>
              </tr>
            </thead>
            <tbody className="bg-transparent">
              {leaderboardData
                .sort((a, b) => b.totalXP - a.totalXP)
                .map((player, idx) => {
                  let rankIcon = "";
                  if (idx === 0) rankIcon = "🥇";
                  else if (idx === 1) rankIcon = "🥈";
                  else if (idx === 2) rankIcon = "🥉";

                  return (
                    <tr
                      key={player.address}
                      className={`border-b border-white/10`}
                    >
                      <td
                        className={`px-6 py-4 font-medium ${
                          idx < 3 ? "text-4xl" : ""
                        }`}
                      >
                        {rankIcon || idx + 1}
                      </td>
                      <td className="px-6 py-4">{player.address}</td>
                      <td className="px-6 py-4">{player.gameType}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            player.status === "Win"
                              ? "bg-green-600/80 text-white"
                              : "bg-red-600/80 text-white"
                          }`}
                        >
                          {player.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {player.status === "Win"
                          ? player.earnedPoints + " XP"
                          : "..."}
                      </td>
                      <td className="px-6 py-4">{player.totalXP} XP</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
