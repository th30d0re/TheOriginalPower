import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VennDiagram from './visualizations/VennDiagram';
import Timeline from './visualizations/Timeline';
import OutgroupExpansion from './visualizations/OutgroupExpansion';
import CompoundingMetrics from './visualizations/CompoundingMetrics';
import PodcastInsights from './PodcastInsights';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'framework' | 'history' | 'podcast'>('framework');
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>The Original Power</h1>
        <p>Interactive Exploration Dashboard</p>
        <button
          className="arbitrage-link"
          onClick={() => navigate('/arbitrage')}
        >
          Open Systemic Arbitrage Engine →
        </button>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-nav">
        <button 
          className={activeTab === 'framework' ? 'active' : ''}
          onClick={() => setActiveTab('framework')}
        >
          Mathematical Framework
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Historical Analysis
        </button>
        <button 
          className={activeTab === 'podcast' ? 'active' : ''}
          onClick={() => setActiveTab('podcast')}
        >
          Podcast Insights
        </button>
      </nav>

      {/* Content Panels */}
      <motion.div 
        className="dashboard-content"
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeTab === 'framework' && (
          <div className="framework-panel">
            <section className="panel-section">
              <h2>In-group vs Out-group Dynamics</h2>
              <VennDiagram data={{
                inGroup: { label: 'In-group (I)', members: ['Autonomy', 'Empathy', 'Justification'] },
                outGroup: { label: 'Out-group (O)', members: ['Restricted', 'Dismissed', 'Blamed'] },
                elite: { label: 'Elite (E ⊂ I)', members: ['Control', 'Extraction', 'Division'] }
              }} />
            </section>

            <section className="panel-section">
              <h2>Out-group Expansion Over Time</h2>
              <OutgroupExpansion />
              <div className="formula-box">
                <h3>Key Theorem</h3>
                <code>|O(t)| is monotonically non-decreasing as t → ∞</code>
                <p>The size of the oppressed group expands over time as the system seeks to maintain elite power.</p>
              </div>
            </section>

            <section className="panel-section">
              <h2>Compounding Effects Model</h2>
              <CompoundingMetrics />
            </section>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-panel">
            <section className="panel-section">
              <h2>Timeline of Oppressive Systems in America</h2>
              <Timeline data={[
                { year: 1619, event: 'First enslaved Africans arrive in Virginia', outgroup: ['Africans'] },
                { year: 1676, event: 'Bacon\'s Rebellion - Poor whites + Black slaves unite', outgroup: ['Africans', 'Poor Whites'] },
                { year: 1705, event: 'Virginia Slave Codes - Racial division formalized', outgroup: ['Black people'] },
                { year: 1865, event: 'Civil War ends, Convict Leasing begins', outgroup: ['Black people', 'Poor whites'] },
                { year: 1896, event: 'Plessy v. Ferguson - Separate but equal', outgroup: ['Black people'] },
                { year: 1971, event: 'War on Drugs declared', outgroup: ['Black people', 'Poor people', 'Drug users'] },
                { year: 1990, event: 'Mass incarceration peak', outgroup: ['Black people', 'Poor people', 'Drug users', 'Immigrants'] }
              ]} />
            </section>

            <section className="panel-section stats-grid">
              <div className="stat-card">
                <h3>2.3 Million</h3>
                <p>Americans incarcerated (highest rate globally)</p>
              </div>
              <div className="stat-card">
                <h3>5%</h3>
                <p>Of world population</p>
              </div>
              <div className="stat-card">
                <h3>25%</h3>
                <p>Of world's prisoners</p>
              </div>
              <div className="stat-card">
                <h3>100:1</h3>
                <p>Crack vs powder cocaine sentencing disparity</p>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'podcast' && (
          <PodcastInsights />
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
