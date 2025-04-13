"use client";

const leaderboardData = [
  {
    address: "0x1A2b...3C4d",
    totalXP: 1420,
    gameType: "Fortnite",
    status: "Win",
    earnedPoints: 120,
  },
  {
    address: "0x5E6f...7G8h",
    totalXP: 1340,
    gameType: "Zelda",
    status: "Loss",
    earnedPoints: 80,
  },
  {
    address: "0x9I0j...1K2l",
    totalXP: 1280,
    gameType: "Mario",
    status: "Win",
    earnedPoints: 95,
  },
  {
    address: "0x3M4n...5O6p",
    totalXP: 1100,
    gameType: "League",
    status: "Loss",
    earnedPoints: 50,
  },
  {
    address: "0x7Q8r...9S0t",
    totalXP: 980,
    gameType: "CSGO",
    status: "Win",
    earnedPoints: 105,
  },
  {
    address: "0xAbCd...EfGh",
    totalXP: 920,
    gameType: "Apex",
    status: "Loss",
    earnedPoints: 60,
  },
  {
    address: "0xIjKl...MnOp",
    totalXP: 890,
    gameType: "Valorant",
    status: "Win",
    earnedPoints: 100,
  },
];

export default function LeaderboardTable() {
  return (
    <section className="py-12 px-6 w-full max-w-4xl mx-auto font-techno">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">🏆Leaderboard</h2>

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
                      <td className={`px-6 py-4 font-medium ${idx < 3 ? "text-4xl" : ""}`}>
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
                      <td className="px-6 py-4">{ player.status === "Win" ? player.earnedPoints + ' XP' : "..."}</td>
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
