import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TripProvider } from './context/TripContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PlanTrip from './pages/PlanTrip';
import MyTrips from './pages/MyTrips';
import TripDetail from './pages/TripDetail';

export default function App() {
  return (
    <TripProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/plan" element={<PlanTrip />} />
              <Route path="/trips" element={<MyTrips />} />
              <Route path="/trips/:id" element={<TripDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#3b9bf3', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#fd4f0f', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </TripProvider>
  );
}
