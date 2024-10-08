import React, { useEffect, useState } from 'react';

// Definiraj TypeScript tipove za podatke koje dohvaćaš iz API-a
interface WebServiceLog {
  timestamp: string;  // Vrijeme zapisa (prilagodi prema CSV strukturi)
  message: string;    // Poruka zapisa (prilagodi prema CSV strukturi)
  level: string;      // Razina loga (prilagodi prema CSV strukturi)
}

const LogsTable: React.FC = () => {
  // Definiraj state za čuvanje podataka iz CSV-a
  const [logs, setLogs] = useState<WebServiceLog[]>([]);

  // useEffect za dohvaćanje podataka kada se komponenta učita
  useEffect(() => {
    // Dohvaćanje podataka iz API endpointa `/api/logs`
    fetch('/api/logs')
      .then((response) => response.json()) // Pretvori odgovor u JSON format
      .then((data: WebServiceLog[]) => setLogs(data)) // Postavi podatke u state
      .catch((error) => console.error('Error fetching logs:', error)); // Obradi greške
  }, []);

  // Renderiranje podataka u tablici
  return (
    <div>
      <h2>Web Service Logs</h2>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Message</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.timestamp}</td>
              <td>{log.message}</td>
              <td>{log.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTable;
