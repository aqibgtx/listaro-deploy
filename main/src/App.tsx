import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import FeatureSection from './components/FeatureSection';
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';
import DifferenceSection from './components/DifferenceSection';
import TargetAudienceSection from './components/TargetAudienceSection';
import CallToActionSection from './components/CallToActionSection';
import Footer from './components/Footer';

function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <FeatureSection />
      <AboutSection />
      <TestimonialsSection />
      <DifferenceSection />
      <TargetAudienceSection />
      <CallToActionSection />
      <Footer />
    </>
  );
}

function PortalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">User Portal</h1>
        <p>Login page coming soon...</p>
      </div>
    </div>
  );
}

function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Branch Manager Dashboard</h1>
        <p>Login page coming soon...</p>
      </div>
    </div>
  );
}

function App() {
  // Update the document title
  React.useEffect(() => {
    document.title = "Listaro App — Real Automation for Dealers";
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans relative">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/admindashboard" element={<AdminDashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;