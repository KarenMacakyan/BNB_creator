import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Web3Provider } from './context/Web3Context';
import { UserProvider } from './context/UserContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CampaignDetailsPage from './pages/CampaignDetailsPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import ProfilePage from './pages/ProfilePage';
import CreatorsPage from './pages/CreatorsPage';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';
import HowItWorksPage from './pages/HowItWorksPage';

import './App.css';

function App() {
  return (
    <Router>
      <Web3Provider>
        <UserProvider>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/campaign/:id" element={<CampaignDetailsPage />} />
                <Route path="/create-campaign" element={<CreateCampaignPage />} />
                <Route path="/profile/:address" element={<ProfilePage />} />
                <Route path="/creators" element={<CreatorsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </UserProvider>
      </Web3Provider>
    </Router>
  );
}

export default App;

