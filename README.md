# Automation Test Reporting Dashboard

A modern, responsive web UI for visualizing and analyzing automation test results.

## Features

- 📊 **Dashboard Overview** - Visual summary of test execution with key metrics
- 🎯 **Success Rate Visualization** - Interactive pie chart showing test distribution
- 📈 **Summary Cards** - Quick view of total, passed, failed, and skipped tests
- 🔍 **Search & Filter** - Easily find specific tests by name, suite, or status
- 📋 **Detailed Test Results** - Comprehensive table view with test details
- 🔎 **Test Details Modal** - View error messages and stack traces for failed tests
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Clean, professional design with smooth animations

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LeonSnocks/reporting_ui.git
cd reporting_ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### `npm start`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

## Usage

### Viewing Test Results

1. **Select a Test Run**: Use the dropdown at the top to select different test runs
2. **View Summary**: The dashboard displays key metrics including:
   - Total tests executed
   - Number of passed, failed, and skipped tests
   - Total execution time
   - Overall success rate

3. **Filter Tests**: Use the filter buttons to view:
   - All tests
   - Only passed tests
   - Only failed tests
   - Only skipped tests

4. **Search Tests**: Type in the search box to find tests by name or suite

5. **View Details**: Click the "Details" button on any test to see:
   - Complete test information
   - Error messages (for failed tests)
   - Stack traces (for failed tests)

## Project Structure

```
reporting_ui/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── SummaryCards.tsx
│   │   ├── SummaryCards.css
│   │   ├── TestTable.tsx
│   │   ├── TestTable.css
│   │   ├── Chart.tsx
│   │   └── Chart.css
│   ├── data/           # Mock data
│   │   └── mockData.ts
│   ├── types/          # TypeScript interfaces
│   │   └── TestReport.ts
│   ├── App.tsx         # Main application component
│   ├── App.css         # Main styles
│   └── index.tsx       # Application entry point
└── package.json        # Project dependencies

```

## Customization

### Adding Real Data

To connect to a real data source, replace the mock data in `src/data/mockData.ts` with API calls:

```typescript
// Example API integration
export const fetchTestRuns = async (): Promise<TestRun[]> => {
  const response = await fetch('/api/test-runs');
  return response.json();
};
```

### Styling

The application uses CSS modules for component-specific styling. Global styles are in:
- `src/index.css` - Global CSS reset and base styles
- `src/App.css` - Main application layout

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Styling with modern features
- **Create React App** - Build tooling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Project Link: [https://github.com/LeonSnocks/reporting_ui](https://github.com/LeonSnocks/reporting_ui)
