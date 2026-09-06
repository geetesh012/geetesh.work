import { useEffect } from 'react';
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
import ProjectsPage from './pages/ProjectsPage';
import ExperiencePage from './pages/ExperiencePage';

function HomePage() {
  return (
    <>
      <Landing />
      <Manifesto />
      <About />
      <Work />
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
      </Routes>
    </>
  );
}