
import { useEffect, useState } from 'react';

function PlanilhaGuild() {
  const [planilha, setPlanilha] = useState([]);
  useEffect(() => {
    fetch('/api/planilha')
      .then(res => res.json())
      .then(json => setPlanilha(json))
      .catch(err => setPlanilha([]));
  }, []);
  if (!planilha.length) return <div>Carregando planilha da guild...</div>;
  return (
    <div style={{ marginBottom: 40 }}>
      <h2>Planilha da Guild</h2>
      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {Object.keys(planilha[0]).map((key) => (
              <th key={key} style={{ background: '#eee' }}>{key}</th>
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
  );
}

function CharBazaarElysian() {
  const [chars, setChars] = useState([]);
  useEffect(() => {
    fetch('https://rubinot-tools.vercel.app/api/charbazaar?world=Elysian')
      .then(res => res.json())
      .then(json => {
        // Filtra os mais baratos da semana
        const sorted = json.sort((a, b) => a.price - b.price);
        setChars(sorted.slice(0, 10));
      })
      .catch(err => setChars([]));
  }, []);
  if (!chars.length) return <div>Carregando Char Bazaar Elysian...</div>;
  return (
    <div style={{ marginBottom: 40 }}>
      <h2>Char Bazaar - Elysian (Mais baratos da semana)</h2>
      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
              <td><a href={char.url} target="_blank" rel="noopener noreferrer">Ver</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Tibianofear Guild & Char Bazaar Elysian</h1>
      <CharBazaarElysian />
      <PlanilhaGuild />
      <footer style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
        Powered by Rubinot Tools & Google Sheets
      </footer>
    </div>
  );
}
