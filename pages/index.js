function PartyshareGuild({ planilha }) {
  // Calcula partyshare para cada player
  function getPartyShare(player, allPlayers) {
    const min = Math.floor(player.Level * 2 / 3);
    const max = Math.floor(player.Level * 3 / 2);
    // Filtra jogadores compatíveis (exceto mesma vocação e ele mesmo)
    const compat = allPlayers.filter(p =>
      p.Name !== player.Name &&
      p.Vocação !== player.Vocação &&
      p.Level >= min && p.Level <= max
    ).map(p => `${p.Name} (${p.Level})`);
    return { min, max, compat };
  }

  if (!planilha.length) return null;
  return (
    <section className="section partyshare-section">
      <h2 className="section-title">Partyshare</h2>
      <div className="table-wrapper">
        <table className="styled-table partyshare-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Level</th>
              <th>Vocação</th>
              <th>Min Share</th>
              <th>Max Share</th>
              <th>Compatíveis</th>
            </tr>
          </thead>
          <tbody>
            {planilha.map((player, idx) => {
              const { min, max, compat } = getPartyShare(player, planilha);
              return (
                <tr key={idx}>
                  <td>{player.Name}</td>
                  <td>{player.Level}</td>
                  <td>{player.Vocação}</td>
                  <td>{min}</td>
                  <td>{max}</td>
                  <td>{compat.length ? compat.join(", ") : <span style={{color:'#888'}}>Nenhum</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}


import { useEffect, useState } from 'react';

function PlanilhaGuild({ setPlanilha, planilha }) {
  useEffect(() => {
    fetch('/api/planilha')
      .then(res => res.json())
      .then(json => setPlanilha(json))
      .catch(err => setPlanilha([]));
  }, [setPlanilha]);
  if (!planilha.length) return <div className="loading">Carregando planilha da guild...</div>;
  return (
    <section className="section">
      <h2 className="section-title">Planilha da Guild</h2>
      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              {Object.keys(planilha[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {planilha.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CharBazaarElysian() {
  const [chars, setChars] = useState([]);
  useEffect(() => {
    fetch('https://rubinot-tools.vercel.app/api/charbazaar?world=Elysian')
      .then(res => res.json())
      .then(json => {
        const sorted = json.sort((a, b) => a.price - b.price);
        setChars(sorted.slice(0, 10));
      })
      .catch(err => setChars([]));
  }, []);
  if (!chars.length) return <div className="loading">Carregando Char Bazaar Elysian...</div>;
  return (
    <section className="section">
      <h2 className="section-title">Char Bazaar - Elysian (Mais baratos da semana)</h2>
      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Level</th>
              <th>Vocação</th>
              <th>Preço</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {chars.map((char, idx) => (
              <tr key={idx}>
                <td>{char.name}</td>
                <td>{char.level}</td>
                <td>{char.vocation}</td>
                <td>{char.price}</td>
                <td><a href={char.url} target="_blank" rel="noopener noreferrer" className="btn-link">Ver</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

import Head from "next/head"
import { useEffect, useState } from "react"

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
    <div className="bg-black/70 border-4 border-red-800 rounded-xl shadow-2xl p-4 w-full max-w-4xl mx-auto mt-8">
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
        const header = lines[0].split(",").map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const cols = line.split(",");
          // Ajuste os nomes das colunas conforme sua planilha
          return {
            nick: cols[0]?.trim(),
            level: Number(cols[1]?.trim()),
            vocation: cols[2]?.trim()
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
      <PartyshareTable players={players} />
      <footer className="mt-12 text-sm text-yellow-400">
        Feito para <span className="text-red-500 font-bold">Tibianofear Guild</span> ⚔️ | Powered by Google Sheets
      </footer>
    </div>
  )
}
