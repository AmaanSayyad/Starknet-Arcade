"use client";
import { useEffect } from "react";
import { getLeaderboard, setLeaderboard, shortenAddress } from "../utils";
import { useState } from "react";
import {toast} from "react-hot-toast";
export default function LeaderboardTable() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  useEffect(() => {
    // On initial load: set default data if localStorage is empty
    const existing = getLeaderboard();
    if (existing.length === 0) {
      const defaultData = [
        {
          address:
            "0x071c77157a819b7e02204ef928d1fb0c896d2c18bac9488db8bc6e54a5ab51cc",
          totalXP: 1450,
          gameType: "Coin Flip",
          status: "Win",
          earnedPoints: 130,
        },
        {
          address:
            "0x0393119d6e999a247dcbcf5d30627d4f4a908e034b7a75632c67abd4451022ea",
          totalXP: 1380,
          gameType: "Snake & Ladder",
          status: "Loss",
          earnedPoints: 75,
        },
        {
          address:
            "0x0199817e04cac5d66e13dacd5c2a8b65fe0c53c6f8dcabb66ad463be9a35b11c",
          totalXP: 1250,
          gameType: "Rock Paper Scissor",
          status: "Win",
          earnedPoints: 100,
        },
        {
          address:
            "0x0793feb8c8e0557bbbf6370c0e316091bd9553da5c05de854d78d22859b88454",
          totalXP: 1130,
          gameType: "Coin Flip",
          status: "Loss",
          earnedPoints: 60,
        },
        {
          address:
            "0x02584d564c97eccdb04ae7cb0881c28f246b4c81e6ccd40fe2cd8716796e8a2b",
          totalXP: 990,
          gameType: "Snake & Ladder",
          status: "Win",
          earnedPoints: 110,
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
                      <td className="px-6 py-4 flex items-center gap-2">
                        <span>{shortenAddress(player.address)}</span>
                        <button
                          onClick={() =>
                            {
                              navigator.clipboard.writeText(player.address)
                              toast.success("Address Copied");

                            }
                          }
                          className="text-blue-500 hover:text-blue-700 text-sm"
                          title="Copy Address"
                        >
                          📋
                        </button>
                      </td>
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
