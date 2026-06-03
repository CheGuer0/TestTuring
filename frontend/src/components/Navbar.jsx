import React, { useState } from 'react';
import './Navbar.css';

export default function Navbar({ user, onLogout, onOpenLogin, activeSection, setActiveSection }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="nav-logo" onClick={() => handleNavClick('hero')}>
          <div className="logo-icon"></div>
          <span className="logo-text">TURING <span className="logo-highlight">TECH</span></span>
        </div>

        <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
          <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
        </button>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className={`nav-item ${activeSection === 'hero' ? 'active' : ''}`} onClick={() => handleNavClick('hero')}>
            Inicio
          </li>
          <li className={`nav-item ${activeSection === 'catalog' ? 'active' : ''}`} onClick={() => handleNavClick('catalog')}>
            Catálogo
          </li>
          <li className={`nav-item ${activeSection === 'features' ? 'active' : ''}`} onClick={() => handleNavClick('features')}>
            Beneficios
          </li>
          <li className={`nav-item ${activeSection === 'team' ? 'active' : ''}`} onClick={() => handleNavClick('team')}>
            Equipo
          </li>

          {user && user.role === 'admin' && (
            <li className={`nav-item ${activeSection === 'admin' ? 'active' : ''}`} onClick={() => handleNavClick('admin')}>
              Admin Panel
            </li>
          )}

          <li className="nav-auth-mobile">
            {user ? (
              <div className="user-profile-mobile">
                <span className="user-name">Hola, {user.username}</span>
                <button className="btn btn-secondary btn-sm" onClick={onLogout}>Cerrar Sesión</button>
              </div>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={onOpenLogin}>Iniciar Sesión</button>
            )}
          </li>
        </ul>

        <div className="nav-auth-desktop">
          {user ? (
            <div className="user-profile-desktop">
              <span className="user-badge" title={`Rol: ${user.role}`}>
                {user.role === 'admin' ? '🛡️ Admin' : '👤 User'}
              </span>
              <span className="user-name">Hola, <strong>{user.username}</strong></span>
              <button className="btn btn-secondary btn-sm" onClick={onLogout}>Cerrar Sesión</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onOpenLogin}>Iniciar Sesión</button>
          )}
        </div>
      </div>
    </nav>
  );
}

