import React from 'react';
import { TestSummary } from '../types/TestReport';
import './SummaryCards.css';

interface SummaryCardsProps {
  summary: TestSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="summary-cards">
      <div className="summary-card total">
        <div className="card-header">Total Tests</div>
        <div className="card-value">{summary.totalTests}</div>
      </div>
      <div className="summary-card passed">
        <div className="card-header">Passed</div>
        <div className="card-value">{summary.passed}</div>
        <div className="card-percentage">
          {((summary.passed / summary.totalTests) * 100).toFixed(1)}%
        </div>
      </div>
      <div className="summary-card failed">
        <div className="card-header">Failed</div>
        <div className="card-value">{summary.failed}</div>
        <div className="card-percentage">
          {((summary.failed / summary.totalTests) * 100).toFixed(1)}%
        </div>
      </div>
      <div className="summary-card skipped">
        <div className="card-header">Skipped</div>
        <div className="card-value">{summary.skipped}</div>
        <div className="card-percentage">
          {((summary.skipped / summary.totalTests) * 100).toFixed(1)}%
        </div>
      </div>
      <div className="summary-card duration">
        <div className="card-header">Duration</div>
        <div className="card-value">{formatDuration(summary.duration)}</div>
      </div>
      <div className="summary-card success-rate">
        <div className="card-header">Success Rate</div>
        <div className="card-value">{summary.successRate.toFixed(1)}%</div>
      </div>
    </div>
  );
};

export default SummaryCards;
