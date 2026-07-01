import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StoryMode from './components/StoryMode';
import Dashboard from './components/Dashboard';
import SystemicArbitrageDashboard from './components/SystemicArbitrageDashboard';
import InterferenceEngine3D from './components/visualizations/InterferenceEngine3D';
import './App.css';

function App() {
  const [storyCompleted, setStoryCompleted] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoryMode onComplete={() => setStoryCompleted(true)} />} />
        <Route 
          path="/dashboard" 
          element={storyCompleted ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route path="/arbitrage" element={<SystemicArbitrageDashboard />} />
        <Route path="/interference-engine" element={<InterferenceEngine3D />} />
      </Routes>
    </Router>
  );
}

export default App;
