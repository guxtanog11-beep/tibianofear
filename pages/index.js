import Head from "next/head"
import { useEffect, useState } from "react"

function GuildTable({ players }) {
  if (!players.length) return <div className="text-center text-yellow-300 mt-8">Carregando dados da guild...</div>;
  return (
    <div className="bg-black/70 border-4 border-red-800 rounded-xl shadow-2xl p-4 w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl mb-4" style={{ fontFamily: "'UnifrakturCook', cursive", color: "#FFD700" }}>Guild Members</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-yellow-100">
          <thead>
            <tr className="bg-red-900 text-yellow-200">
              <th className="p-2">Nick</th>
              <th className="p-2">Vocation</th>
              <th className="p-2">Level</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => (
              <tr key={idx} className="border-b border-red-800">
                <td className="p-2 font-bold text-yellow-300">{player.nick}</td>
                <td className="p-2">{player.vocation}</td>
                <td className="p-2">{player.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PartyshareTable({ players }) {
  function getPartyShare(player, allPlayers) {
    const min = Math.floor(player.level * 2 / 3);
    const max = Math.floor(player.level * 3 / 2);
    const compat = allPlayers.filter(p =>
      p.nick !== player.nick &&
      p.vocation !== player.vocation &&
      p.level >= min && p.level <= max
    ).map(p => `${p.nick} (${p.level})`);
    return { min, max, compat };
  }

  if (!players.length) return <div className="text-center text-yellow-300 mt-8">Carregando dados da guild...</div>;

  return (
    <div className="bg-black/70 border-4 border-red-800 rounded-xl shadow-2xl p-4 w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl mb-4" style={{ fontFamily: "'UnifrakturCook', cursive", color: "#FFD700" }}>Partyshare da Guild</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-yellow-100">
          <thead>
            <tr className="bg-red-900 text-yellow-200">
              <th className="p-2">Nick</th>
              <th className="p-2">Level</th>
              <th className="p-2">Vocação</th>
              <th className="p-2">Min Share</th>
              <th className="p-2">Max Share</th>
              <th className="p-2">Compatíveis</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => {
              const { min, max, compat } = getPartyShare(player, players);
              return (
                <tr key={idx} className="border-b border-red-800">
                  <td className="p-2 font-bold text-yellow-300">{player.nick}</td>
                  <td className="p-2">{player.level}</td>
                  <td className="p-2">{player.vocation}</td>
                  <td className="p-2">{min}</td>
                  <td className="p-2">{max}</td>
                  <td className="p-2">{compat.length ? compat.join(", ") : <span className="text-red-400">Nenhum</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Home() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    async function fetchPlanilha() {
      try {
        const res = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSbvyqbOW558ErmzlOdKSUU-n-zeDQ7xtxfnJSSM9EchprS0P_0C5dfTNI66zYK1D_tb0z_9kzJ6I83/pub?output=csv");
        const text = await res.text();
        // Parse CSV
        const lines = text.split("\n").filter(l => l.trim());
        const headerRaw = lines[0].split(",");
        const header = headerRaw.map(h => h.trim().toLowerCase());
        const idxNick = header.findIndex(h => h.includes("nick"));
        const idxLevel = header.findIndex(h => h.includes("level"));
        const idxVocation = header.findIndex(h => h.includes("vocation") || h.includes("vocação"));
        const data = lines.slice(1).map(line => {
          const cols = line.split(",");
          return {
            nick: cols[idxNick]?.trim(),
            level: Number(cols[idxLevel]?.trim()),
            vocation: cols[idxVocation]?.trim()
          };
        }).filter(p => p.nick && p.level && p.vocation);
        setPlayers(data);
      } catch (err) {
        setPlayers([]);
      }
    }
    fetchPlanilha();
  }, []);

  return (
    <div className="min-h-screen bg-[url('https://www.tibia.com/images/global/header/background-artwork.jpg')] bg-cover bg-center text-yellow-200 flex flex-col items-center p-6">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap" rel="stylesheet" />
      </Head>
      <header className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl drop-shadow-2xl" style={{ fontFamily: "'UnifrakturCook', cursive", color: "#FFD700" }}>
          Tibianofear Guild
        </h1>
        <p className="mt-3 text-lg text-red-200 italic">Partyshare & Guild Tools</p>
      </header>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
        <GuildTable players={players} />
        <PartyshareTable players={players} />
      </div>
      <footer className="mt-12 text-sm text-yellow-400">
        Feito para <span className="text-red-500 font-bold">Tibianofear Guild</span> ⚔️ | Powered by Google Sheets
      </footer>
    </div>
  )
}
