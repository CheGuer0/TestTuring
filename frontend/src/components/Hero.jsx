import React from 'react';
import './Hero.css';

export default function Hero({ onExploreClick }) {
  return (
    <header className="hero-section" id="hero">
      <div className="hero-grid-bg"></div>
      <div className="container hero-container animate-fade-in-up">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <span>INNOVACIÓN EN HARDWARE</span>
          </div>
          <h1 className="hero-title">
            Domina el Juego. <br />
            <span className="gradient-text">Potencia tu Rendimiento.</span>
          </h1>
          <p className="hero-description">
            En <strong>Turing Tech Store</strong> equipamos a gamers, creadores y profesionales con componentes de hardware premium de última generación. Ensambles optimizados y componentes rigurosamente testeados.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={onExploreClick}>
              Explorar Catálogo
            </button>
            <a href="#features" className="btn btn-secondary">
              Nuestros Beneficios
            </a>
          </div>
        </div>

        <div className="hero-highlights-row">
          <div className="highlight-card glow-card">
            <div className="highlight-icon icon-shipping"></div>
            <h3 className="highlight-card-title">Envíos Asegurados</h3>
            <p className="highlight-card-desc">Despacho exprés a nivel nacional con embalaje de seguridad ultra resistente.</p>
          </div>
          <div className="highlight-card glow-card">
            <div className="highlight-icon icon-warranty"></div>
            <h3 className="highlight-card-title">Garantía Turing</h3>
            <p className="highlight-card-desc">Hasta 3 años de garantía oficial directa del fabricante en componentes selectos.</p>
          </div>
          <div className="highlight-card glow-card">
            <div className="highlight-icon icon-support"></div>
            <h3 className="highlight-card-title">Soporte Experto</h3>
            <p className="highlight-card-desc">Asesoría de compatibilidad de hardware por ingenieros especializados 24/7.</p>
          </div>
        </div>
      </div>
    </header>
  );
}

