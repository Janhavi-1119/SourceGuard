import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import NewAnalysis from './pages/NewAnalysis';
import AnalysisResults from './pages/AnalysisResults';
import ComparisonMatrix from './pages/ComparisonMatrix';
import SavedReports from './pages/SavedReports';
import History from './pages/History';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-analysis" element={<NewAnalysis />} />
          <Route path="/results" element={<AnalysisResults />} />
          <Route path="/comparison" element={<ComparisonMatrix />} />
          <Route path="/saved-reports" element={<SavedReports />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
