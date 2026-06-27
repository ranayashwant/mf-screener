// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Screener from './pages/Screener.jsx';
import Portfolio from './pages/Portfolio.jsx';

function App() {
  return (
    <BrowserRouter>
      {/* NAVIGATION BAR */}
      <nav className="bg-blue-700 p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex gap-6">
          <Link to="/" className="text-white font-semibold hover:text-blue-200">
            Screener
          </Link>
          <Link to="/portfolio" className="text-white font-semibold hover:text-blue-200">
            Portfolio
          </Link>
        </div>
      </nav>

      {/* PAGES CONTAINER */}
      <Routes>
        {/* When URL is exactly "/Screener", show <Screener /> */}
        <Route path="/" element={<Screener />} />
        
        {/* When URL is "/Portfolio", show <Portfolio /> */}
        <Route path="/Portfolio" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;