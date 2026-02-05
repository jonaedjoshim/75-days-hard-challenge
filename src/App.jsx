import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import History from './pages/History';
import Rewards from './pages/Rewards';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-300 text-white font-sans">
        <Navbar />
        <main className="container mx-auto">
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />
            <Route
              path="/history"
              element={<History />}
            />
            <Route
              path="/rewards"
              element={<Rewards />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;