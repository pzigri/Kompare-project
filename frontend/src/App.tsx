import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Brendovi from './screens/brendovi';
import Rezultati from './screens/rezultati';
import LogsTable from './components/LogsTable'; 
import Usporedba from './screens/usporedba';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/brendovi" element={<Brendovi />} />
                <Route path="/rezultati" element={<Rezultati />} />
                <Route path="/usporedba" element={<Usporedba />} />
                <Route path="/logs" element={<LogsTable />} /> 
            </Routes>
        </Router>
    );
}

export default App;
