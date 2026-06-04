import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleTabChange = (isLogin) => {
    setIsLoginTab(isLogin);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const url = isLoginTab 
      ? `${API_BASE_URL}/api/auth/login` 
      : `${API_BASE_URL}/api/auth/register`;

    const payload = isLoginTab 
      ? { identifier, password } 
      : { username, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      if (json.success) {
        if (isLoginTab) {
          localStorage.setItem('turing_token', json.data.token);
          onLoginSuccess(json.data.user);
          onClose();
        } else {
          setSuccessMsg(json.message);
          setTimeout(() => {
            setIsLoginTab(true);
            setIdentifier(email || username);
            setPassword('');
            setSuccessMsg('');
          }, 2000);
        }
      } else {
        setError(json.message || 'Ocurrió un error en la solicitud.');
      }
    } catch (err) {
      console.error('Auth request error:', err);
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container glow-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-tabs">
          <button 
            className={`modal-tab ${isLoginTab ? 'active' : ''}`}
            onClick={() => handleTabChange(true)}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`modal-tab ${!isLoginTab ? 'active' : ''}`}
            onClick={() => handleTabChange(false)}
          >
            Registrarse
          </button>
        </div>

        {error && <div className="auth-alert alert-danger">{error}</div>}
        {successMsg && <div className="auth-alert alert-success">{successMsg}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          {isLoginTab ? (
            <>
              <div className="form-group">
                <label htmlFor="login-id">Usuario o Correo Electrónico</label>
                <input
                  type="text"
                  id="login-id"
                  className="form-control"
                  placeholder="ej. admin o admin@turingtech.com"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-pass">Contraseña</label>
                <input
                  type="password"
                  id="login-pass"
                  className="form-control"
                  placeholder="Contraseña"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="reg-user">Nombre de Usuario</label>
                <input
                  type="text"
                  id="reg-user"
                  className="form-control"
                  placeholder="Mínimo 3 caracteres"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-email">Correo Electrónico</label>
                <input
                  type="email"
                  id="reg-email"
                  className="form-control"
                  placeholder="ej. usuario@turingtech.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-pass">Contraseña</label>
                <input
                  type="password"
                  id="reg-pass"
                  className="form-control"
                  placeholder="Mínimo 6 caracteres"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          )}



          <button 
            type="submit" 
            className="btn btn-primary w-full submit-auth-btn"
            disabled={loading}
          >
            {loading ? 'Procesando...' : isLoginTab ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
}

