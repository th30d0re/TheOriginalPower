import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from 'react-router-dom';
import StoryMode from './components/StoryMode';
import Dashboard from './components/Dashboard';
import SystemicArbitrageDashboard from './components/SystemicArbitrageDashboard';
import InterferenceEngine3D from './components/visualizations/InterferenceEngine3D';
import ManimEquationGallery from './components/visualizations/ManimEquationGallery';
import ExtractionChart from './components/visualizations/ExtractionChart';
import StoryIndex from './story/StoryIndex';
import ChapterPage from './story/ChapterPage';
import './App.css';

const NAV_LINKS = [
  { to: '/', label: 'Story' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/arbitrage', label: 'Arbitrage' },
  { to: '/interference-engine', label: 'Interference Engine' },
  { to: '/extraction-chart', label: 'Extraction Chart' },
  { to: '/animations', label: 'Animations' },
];

function NavBar() {
  const { pathname } = useLocation();
  const overlay = pathname === '/interference-engine';

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
      </div>
    </nav>
  );
}

function App() {
  const [, setStoryCompleted] = useState(false);

  return (
    <Router>
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<StoryIndex />} />
          <Route path="/story/:chapterId" element={<ChapterPage />} />
          <Route
            path="/legacy-story"
            element={<StoryMode onComplete={() => setStoryCompleted(true)} />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/arbitrage" element={<SystemicArbitrageDashboard />} />
          <Route path="/interference-engine" element={<InterferenceEngine3D />} />
          <Route path="/extraction-chart" element={<ExtractionChart />} />
          <Route path="/animations" element={<ManimEquationGallery />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
