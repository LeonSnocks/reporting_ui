import React, { useState } from 'react';
import { TestReport } from '../types/TestReport';
import './TestTable.css';

interface TestTableProps {
  tests: TestReport[];
}

const TestTable: React.FC<TestTableProps> = ({ tests }) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState<TestReport | null>(null);

  const filteredTests = tests.filter(test => {
    const matchesFilter = filter === 'all' || test.status === filter;
    const matchesSearch = test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.suite.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDuration = (ms: number): string => {
    if (ms === 0) return '-';
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'passed': return 'status-passed';
      case 'failed': return 'status-failed';
      case 'skipped': return 'status-skipped';
      default: return '';
    }
  };

  return (
    <div className="test-table-container">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search tests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({tests.length})
          </button>
          <button
            className={`filter-btn ${filter === 'passed' ? 'active' : ''}`}
            onClick={() => setFilter('passed')}
          >
            Passed ({tests.filter(t => t.status === 'passed').length})
          </button>
          <button
            className={`filter-btn ${filter === 'failed' ? 'active' : ''}`}
            onClick={() => setFilter('failed')}
          >
            Failed ({tests.filter(t => t.status === 'failed').length})
          </button>
          <button
            className={`filter-btn ${filter === 'skipped' ? 'active' : ''}`}
            onClick={() => setFilter('skipped')}
          >
            Skipped ({tests.filter(t => t.status === 'skipped').length})
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="test-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Test Name</th>
              <th>Suite</th>
              <th>Duration</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-results">
                  No tests found matching your criteria
                </td>
              </tr>
            ) : (
              filteredTests.map(test => (
                <tr key={test.id}>
                  <td>
                    <span className={`status-badge ${getStatusClass(test.status)}`}>
                      {test.status}
                    </span>
                  </td>
                  <td className="test-name">{test.testName}</td>
                  <td>{test.suite}</td>
                  <td>{formatDuration(test.duration)}</td>
                  <td>{formatTimestamp(test.timestamp)}</td>
                  <td>
                    <button
                      className="details-btn"
                      onClick={() => setSelectedTest(test)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedTest && (
        <div className="modal-overlay" onClick={() => setSelectedTest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Test Details</h2>
              <button className="close-btn" onClick={() => setSelectedTest(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Test Name:</span>
                <span className="detail-value">{selectedTest.testName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Suite:</span>
                <span className="detail-value">{selectedTest.suite}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${getStatusClass(selectedTest.status)}`}>
                  {selectedTest.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">{formatDuration(selectedTest.duration)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Timestamp:</span>
                <span className="detail-value">{formatTimestamp(selectedTest.timestamp)}</span>
              </div>
              {selectedTest.errorMessage && (
                <div className="detail-row error-section">
                  <span className="detail-label">Error Message:</span>
                  <pre className="error-message">{selectedTest.errorMessage}</pre>
                </div>
              )}
              {selectedTest.stackTrace && (
                <div className="detail-row error-section">
                  <span className="detail-label">Stack Trace:</span>
                  <pre className="stack-trace">{selectedTest.stackTrace}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestTable;
