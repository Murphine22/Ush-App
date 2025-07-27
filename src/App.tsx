import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Finance from './pages/Finance';
import MonthlyDuesRecord from './pages/MonthlyDuesRecord';
import FloatingButtons from './components/FloatingButtons';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnnouncementProvider } from './context/AnnouncementContext';
import { SupportProvider } from './context/SupportContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <AnnouncementProvider>
            <SupportProvider>
              <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/monthly-dues-record" element={<MonthlyDuesRecord />} />
                  </Routes>
                  <FloatingButtons />
                </div>
              </Router>
            </SupportProvider>
          </AnnouncementProvider>
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;