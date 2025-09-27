
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ScannerPage from './pages/ScannerPage';
import UrlScanPage from './pages/UrlScanPage';
import NewsVerificationPage from './pages/NewsVerificationPage';
import LearningPage from './pages/LearningPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/url-scan" element={<UrlScanPage />} />
          <Route path="/news-verification" element={<NewsVerificationPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
