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

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('https://www.tibia.com/images/global/header/background-artwork.jpg')] bg-cover bg-center text-yellow-200 flex flex-col items-center p-6">
      <Head>
        {/* Fonte medieval */}
        <link href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap" rel="stylesheet" />
      </Head>

      {/* Cabeçalho */}
      <header className="text-center mb-10">
        <h1 
          className="text-5xl md:text-6xl drop-shadow-2xl"
          style={{ fontFamily: "'UnifrakturCook', cursive", color: "#FFD700" }}
        >
          Tibianofear Guild
        </h1>
        <p className="mt-3 text-lg text-red-200 italic">
          Char Bazaar Elysian & Guild Tools
        </p>
      </header>

      {/* Conteúdo principal */}
      <main className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Rubinot */}
        <div className="bg-black/70 border-4 border-red-800 rounded-xl shadow-2xl p-4">
          <h2 
            className="text-2xl mb-4"
            style={{ fontFamily: "'UnifrakturCook', cursive", color: "#FFD700" }}
          >
            Char Bazaar (Rubinot)
          </h2>
          <iframe 
            src="https://rubinot.com.br"
            className="w-full h-[600px] rounded-lg border border-yellow-600"
          />
        </div>

        {/* Planilha */}
        <div className="bg-black/70 border-4 border-red-800 rounded-xl shadow-2xl p-4">
          <h2 
            className="text-2xl mb-4"
            style={{ fontFamily: "'UnifrakturCook', cursive", color: "#FFD700" }}
          >
            Planilha da Guild
          </h2>
          <iframe 
            src="LINK_DA_SUA_PLANILHA_PUBLICA"
            className="w-full h-[600px] rounded-lg border border-yellow-600"
          />
        </div>
      </main>

      {/* Rodapé */}
      <footer className="mt-12 text-sm text-yellow-400">
        Feito para <span className="text-red-500 font-bold">Tibianofear Guild</span> ⚔️ | Powered by Rubinot Tools & Google Sheets
      </footer>
    </div>
  )
}
