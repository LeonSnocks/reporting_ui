import { TestRun } from '../types/TestReport';

export const mockTestRuns: TestRun[] = [
  {
    id: '1',
    runDate: '2025-11-11T10:30:00Z',
    environment: 'Production',
    summary: {
      totalTests: 150,
      passed: 142,
      failed: 5,
      skipped: 3,
      duration: 1245000,
      successRate: 94.67
    },
    tests: [
      {
        id: 't1',
        testName: 'Login with valid credentials',
        suite: 'Authentication',
        status: 'passed',
        duration: 2500,
        timestamp: '2025-11-11T10:30:05Z'
      },
      {
        id: 't2',
        testName: 'Login with invalid password',
        suite: 'Authentication',
        status: 'passed',
        duration: 1800,
        timestamp: '2025-11-11T10:30:08Z'
      },
      {
        id: 't3',
        testName: 'User registration flow',
        suite: 'User Management',
        status: 'failed',
        duration: 3200,
        timestamp: '2025-11-11T10:30:12Z',
        errorMessage: 'Expected element not found',
        stackTrace: 'AssertionError: Element with id "submit-button" was not found\n    at Test.run (test-runner.js:45:12)'
      },
      {
        id: 't4',
        testName: 'Password reset functionality',
        suite: 'Authentication',
        status: 'passed',
        duration: 4100,
        timestamp: '2025-11-11T10:30:16Z'
      },
      {
        id: 't5',
        testName: 'Dashboard data loading',
        suite: 'Dashboard',
        status: 'passed',
        duration: 5500,
        timestamp: '2025-11-11T10:30:22Z'
      },
      {
        id: 't6',
        testName: 'Export report to PDF',
        suite: 'Reporting',
        status: 'failed',
        duration: 2100,
        timestamp: '2025-11-11T10:30:27Z',
        errorMessage: 'Timeout waiting for PDF generation',
        stackTrace: 'TimeoutError: PDF generation exceeded 30s timeout'
      },
      {
        id: 't7',
        testName: 'User profile update',
        suite: 'User Management',
        status: 'passed',
        duration: 3300,
        timestamp: '2025-11-11T10:30:30Z'
      },
      {
        id: 't8',
        testName: 'API integration test',
        suite: 'API',
        status: 'skipped',
        duration: 0,
        timestamp: '2025-11-11T10:30:30Z'
      }
    ]
  },
  {
    id: '2',
    runDate: '2025-11-10T15:20:00Z',
    environment: 'Staging',
    summary: {
      totalTests: 150,
      passed: 145,
      failed: 3,
      skipped: 2,
      duration: 1189000,
      successRate: 96.67
    },
    tests: [
      {
        id: 't9',
        testName: 'Login with valid credentials',
        suite: 'Authentication',
        status: 'passed',
        duration: 2400,
        timestamp: '2025-11-10T15:20:05Z'
      },
      {
        id: 't10',
        testName: 'User registration flow',
        suite: 'User Management',
        status: 'passed',
        duration: 3100,
        timestamp: '2025-11-10T15:20:08Z'
      }
    ]
  }
];
