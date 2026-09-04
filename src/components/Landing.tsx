import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import OverlayMenu from './OverlayMenu';
import Hero from './Hero';

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [navMounted, setNavMounted] = useState(false);
  const [heroMounted, setHeroMounted] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    const navTimer = setTimeout(() => setNavMounted(true), 100);
    const heroTimer = setTimeout(() => setHeroMounted(true), 300);
    return () => {
      clearTimeout(navTimer);
      clearTimeout(heroTimer);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = overlayOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [overlayOpen]);

  return (
    <div className="relative bg-black">
      <Navbar
        scrolled={scrolled}
        mounted={navMounted}
        overlayOpen={overlayOpen}
        onToggleOverlay={() => setOverlayOpen((prev) => !prev)}
      />
      <OverlayMenu open={overlayOpen} onClose={() => setOverlayOpen(false)} />
      <Hero mounted={heroMounted} />
    </div>
  );
}
