import React from 'react';
import './Team.css';

export default function Team() {
  const members = [
    {
      name: 'Ing. Alejandro Torres',
      role: 'Lead PC Builder & Hardware Architect',
      quote: 'Cada cable ordenado y cada flujo de aire optimizado garantizan la longevidad del sistema.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
    },
    {
      name: 'Dra. Sofía Mendoza',
      role: 'Directora de Control de Calidad y Compatibilidad',
      quote: 'Llevamos cada componente al límite en nuestras pruebas de estrés para asegurar cero fallos.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
    },
    {
      name: 'Mtro. Carlos Ruiz',
      role: 'Especialista en Refrigeración y Overclocking',
      quote: 'La temperatura baja es sinónimo de rendimiento sostenido. Calibramos cada ventilador.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <section className="team-section" id="team">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">EXPERTOS CERTIFICADOS</span>
          <h2 className="section-title">El Equipo de Turing Tech</h2>
          <div className="section-divider"></div>
        </div>

        <div className="team-grid">
          {members.map((member, index) => (
            <div key={index} className="team-member-card animate-fade-in-up">
              <div className="avatar-wrapper">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="member-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="avatar-glow"></div>
              </div>
              <h3 className="member-name">{member.name}</h3>
              <span className="member-role">{member.role}</span>
              <p className="member-quote">"{member.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
