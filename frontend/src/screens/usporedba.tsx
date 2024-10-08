import React from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 

interface LogData {
  brandCode: string;
  category: string;
  serviceKey: string;
  responseVariables: {
    totalPremium?: number;
    policyVehicle: {
      make: string;
    };
  };
}

const Usporedba: React.FC = () => {
    const location = useLocation();
    const { selectedLogs } = location.state || { selectedLogs: [] };

    if (selectedLogs.length === 0) {
        return (
            <div style={styles.outerContainer}>
                <div style={styles.container}>
                    <h2 style={styles.title}>Usporedba odabranih rezultata</h2>
                    <p>Nema odabranih rezultata za usporedbu.</p>
                </div>
            </div>
        );
    }

    // pdf gumb
    const handleExportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Usporedba odabranih rezultata', 14, 22);
        doc.setFontSize(12);

        const tableColumn = ["Brand", "Marka vozila", "Usluga", "Kategorija", "Ukupna premija"];
        const tableRows: any[] = [];

        selectedLogs.forEach((log: LogData) => {
            const logData = [
                log.brandCode,
                log.responseVariables?.policyVehicle?.make || 'N/A',
                log.serviceKey,
                log.category,
                log.responseVariables.totalPremium || 'nije dostupna'
            ];
            tableRows.push(logData);
        });

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save('usporedba_rezultata.pdf');
    };

    return (
        <div style={styles.outerContainer}>
            <div style={styles.container}>
                <h2 style={styles.title}>Usporedba odabranih rezultata</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Brand</th>
                            <th style={styles.tableHeader}>Marka vozila</th>
                            <th style={styles.tableHeader}>Usluga</th>
                            <th style={styles.tableHeader}>Kategorija</th>
                            <th style={styles.tableHeader}>Ukupna premija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedLogs.map((log: LogData, index: number) => (
                            <tr key={index} style={styles.tableRow}>
                                <td style={styles.tableCell}>{log.brandCode}</td>
                                <td style={styles.tableCell}>{log.responseVariables?.policyVehicle?.make || 'N/A'}</td>
                                <td style={styles.tableCell}>{log.serviceKey}</td>
                                <td style={styles.tableCell}>{log.category}</td>
                                <td style={styles.tableCell}>{log.responseVariables.totalPremium || 'nije dostupna'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button style={styles.exportButton} onClick={handleExportToPDF}>
                    Export to PDF
                </button>
            </div>
        </div>
    );
};

const styles = {
    outerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6200AA',
        height: '100vh',
        padding: '20px',
    },
    container: {
        backgroundColor: '#F7F7F7',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '1200px',
        width: '100%',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        color: '#7E28C6',
        textAlign: 'center' as const,
        marginBottom: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        marginBottom: '20px',
    },
    tableHeader: {
        backgroundColor: '#7E28C6',
        color: '#FFF',
        padding: '10px',
        textAlign: 'left' as const,
        borderBottom: '2px solid #6200AA',
    },
    tableRow: {
        backgroundColor: '#FFF',
        borderBottom: '1px solid #DDD',
    },
    tableCell: {
        padding: '10px',
        color: '#333',
    },
    exportButton: {
        backgroundColor: '#7E28C6',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        textAlign: 'center' as const,
        marginTop: '20px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
};

export default Usporedba;
