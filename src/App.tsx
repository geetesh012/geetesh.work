import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { startSmoothScroll } from './lib/SmoothScroll';
import SamuraiPreloader from './components/Samuraipreloader';
import Landing from './components/Landing';
import About from './components/About';
import Manifesto from './components/Manifesto';
import Work from './components/Work';
import Footer from './components/Footer';
import SoundToggle from './components/Soundtoggletoggle';
import CustomCursor from './components/Customcursor';
import FearSection from './components/Fearsection';
import SamuraiSection from './components/Samuraisection';

// Routed pages are only needed once the user navigates to them, so they're
// split into their own chunks instead of being bundled into the initial load.
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));

function HomePage() {
  return (
    <>
      <Landing />
      <Manifesto />
      <FearSection/>
      <About />
      <Work />
      <SamuraiSection/>
      <Footer />
    </>
  );
}

export default function App() {
  useEffect(() => {
    startSmoothScroll();
  }, []);

  return (
    <>
      <SamuraiPreloader siteName="GEETESH KANKONKAR" tagline="PORTFOLIO · EST. 2026" />
      <CustomCursor />
      <SoundToggle />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
        </Routes>
      </Suspense>
    </>
  );
}