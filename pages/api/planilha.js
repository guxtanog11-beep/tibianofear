import Papa from 'papaparse';

export default async function handler(req, res) {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSbvyqbOW558ErmzlOdKSUU-n-zeDQ7xtxfnJSSM9EchprS0P_0C5dfTNI66zYK1D_tb0z_9kzJ6I83/pub?gid=0&single=true&output=csv';
  try {
    const response = await fetch(url);
    const csvData = await response.text();
    const jsonData = Papa.parse(csvData, { header: true }).data;
    res.status(200).json(jsonData);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar planilha' });
  }
}




