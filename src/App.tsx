import React, { useState } from 'react';
import './App.css';
import SummaryCards from './components/SummaryCards';
import TestTable from './components/TestTable';
import Chart from './components/Chart';
import { mockTestRuns } from './data/mockData';
import { TestRun } from './types/TestReport';

function App() {
  const [selectedRun, setSelectedRun] = useState<TestRun>(mockTestRuns[0]);

  return (
    <div className="App">
      <header className="app-header">
        <h1>🤖 Automation Test Reporting Dashboard</h1>
        <p className="subtitle">Monitor and analyze your test automation results</p>
      </header>
      
      <main className="app-content">
        <div className="run-selector">
          <label htmlFor="test-run">Select Test Run:</label>
          <select 
            id="test-run"
            value={selectedRun.id}
            onChange={(e) => {
              const run = mockTestRuns.find(r => r.id === e.target.value);
              if (run) setSelectedRun(run);
            }}
          >
            {mockTestRuns.map(run => (
              <option key={run.id} value={run.id}>
                {new Date(run.runDate).toLocaleString()} - {run.environment}
              </option>
            ))}
          </select>
        </div>

        <SummaryCards summary={selectedRun.summary} />
        
        <div className="charts-section">
          <Chart summary={selectedRun.summary} />
        </div>

        <div className="tests-section">
          <h2>Test Results</h2>
          <TestTable tests={selectedRun.tests} />
        </div>
      </main>

      <footer className="app-footer">
        <p>Automation Reporting UI © 2025</p>
      </footer>
    </div>
  );
}

export default App;
