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
    ).map(p => p.Name);
    return { min, max, compat };
  }

  if (!planilha.length) return null;
  return (
    <section className="section">
      <h2 className="section-title">Partyshare</h2>
      <div className="table-wrapper">
        <table className="styled-table">
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
  const [planilha, setPlanilha] = useState([]);
  return (
    <div className="container">
      <header className="header">
        <h1 className="site-title">Tibianofear Guild & Char Bazaar Elysian</h1>
      </header>
      <main>
        <CharBazaarElysian />
        <PlanilhaGuild setPlanilha={setPlanilha} planilha={planilha} />
        <PartyshareGuild planilha={planilha} />
      </main>
      <footer className="footer">
        Powered by Rubinot Tools & Google Sheets
      </footer>
      <style jsx global>{`
        body {
          background: #f7f8fa;
          font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
          margin: 0;
          color: #222;
        }
        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 16px 0 16px;
        }
        .header {
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          padding: 24px 0 16px 0;
          margin-bottom: 32px;
          border-radius: 12px;
        }
        .site-title {
          text-align: center;
          font-size: 2.2rem;
          font-weight: 700;
          color: #2d5a8d;
          margin: 0;
        }
        .section {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          padding: 24px;
          margin-bottom: 32px;
        }
        .section-title {
          font-size: 1.4rem;
          color: #2d5a8d;
          margin-bottom: 18px;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        .styled-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 1rem;
          background: #fafbfc;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }
        .styled-table th, .styled-table td {
          padding: 10px 8px;
          border: 1px solid #e3e6ee;
          text-align: left;
        }
        .styled-table th {
          background: #e3e6ee;
          color: #2d5a8d;
          font-weight: 600;
        }
        .styled-table tr:nth-child(even) {
          background: #f7f8fa;
        }
        .btn-link {
          background: #2d5a8d;
          color: #fff;
          padding: 4px 12px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s;
        }
        .btn-link:hover {
          background: #17406b;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          color: #888;
          font-size: 1rem;
          padding-bottom: 24px;
        }
        .loading {
          text-align: center;
          color: #2d5a8d;
          font-size: 1.1rem;
          margin: 32px 0;
        }
        @media (max-width: 700px) {
          .container {
            padding: 8px 2px 0 2px;
          }
          .section {
            padding: 12px;
          }
          .site-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}
