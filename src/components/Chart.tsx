import React from 'react';
import { TestSummary } from '../types/TestReport';
import './Chart.css';

interface ChartProps {
  summary: TestSummary;
}

const Chart: React.FC<ChartProps> = ({ summary }) => {
  const total = summary.totalTests;
  const passedPercentage = (summary.passed / total) * 100;
  const failedPercentage = (summary.failed / total) * 100;
  const skippedPercentage = (summary.skipped / total) * 100;

  return (
    <div className="chart-container">
      <h3>Test Results Distribution</h3>
      <div className="pie-chart">
        <svg viewBox="0 0 200 200" className="pie-svg">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="40"
            strokeDasharray={`${passedPercentage * 5.03} 503`}
            transform="rotate(-90 100 100)"
          />
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#f44336"
            strokeWidth="40"
            strokeDasharray={`${failedPercentage * 5.03} 503`}
            strokeDashoffset={`-${passedPercentage * 5.03}`}
            transform="rotate(-90 100 100)"
          />
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#FF9800"
            strokeWidth="40"
            strokeDasharray={`${skippedPercentage * 5.03} 503`}
            strokeDashoffset={`-${(passedPercentage + failedPercentage) * 5.03}`}
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="chart-center-text">
          <div className="success-rate">{summary.successRate.toFixed(1)}%</div>
          <div className="success-label">Success</div>
        </div>
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color passed"></span>
          <span className="legend-text">Passed: {summary.passed}</span>
        </div>
        <div className="legend-item">
          <span className="legend-color failed"></span>
          <span className="legend-text">Failed: {summary.failed}</span>
        </div>
        <div className="legend-item">
          <span className="legend-color skipped"></span>
          <span className="legend-text">Skipped: {summary.skipped}</span>
        </div>
      </div>
    </div>
  );
};

export default Chart;
