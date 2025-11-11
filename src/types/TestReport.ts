export interface TestReport {
  id: string;
  testName: string;
  suite: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  timestamp: string;
  errorMessage?: string;
  stackTrace?: string;
}

export interface TestSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  successRate: number;
}

export interface TestRun {
  id: string;
  runDate: string;
  environment: string;
  summary: TestSummary;
  tests: TestReport[];
}
