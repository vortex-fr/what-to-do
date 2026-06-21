import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import MyEvent from './pages/MyEvent';
import Help from './pages/Help';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import SavedSearches from './pages/SavedSearches';
import NotFound from './pages/NotFound';
import { Terms, Privacy, About } from './pages/Legal';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/evenements" element={<Events />} />
          <Route path="/evenement/:slug" element={<EventDetail />} />
          <Route path="/mon-evenement" element={<MyEvent />} />
          <Route path="/centre-aide" element={<Help />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/favoris" element={<Favorites />} />
          <Route path="/mes-recherches" element={<SavedSearches />} />
          <Route path="/termes-et-conditions" element={<Terms />} />
          <Route path="/politique-de-confidentialite" element={<Privacy />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}
