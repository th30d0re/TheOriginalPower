import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import SystemicArbitrageDashboard from './components/SystemicArbitrageDashboard';
import InterferenceEngine3D from './components/visualizations/InterferenceEngine3D';
import ManimEquationGallery from './components/visualizations/ManimEquationGallery';
import ExtractionChart from './components/visualizations/ExtractionChart';
import StoryIndex from './story/StoryIndex';
import ChapterPage from './story/ChapterPage';
import { VideolabDetail, VideolabIndex } from './videolab/VideolabPage';
import './App.css';

const NAV_LINKS = [
  { to: '/', label: 'Story' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/arbitrage', label: 'Arbitrage' },
  { to: '/interference-engine', label: 'Interference Engine' },
  { to: '/extraction-chart', label: 'Extraction Chart' },
  { to: '/animations', label: 'Animations' },
  { to: '/videolab', label: 'Videolab' },
];

const FONT_PREFERENCE_KEY = 'uef-font-preference';

function FontToggle() {
  const [dyslexic, setDyslexic] = useState(() => localStorage.getItem(FONT_PREFERENCE_KEY) === 'dyslexic');

  useEffect(() => {
    if (dyslexic) {
      document.documentElement.dataset.font = 'dyslexic';
      localStorage.setItem(FONT_PREFERENCE_KEY, 'dyslexic');
    } else {
      delete document.documentElement.dataset.font;
      localStorage.removeItem(FONT_PREFERENCE_KEY);
    }
  }, [dyslexic]);

  return <button className="font-toggle" type="button" aria-pressed={dyslexic} onClick={() => setDyslexic((active) => !active)}>
    {dyslexic ? 'Use standard font' : 'Use dyslexic font'}
  </button>;
}

function NavBar() {
  const { pathname } = useLocation();
  const overlay =
    pathname === '/interference-engine' || pathname === '/extraction-chart';

  return (
    <nav className={`app-nav ${overlay ? 'app-nav-overlay' : ''}`}>
      <div className="app-nav-inner">
        <span className="app-nav-brand">UEF</span>
        <ul className="app-nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <FontToggle />
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<StoryIndex />} />
          <Route path="/story/:chapterId" element={<ChapterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/arbitrage" element={<SystemicArbitrageDashboard />} />
          <Route path="/interference-engine" element={<InterferenceEngine3D />} />
          <Route path="/extraction-chart" element={<ExtractionChart />} />
          <Route path="/animations" element={<ManimEquationGallery />} />
          <Route path="/videolab" element={<VideolabIndex />} />
          <Route path="/videolab/:slug" element={<VideolabDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
