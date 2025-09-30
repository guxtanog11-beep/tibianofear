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

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-pink-500 drop-shadow-lg">
        Tibianofear Guild & Char Bazaar Elysian
      </h1>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Rubinot */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-4">
          <h2 className="text-xl font-semibold mb-2">Char Bazaar (Rubinot)</h2>
          <iframe 
            src="https://rubinot.com.br"
            className="w-full h-[600px] rounded-lg"
          />
        </div>
        {/* Planilha */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-4">
          <h2 className="text-xl font-semibold mb-2">Planilha da Guild</h2>
          <iframe 
            src="LINK_DA_SUA_PLANILHA"
            className="w-full h-[600px] rounded-lg"
          />
        </div>
      </div>
      <footer className="mt-10 text-sm text-gray-400">
        Powered by Rubinot Tools & Google Sheets
      </footer>
    </div>
  )
}
