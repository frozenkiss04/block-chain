import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Web3Provider } from './contexts/Web3Context';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RegisterVineyard from './pages/RegisterVineyard';
import VineyardsList from './pages/VineyardsList';
import UploadWeb3 from './pages/UploadWeb3';
import TraceabilityWeb3 from './pages/TraceabilityWeb3';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vineyards" element={<VineyardsList />} />
            <Route path="/register-vineyard" element={<RegisterVineyard />} />
            <Route path="/upload" element={<UploadWeb3 />} />
            <Route path="/traceability" element={<TraceabilityWeb3 />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
    </Web3Provider>
  );
}

export default App;
