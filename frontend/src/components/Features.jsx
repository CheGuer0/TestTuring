import React from 'react';
import './Features.css';

export default function Features() {
  const features = [
    {
      title: 'Componentes Certificados',
      desc: 'Hardware 100% original con sellos del fabricante e inspección de autenticidad.',
      icon: '✅',
      isActive: true
    },
    {
      title: 'Cero Cuellos de Botella',
      desc: 'Analizamos y verificamos cada pieza para garantizar la máxima sinergia operativa.',
      icon: '⚡',
      isActive: true
    },
    {
      title: 'Montaje Profesional',
      desc: 'Ordenado manejo de cables, control de flujo de aire y pruebas térmicas extremas.',
      icon: '🛠️',
      isActive: false
    },
    {
      title: 'Comunidad Turing',
      desc: 'Entra a nuestro discord privado para soporte prioritario y ofertas flash exclusivas.',
      icon: '👥',
      isActive: false
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">NUESTRO ESTÁNDAR</span>
          <h2 className="section-title">¿Por Qué Elegir Turing Tech?</h2>
          <div className="section-divider"></div>
        </div>

        <div className="features-grid">
          {features.map((feat, index) => (
            <div 
              key={index} 
              className={`feature-box ${feat.isActive ? 'active glow-card' : 'inactive-hashed'}`}
            >
              {!feat.isActive && <div className="hash-pattern"></div>}
              
              <div className="feature-icon-wrapper">
                <span className="feature-icon">{feat.icon}</span>
              </div>
              <h3 className="feature-box-title">{feat.title}</h3>
              <p className="feature-box-desc">{feat.desc}</p>
              
              <span className="feature-status-label">
                {feat.isActive ? 'Estándar Incluido' : 'Próximamente'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

