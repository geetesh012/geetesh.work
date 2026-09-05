import { useEffect } from 'react';
import { startSmoothScroll } from './lib/SmoothScroll';
import Landing from './components/Landing';
import About from './components/About';
import Manifesto from './components/Manifesto';
import Work from './components/Work';
import Footer from './components/Footer';
import SoundToggle from './components/Soundtoggletoggle';

export default function App() {
  useEffect(() => {
    startSmoothScroll();
  }, []);

  return (
    <>
      <Landing />
      <Manifesto />
      <About />
      <Work />
      <Footer />
      <SoundToggle />
    </>
  );
}