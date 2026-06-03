import React from 'react';
import './Footer.css';

export default function Footer() {
  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <div className="footer-logo" onClick={() => handleScrollTo('hero')}>
            <div className="logo-icon"></div>
            <span className="logo-text">TURING <span className="logo-highlight">TECH</span></span>
          </div>
          <p className="footer-about">
            Equipando a gamers, creadores y profesionales con hardware de alto rendimiento y ensambles a medida certificados.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-link" aria-label="Facebook">FB</a>
            <a href="#" className="social-link" aria-label="X (Twitter)">X</a>
            <a href="#" className="social-link" aria-label="Instagram">IG</a>
            <a href="#" className="social-link" aria-label="LinkedIn">LN</a>
          </div>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Explorar</h4>
          <ul className="footer-links-list">
            <li onClick={() => handleScrollTo('hero')}>Inicio</li>
            <li onClick={() => handleScrollTo('catalog')}>Catálogo</li>
            <li onClick={() => handleScrollTo('features')}>Beneficios</li>
            <li onClick={() => handleScrollTo('team')}>Equipo</li>
          </ul>
        </div>

        <div className="footer-contact-col">
          <h4 className="footer-col-title">Contacto Turing IA</h4>
          <ul className="footer-contact-list">
            <li>📧 <a href="mailto:cheguero0503@gmail.com">cheguero0503@gmail.com</a></li>
            <li>📞 <a href="tel:+527225620646">+52 722 562 0646</a></li>
            <li>🏢 Ciudad de México, México</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright">
            &copy; 2026 Turing Tech Store. Todos los derechos reservados. Desarrollado para el Proceso de Selección de Turing Inteligencia Artificial S.A.S.
          </p>
          <div className="footer-legal-links">
            <a href="#">Términos de Servicio</a>
            <a href="#">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
