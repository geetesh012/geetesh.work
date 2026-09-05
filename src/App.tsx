import { useEffect } from 'react';
import { startSmoothScroll } from './lib/SmoothScroll';
import SamuraiPreloader from './components/Samuraipreloader';
import Landing from './components/Landing';
import About from './components/About';
import Manifesto from './components/Manifesto';
import Work from './components/Work';
import Footer from './components/Footer';
import SoundToggle from './components/Soundtoggletoggle';
import CustomCursor from './components/Customcursor';

export default function App() {
  useEffect(() => {
    startSmoothScroll();
  }, []);

  return (
    <>
      <SamuraiPreloader siteName="GEETESH KANKONKAR" tagline="PORTFOLIO · EST. 2026" />
      <CustomCursor />
      <Landing />
      <Manifesto />
      <About />
      <Work />
      <Footer />
      <SoundToggle />
    </>
  );
}