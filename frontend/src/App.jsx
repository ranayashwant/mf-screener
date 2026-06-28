// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Screener from './pages/Screener.jsx';
import Portfolio from './pages/Portfolio.jsx';
import SipPlanner from './pages/SipPlanner.jsx';
import Calculator from './pages/Calculator.jsx';
import MindMapModal from './components/MindMapModal';

function App() {
  return (
    <BrowserRouter>
      {/* NAVIGATION BAR */}
      <nav className="bg-blue-700 p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex gap-10">
          <Link to="/" className="text-white font-semibold hover:text-blue-200">
            Screener 
          </Link>
          <Link to="/portfolio" className="text-white font-semibold hover:text-blue-200">
            Portfolio 
          </Link>
          <Link to="/sip-planner" className="text-white font-semibold hover:text-blue-200">
            SIP Planner 
          </Link>
          <Link to="/calculator" className="text-white font-semibold hover:text-blue-200">Calculator</Link> 
        </div>
      </nav>

    <MindMapModal /> {/* project mind map */}

      {/* PAGES CONTAINER */}
      <Routes>
        <Route path="/" element={<Screener />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/sip-planner" element={<SipPlanner />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;