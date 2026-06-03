import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Features from './components/Features';
import Team from './components/Team';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const checkLoggedUser = async () => {
      const token = localStorage.getItem('turing_token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await response.json();

        if (json.success) {
          setUser(json.data.user);
        } else {
          localStorage.removeItem('turing_token');
        }
      } catch (err) {
        console.error('Error verifying credentials:', err);
      }
    };

    checkLoggedUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'catalog', 'features', 'team'];
      if (user && user.role === 'admin') {
        sections.push('admin');
      }

      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('turing_token');
    setUser(null);
    setActiveSection('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    alert('Has cerrado sesión exitosamente.');
  };

  const handleExploreClick = () => {
    setActiveSection('catalog');
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onOpenLogin={() => setIsLoginOpen(true)} 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      <Hero onExploreClick={handleExploreClick} />
      
      <Catalog />
      
      <Features />
      
      <Team />
 
      {user && user.role === 'admin' && (
        <AdminDashboard />
      )}
      
      <Footer />

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={(userData) => {
          setUser(userData);
          alert(`¡Bienvenido de vuelta, ${userData.username}!`);
        }}
      />
    </>
  );
}

