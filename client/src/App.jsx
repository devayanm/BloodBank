import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes';

function App() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('blood');

  // Sync activeTab with URL
  useEffect(() => {
    if (location.pathname.includes('organ')) {
      setActiveTab('organ');
    } else {
      setActiveTab('blood');
    }
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      {/* Header handles tab switching and page navigation */}
      <Header activeTab={activeTab} onTabChange={handleTabChange} />

      <div style={{ padding: '20px' }}>
        {/* Page Routing */}
        <AppRoutes activeTab={activeTab} />
      </div>

      <Footer />
    </>
  );
}

export default App;
